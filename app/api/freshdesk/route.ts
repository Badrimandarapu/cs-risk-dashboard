import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey = 'U6ZNaOkxNplnfPesmJ0I'
    const domain = 'increff.freshdesk.com'
    const auth = Buffer.from(`${apiKey}:X`).toString('base64')

    // Match EXACT Postman headers
    const ticketsRes = await fetch(`https://${domain}/api/v2/tickets`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; Vercel)',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
      },
    })

    if (!ticketsRes.ok) {
      throw new Error(`Status ${ticketsRes.status}`)
    }

    const data = await ticketsRes.json()
    const tickets = data.tickets || []

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
      return {
        id: name, name,
        health,
        risk: health >= 70 ? 'green' : health >= 40 ? 'yellow' : 'red',
        open, critical, total: tix.length,
      }
    }).sort((a, b) => a.health - b.health)

    return NextResponse.json({ success: true, accounts, totalTickets: tickets.length })
  } catch (error: any) {
    return NextResponse.json({ success: false, accounts: [], error: error.message })
  }
}
