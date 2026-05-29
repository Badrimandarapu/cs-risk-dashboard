import { NextResponse } from 'next/server'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = require('@/lib/db/prisma').prisma as any

export async function GET() {
  try {
    const tickets = await prisma.supportTicket.findMany({
      select: { status: true, priority: true, account: { select: { name: true } }, isEscalated: true, tags: true, metadata: true }
    })

    const statusMap: Record<number, string> = { 2: 'Open', 3: 'Pending', 4: 'Resolved', 5: 'Closed' }
    const priorityMap: Record<number, string> = { 1: 'Low', 2: 'Medium', 3: 'High', 4: 'Urgent' }
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#ef4444', '#10b981', '#06b6d4', '#6366f1']

    const statusDist: Record<string, number> = {}
    const priorityDist: Record<string, number> = {}
    const clientVol: Record<string, number> = {}
    const catCount: Record<string, number> = {}

    for (const t of tickets) {
      const s = statusMap[t.status] || 'Unknown'
      const p = priorityMap[t.priority] || 'Unknown'
      const c = t.account?.name || 'Unknown'
      statusDist[s] = (statusDist[s] || 0) + 1
      priorityDist[p] = (priorityDist[p] || 0) + 1
      clientVol[c] = (clientVol[c] || 0) + 1
      if (t.tags) for (const tag of t.tags) catCount[tag] = (catCount[tag] || 0) + 1
    }

    return NextResponse.json({
      kpis: {
        totalTickets: tickets.length,
        openTickets: statusDist['Open'] || 0,
        resolvedTickets: statusDist['Resolved'] || 0,
        escalatedTickets: tickets.filter(t => t.isEscalated).length,
      },
      status: Object.entries(statusDist).map(([s, c], i) => ({ status: s, count: c, color: colors[i] })),
      priority: Object.entries(priorityDist).map(([n, v], i) => ({ name: n, value: v, color: colors[i] })),
      clients: Object.entries(clientVol).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, tickets]) => ({ name, tickets })),
      categories: Object.entries(catCount).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, value], i) => ({ name, value, color: colors[i] })),
    })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
