import { NextResponse } from 'next/server'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = require('@/lib/db/prisma').prisma as any

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
            createdAt: true
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
      const now = new Date()
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

      // Count tickets: this month vs previous month
      const thisMonthTickets = a.tickets.filter((t: any) => new Date(t.createdAt) >= oneMonthAgo).length
      const previousMonthTickets = a.tickets.filter((t: any) => {
        const createdDate = new Date(t.createdAt)
        return createdDate >= twoMonthsAgo && createdDate < oneMonthAgo
      }).length

      // Calculate ticket trend
      let ticketTrend = 'healthy'
      if (previousMonthTickets > 0) {
        const percentageChange = ((thisMonthTickets - previousMonthTickets) / previousMonthTickets) * 100
        if (percentageChange > 20) {
          ticketTrend = 'critical' // Drastically increased
        } else if (percentageChange > 0) {
          ticketTrend = 'warning' // Slight increase
        } else {
          ticketTrend = 'healthy' // Stable or reduced
        }
      }

      // OPEN = all tickets with status 2 (Open) or 3 (Pending)
      const openTickets = a.tickets.filter((t: any) => t.status === 2 || t.status === 3).length
      
      // Health color mapping: red = critical, yellow/orange = warning, green = healthy
      const healthColor = ticketTrend === 'critical' ? '#ef4444' : ticketTrend === 'warning' ? '#f59e0b' : '#10b981'
      
      // Health score: critical = low, warning = medium, healthy = high
      const health = ticketTrend === 'critical' ? 25 + Math.random() * 20 : ticketTrend === 'warning' ? 45 + Math.random() * 20 : 70 + Math.random() * 25

      // Escalated tickets
      const escalatedTickets = a.tickets.filter((t: any) => t.isEscalated).length

      return {
        id: a.id,
        name: a.name,
        displayName: a.displayName ?? a.name,
        health: Math.round(health),
        healthColor,
        status: ticketTrend,
        openTickets,
        escalatedTickets,
        activeSignals: a.signals.length,
        stakeholders: a._count.stakeholders,
        riskLevel: ticketTrend === 'critical' ? 'CRITICAL' : ticketTrend === 'warning' ? 'HIGH' : 'HEALTHY',
        lastActivity: a.lastActivity,
        ticketTrend: {
          thisMonth: thisMonthTickets,
          previousMonth: previousMonthTickets,
          change: previousMonthTickets > 0 ? Math.round(((thisMonthTickets - previousMonthTickets) / previousMonthTickets) * 100) : 0
        }
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
