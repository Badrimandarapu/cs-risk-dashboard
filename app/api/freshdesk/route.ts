import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey = 'U6ZNaOkxNplnfPesmJ0I'
    const auth = `Basic ${Buffer.from(`${apiKey}:X`).toString('base64')}`

    // Fetch real tickets
    const ticketsRes = await fetch('https://increff.freshdesk.com/api/v2/tickets', {
      headers: { 'Authorization': auth },
    })

    if (!ticketsRes.ok) {
      return NextResponse.json({ success: false, accounts: [], error: 'Freshdesk API failed' })
    }

    const ticketsData = await ticketsRes.json()
    const tickets = ticketsData.tickets || []

    // Group by client name from custom field (more reliable)
    const clientMap: Record<string, any[]> = {}

    tickets.forEach((ticket: any) => {
      const clientName = ticket.custom_fields?.cf_client || ticket.custom_fields?.cf_client450902 || 'Unknown'
      if (!clientMap[clientName]) {
        clientMap[clientName] = []
      }
      clientMap[clientName].push(ticket)
    })

    // Transform into accounts
    const accounts = Object.entries(clientMap)
      .filter(([name]) => name !== 'Unknown')
      .map(([name, tix]) => {
        const open = tix.filter((t: any) => t.status === 2).length
        const critical = tix.filter((t: any) => t.priority >= 3 && t.status === 2).length
        const health = Math.max(0, 100 - open * 5 - critical * 15)

        return {
          id: name,
          name,
          health,
          risk: health >= 70 ? 'green' : health >= 40 ? 'yellow' : 'red',
          open,
          critical,
          total: tix.length,
        }
      })
      .sort((a, b) => a.health - b.health)

    return NextResponse.json({
      success: true,
      accounts,
      totalTickets: tickets.length,
      source: 'freshdesk-real',
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      accounts: [],
      error: error.message,
    })
  }
}
