import { NextResponse } from 'next/server'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = require('@/lib/db/prisma').prisma as any

interface Signal {
  id: bigint
  severity: string
  signalType: string
  confidence: number
  evidence: string
  account: { id: string; name: string; displayName: string | null }
}

export async function GET() {
  try {
    const signals = await prisma.operationalSignal.findMany({
      where: { isActive: true },
      include: { account: { select: { id: true, name: true, displayName: true } } },
      orderBy: { confidence: 'desc' },
      take: 100,
    })

    const severityMap: Record<string, string> = { CRITICAL: 'critical', HIGH: 'high', MEDIUM: 'medium', LOW: 'low' }
    const probabilityMap: Record<string, number> = { CRITICAL: 95, HIGH: 75, MEDIUM: 50, LOW: 25 }
    const typeLabels: Record<string, string> = {
      REPEATED_REOPENS: 'Repeated Issue Resolution Failures',
      TICKET_SPIKE: 'Support Load Spike',
      SLA_BREACH_CLUSTER: 'SLA Breach Pattern',
      SENTIMENT_DECLINE: 'Sentiment Decline',
      EXECUTIVE_INVOLVEMENT: 'Executive Escalation',
      EXPLICIT_ESCALATION: 'Active Escalation',
      CRITICAL_UNRESOLVED: 'Critical Tickets Unresolved',
      STAKEHOLDER_INACTIVITY: 'Stakeholder Disengagement',
    }

    const risks = (signals as Signal[]).map((signal: Signal) => ({
      id: signal.id.toString(),
      account: signal.account.displayName || signal.account.name,
      type: typeLabels[signal.signalType] || signal.signalType,
      severity: severityMap[signal.severity] || 'medium',
      probability: Math.round((probabilityMap[signal.severity] || 50) * signal.confidence),
      description: signal.evidence,
      signalType: signal.signalType,
      confidence: signal.confidence,
    }))

    return NextResponse.json({ risks, total: risks.length })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
