import { NextResponse } from 'next/server'
import { getTickets } from '@/lib/freshdesk'

export async function GET() {
  try {
    const tickets = await getTickets()
    return NextResponse.json({ tickets })
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json({ tickets: [] }, { status: 200 })
  }
}