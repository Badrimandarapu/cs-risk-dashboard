import { NextResponse } from 'next/server'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = require('@/lib/db/prisma').prisma as any

export async function GET() {
  try {
    const tickets = await prisma.supportTicket.findMany({
      select: {
        status: true,
        priority: true,
        account: { select: { name: true } },
        tags: true,
      },
    })

    const statusCount: Record<string, number> = { 'Open': 0, 'Pending': 0, 'Resolved': 0 }
    const priorityCount: Record<string, number> = { 'Low': 0, 'Medium': 0, 'High': 0, 'Urgent': 0 }
    const clientCount: Record<string, number> = {}
    const categoryCount: Record<string, number> = {}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const ticket of tickets as any[]) {
      if (ticket.status === 2) statusCount['Open']++
      else if (ticket.status === 3) statusCount['Pending']++
      else if (ticket.status === 4 || ticket.status === 5) statusCount['Resolved']++ // Combine closed+resolved

      const priorityMap: Record<number, string> = { 1: 'Low', 2: 'Medium', 3: 'High', 4: 'Urgent' }
      const priority = priorityMap[ticket.priority]
      if (priority) priorityCount[priority]++

      const client = ticket.account?.name || 'Unknown'
      clientCount[client] = (clientCount[client] || 0) + 1

      if (ticket.tags && Array.isArray(ticket.tags)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const tag of ticket.tags as any[]) {
          categoryCount[tag] = (categoryCount[tag] || 0) + 1
        }
      }
    }

    return NextResponse.json({
      status: Object.entries(statusCount).map(([name, value]) => ({ name, value })),
      priority: Object.entries(priorityCount).map(([name, value]) => ({ name, value })),
      clients: Object.entries(clientCount).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, count]) => ({ name, tickets: count })),
      categories: Object.entries(categoryCount).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([category, count]) => ({ category, count })),
    })
  } catch (err: unknown) {
    console.error('Analytics error:', err)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
