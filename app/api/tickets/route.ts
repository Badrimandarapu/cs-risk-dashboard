import { NextResponse } from 'next/server'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = require('@/lib/db/prisma').prisma as any

interface TicketRow {
  id: bigint
  subject: string
  status: number
  priority: number
  account: { name: string } | null
  createdAt: Date
  resolvedAt: Date | null
  isEscalated: boolean
  requesterId: bigint | null
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '1month'

    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    
    if (range === '7days') {
      startDate.setDate(now.getDate() - 7)
    } else if (range === '1month') {
      startDate.setMonth(now.getMonth() - 1)
    } else if (range === '3months') {
      startDate.setMonth(now.getMonth() - 3)
    }

    const tickets = await prisma.supportTicket.findMany({
      where: {
        requesterId: { not: BigInt(36016928761) },
        createdAt: { gte: startDate }
      },
      select: {
        id: true,
        subject: true,
        status: true,
        priority: true,
        account: { select: { name: true } },
        createdAt: true,
        resolvedAt: true,
        isEscalated: true,
        requesterId: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    const statusMap: Record<number, string> = { 2: 'Open', 3: 'Pending', 4: 'Resolved', 5: 'Closed' }

    const formatted = (tickets as TicketRow[]).map((t: TicketRow) => ({
      id: t.id.toString(),
      subject: t.subject,
      status: statusMap[t.status] || 'Unknown',
      priority: t.priority,
      account: { name: t.account?.name || 'Unknown' },
      createdAt: t.createdAt.toISOString(),
      resolvedAt: t.resolvedAt ? t.resolvedAt.toISOString() : null,
      isEscalated: t.isEscalated,
    }))

    return NextResponse.json({ tickets: formatted, total: formatted.length })
  } catch (err: unknown) {
    console.error('Tickets API error:', err)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
