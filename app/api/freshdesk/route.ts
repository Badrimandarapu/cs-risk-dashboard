import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey = 'WwlSY1ncwyBK5e7MXKv0'  // New key
    const domain = 'increff.freshdesk.com'
    const auth = Buffer.from(`${apiKey}:X`).toString('base64')

    console.log('[API] Testing new key...')
    console.log('[API] Fetching from:', domain)

    const res = await fetch(`https://${domain}/api/v2/tickets`, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    })

    console.log('[API] Status:', res.status)
    
    const data = await res.json()
    const tickets = data.tickets || []
    
    console.log('[API] Tickets returned:', tickets.length)

    if (tickets.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Got 0 tickets - key likely has IP block too',
        status: res.status,
      })
    }

    // Group by client
    const clientMap: Record<string, any[]> = {}
    tickets.forEach((t: any) => {
      const name = t.custom_fields?.cf_client || 'Unknown'
      if (name !== 'Unknown') {
        if (!clientMap[name]) clientMap[name] = []
        clientMap[name].push(t)
      }
    })

    const accounts = Object.entries(clientMap).map(([name, tix]) => {
      const open = tix.filter((t: any) => t.status === 2).length
      const critical = tix.filter((t: any) => t.priority >= 3).length
      const health = Math.max(0, 100 - open * 5 - critical * 15)
      return { id: name, name, health, risk: health >= 70 ? 'green' : health >= 40 ? 'yellow' : 'red', open, critical, total: tix.length }
    }).sort((a, b) => a.health - b.health)

    return NextResponse.json({ success: true, accounts, totalTickets: tickets.length })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message })
  }
}
