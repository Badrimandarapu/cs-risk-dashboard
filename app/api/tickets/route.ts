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
}

export async function GET() {
  try {
    const tickets = await prisma.supportTicket.findMany({
      select: {
        id: true,
        subject: true,
        status: true,
        priority: true,
        account: { select: { name: true } },
        createdAt: true,
        resolvedAt: true,
        isEscalated: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 500,
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
