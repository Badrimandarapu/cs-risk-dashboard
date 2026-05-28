import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Mock data - no Freshdesk connection yet
    const accounts = [
      { id: 1, name: 'Acme Global', healthScore: 32, riskLevel: 'red', metrics: { openTickets: 12, criticalTickets: 5 } },
      { id: 2, name: 'TechVenture', healthScore: 58, riskLevel: 'yellow', metrics: { openTickets: 6, criticalTickets: 2 } },
      { id: 3, name: 'GlobalTrade', healthScore: 85, riskLevel: 'green', metrics: { openTickets: 2, criticalTickets: 0 } },
    ]

    return NextResponse.json({
      success: true,
      accounts,
      totalTickets: 20,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error' }, { status: 500 })
  }
}
