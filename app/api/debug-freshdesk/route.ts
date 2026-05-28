import { NextResponse } from 'next/server'

export async function GET() {
  const API_KEY = process.env.FRESHDESK_API_KEY
  const DOMAIN = process.env.FRESHDESK_DOMAIN

  try {
    console.log('API_KEY:', !!API_KEY)
    console.log('DOMAIN:', DOMAIN)

    if (!API_KEY || !DOMAIN) {
      return NextResponse.json({
        error: 'Missing credentials',
        hasApiKey: !!API_KEY,
        hasDomain: !!DOMAIN,
      })
    }

    const auth = Buffer.from(`${API_KEY}:X`).toString('base64')
    const url = `https://${DOMAIN}.freshdesk.com/api/v2/tickets`

    console.log('Fetching from:', url)

    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    })

    console.log('Response status:', response.status)

    const data = await response.json()

    return NextResponse.json({
      status: response.status,
      ticketCount: data.tickets?.length || 0,
      sampleTickets: data.tickets?.slice(0, 3) || [],
      fullResponse: data,
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
    })
  }
}