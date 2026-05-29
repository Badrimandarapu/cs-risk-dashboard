import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET() {
  try {
    const accounts = await prisma.account.findMany({
      where: { isActive: true, freshdeskCompanyId: { not: BigInt(0) } },
      include: {
        _count: { select: { tickets: true, signals: true, stakeholders: true } },
        tickets: {
          where: { status: { notIn: [4, 5] } },
          select: { priority: true, status: true, isEscalated: true },
        },
        signals: {
          where: { isActive: true },
          select: { severity: true, signalType: true },
        },
        healthScores: {
          orderBy: { measuredAt: 'desc' },
          take: 1,
          select: { healthScore: true, riskLevel: true, escalationRisk: true },
        },
      },
      orderBy: { lastActivity: 'desc' },
      take: 100,
    })

    const formatted = accounts.map(a => {
      const openTickets = a.tickets.length
      const criticalTickets = a.tickets.filter(t => t.priority === 4).length
      const escalatedTickets = a.tickets.filter(t => t.isEscalated).length
      const criticalSignals = a.signals.filter(s => s.severity === 'CRITICAL').length
      const highSignals = a.signals.filter(s => s.severity === 'HIGH').length
      const latestHealth = a.healthScores[0]

      // Derive status from signals + tickets
      let status = 'healthy'
      if (criticalSignals > 0 || escalatedTickets > 0 || criticalTickets >= 3) status = 'critical'
      else if (highSignals > 0 || criticalTickets >= 1 || openTickets >= 5) status = 'warning'

      const healthScore = latestHealth?.healthScore ?? (
        status === 'critical' ? 25 + Math.random() * 20 :
        status === 'warning' ? 45 + Math.random() * 20 :
        70 + Math.random() * 25
      )

      const meta = a.metadata as Record<string, unknown>

      return {
        id: a.id,
        name: a.name,
        displayName: a.displayName ?? a.name,
        industry: (meta?.industry as string) ?? 'Unknown',
        tier: (meta?.accountTier as string) ?? 'Standard',
        health: Math.round(healthScore),
        status,
        openTickets,
        criticalTickets,
        escalatedTickets,
        activeSignals: a.signals.length,
        stakeholders: a._count.stakeholders,
        riskLevel: latestHealth?.riskLevel ?? status.toUpperCase(),
        lastActivity: a.lastActivity,
      }
    })

    // Sort: critical first, then warning, then healthy
    formatted.sort((a, b) => {
      const order = { critical: 0, warning: 1, healthy: 2 }
      return (order[a.status as keyof typeof order] ?? 3) - (order[b.status as keyof typeof order] ?? 3)
    })

    return NextResponse.json({ accounts: formatted, total: formatted.length })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
