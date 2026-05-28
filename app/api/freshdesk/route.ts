import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const apiKey = 'U6ZNaOkxNplnfPesmJ0I'
    const domain = 'increff.freshdesk.com'
    const auth = `Basic ${Buffer.from(`${apiKey}:X`).toString('base64')}`

    console.log('[FRESHDESK] Starting fetch...')
    console.log('[FRESHDESK] Auth:', auth.substring(0, 20) + '...')
    console.log('[FRESHDESK] URL: https://' + domain + '/api/v2/tickets')

    const ticketsRes = await fetch(`https://${domain}/api/v2/tickets`, {
      method: 'GET',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json',
      },
    })

    console.log('[FRESHDESK] Response status:', ticketsRes.status)
    console.log('[FRESHDESK] Response ok:', ticketsRes.ok)

    const text = await ticketsRes.text()
    console.log('[FRESHDESK] Response length:', text.length)
    console.log('[FRESHDESK] Response preview:', text.substring(0, 200))

    if (!ticketsRes.ok) {
      return NextResponse.json({
        success: false,
        accounts: [],
        error: `HTTP ${ticketsRes.status}`,
        responsePreview: text.substring(0, 500),
      })
    }

    const ticketsData = JSON.parse(text)
    const tickets = ticketsData.tickets || []

    console.log('[FRESHDESK] Tickets found:', tickets.length)

    // Group by client
    const clientMap: Record<string, any[]> = {}
    tickets.forEach((ticket: any) => {
      const clientName = ticket.custom_fields?.cf_client || 'Unknown'
      if (clientName !== 'Unknown') {
        if (!clientMap[clientName]) clientMap[clientName] = []
        clientMap[clientName].push(ticket)
      }
    })

    console.log('[FRESHDESK] Unique clients:', Object.keys(clientMap).length)

    const accounts = Object.entries(clientMap).map(([name, tix]) => {
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

    return NextResponse.json({
      success: true,
      accounts,
      totalTickets: tickets.length,
      debug: {
        clientsFound: Object.keys(clientMap).length,
        accountsGenerated: accounts.length,
      }
    })
  } catch (error: any) {
    console.error('[FRESHDESK] ERROR:', error)
    return NextResponse.json({
      success: false,
      accounts: [],
      error: error.message,
      stack: error.stack,
    })
  }
}
