import { NextResponse } from 'next/server'

export async function GET() {
  const API_KEY = process.env.FRESHDESK_API_KEY
  const DOMAIN = process.env.FRESHDESK_DOMAIN

  try {
    console.log('API_KEY exists:', !!API_KEY)
    console.log('DOMAIN:', DOMAIN)

    const url = `https://${DOMAIN}.freshdesk.com/api/v2/tickets`
    console.log('Fetching from:', url)

    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${API_KEY}:X`).toString('base64')}`,
      },
    })

    console.log('Response status:', response.status)
    const text = await response.text()
    console.log('Response text:', text.substring(0, 200))

    // Try to parse as JSON
    let data
    try {
      data = JSON.parse(text)
    } catch {
      return NextResponse.json({
        error: 'Invalid JSON response',
        status: response.status,
        responsePreview: text.substring(0, 200),
      })
    }

    const tickets = data.tickets || []

    return NextResponse.json({
      tickets: tickets,
      totalCount: tickets.length,
    })
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack
    }, { status: 200 })
  }
}