import { NextResponse } from 'next/server'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = require('@/lib/db/prisma').prisma as any

// Critical agent names - tickets with these agents are marked critical
const CRITICAL_AGENTS = ['anshuman', 'anurag', 'sudeep', 'harsha', 'anubhav', 'abhilash', 'harsh']

export async function GET() {
  try {
    const accounts = await prisma.account.findMany({
      where: { isActive: true, freshdeskCompanyId: { not: BigInt(0) } },
      include: {
        _count: { select: { tickets: true, signals: true, stakeholders: true } },
        tickets: {
          select: { 
            priority: true, 
            status: true, 
            isEscalated: true, 
            metadata: true,
            customFields: true 
          },
        },
        signals: {
          where: { isActive: true },
          select: { severity: true, signalType: true },
        },
      },
      orderBy: { lastActivity: 'desc' },
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formatted = (accounts as any[]).map((a: any) => {
      // OPEN = all tickets with status 2 (Open) or 3 (Pending)
      const openTickets = a.tickets.filter((t: any) => t.status === 2 || t.status === 3).length
      
      // All tickets for this account
      const totalTickets = a.tickets.length
      
      // Count tickets with critical agents or SLA breached
      let slaBreachedTickets = 0
      for (const t of a.tickets) {
        const metadata = t.metadata as any
        const customFields = t.customFields as any
        
        // Check if SLA breached
        if (metadata?.slaBreached === true) {
          slaBreachedTickets++
        }
        
        // Check if any critical agent is in metadata or custom fields
        const allText = JSON.stringify(metadata) + JSON.stringify(customFields)
        for (const agent of CRITICAL_AGENTS) {
          if (allText.toLowerCase().includes(agent.toLowerCase())) {
            slaBreachedTickets++
            break
          }
        }
      }
      
      // Remove duplicates by checking unique tickets
      const criticalTicketIds = new Set<any>()
      for (const t of a.tickets) {
        const metadata = t.metadata as any
        const customFields = t.customFields as any
        const allText = JSON.stringify(metadata) + JSON.stringify(customFields)
        
        let isCritical = metadata?.slaBreached === true
        for (const agent of CRITICAL_AGENTS) {
          if (allText.toLowerCase().includes(agent.toLowerCase())) {
            isCritical = true
            break
          }
        }
        
        if (isCritical) {
          criticalTicketIds.add(t)
        }
      }
      
      const criticalCount = criticalTicketIds.size
      
      // CRITICAL = percentage of critical tickets / total tickets
      const criticalPercentage = totalTickets > 0 ? (criticalCount / totalTickets) * 100 : 0
      
      // HEALTH = opposite of critical (100 - critical%)
      const health = Math.round(100 - criticalPercentage)
      
      // Escalated tickets
      const escalatedTickets = a.tickets.filter((t: any) => t.isEscalated).length

      return {
        id: a.id,
        name: a.name,
        displayName: a.displayName ?? a.name,
        health,
        status: criticalPercentage > 20 ? 'critical' : criticalPercentage > 10 ? 'warning' : 'healthy',
        openTickets,
        criticalTickets: criticalCount,
        escalatedTickets,
        activeSignals: a.signals.length,
        stakeholders: a._count.stakeholders,
        riskLevel: criticalPercentage > 20 ? 'CRITICAL' : criticalPercentage > 10 ? 'HIGH' : 'HEALTHY',
        lastActivity: a.lastActivity,
      }
    })

    // Sort: critical first
    formatted.sort((a: any, b: any) => {
      const order = { critical: 0, warning: 1, healthy: 2 }
      return (order[a.status as keyof typeof order] ?? 3) - (order[b.status as keyof typeof order] ?? 3)
    })

    // Calculate dashboard totals
    const totalAccounts = formatted.length
    const healthy = formatted.filter((a: any) => a.status === 'healthy').length
    const critical = formatted.filter((a: any) => a.status === 'critical').length
    const avgHealth = formatted.length > 0 ? Math.round(formatted.reduce((s: number, a: any) => s + a.health, 0) / formatted.length) : 0

    return NextResponse.json({ 
      accounts: formatted, 
      total: totalAccounts,
      summary: { totalAccounts, healthy, critical, avgHealth }
    })
  } catch (err: unknown) {
    console.error('Accounts error:', err)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
