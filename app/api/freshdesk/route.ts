import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey = 'U6ZNaOkxNplnfPesmJ0I'
    
    // Create EXACT auth header like Postman
    const auth = Buffer.from(`${apiKey}:X`).toString('base64')
    console.log('Auth header:', auth)
    console.log('Should be: VTZaTmFPa3hOcGxuZlBlc21KMEk6WA==')

    const url = 'https://increff.freshdesk.com/api/v2/tickets'
    console.log('Fetching:', url)

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    })

    console.log('Response status:', res.status)
    console.log('Response headers:', Object.fromEntries(res.headers))

    const data = await res.json()
    console.log('Response data keys:', Object.keys(data))
    console.log('Tickets count:', data.tickets?.length || 0)

    return NextResponse.json({
      success: true,
      tickets: data.tickets || [],
      totalTickets: data.tickets?.length || 0,
      debug: {
        authMatch: auth === 'VTZaTmFPa3hOcGxuZlBlc21KMEk6WA==',
        statusCode: res.status,
      }
    })
  } catch (error: any) {
    console.error('Full error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    })
  }
}
