import { NextResponse } from 'next/server'

export async function GET() {
  const API_KEY = process.env.FRESHDESK_API_KEY
  const DOMAIN = process.env.FRESHDESK_DOMAIN

  try {
    const response = await fetch(`https://${DOMAIN}.freshdesk.com/api/v2/tickets`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${API_KEY}:X`).toString('base64')}`,
      },
    })

    const data = await response.json()
    const tickets = data.tickets || []

    // Get unique priority and status values
    const priorities = [...new Set(tickets.map((t: any) => t.priority))]
    const statuses = [...new Set(tickets.map((t: any) => t.status))]

    return NextResponse.json({
      tickets: tickets,
      debug: {
        totalTickets: tickets.length,
        uniquePriorities: priorities,
        uniqueStatuses: statuses,
        sample: tickets.slice(0, 3),
      },
    })
  } catch (error: any) {
    console.error('Freshdesk Error:', error)
    return NextResponse.json({ 
      tickets: [],
      error: error.message 
    }, { status: 200 })
  }
}