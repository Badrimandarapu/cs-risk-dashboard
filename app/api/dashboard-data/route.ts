import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // For now, return mock data
    const mockAccounts = [
      {
        accountName: 'Acme Corp',
        healthScore: 45,
        riskLevel: 'red',
        escalationPercentage: 75,
        ticketCount: 5,
        criticalTickets: 2,
        sentiment: 'negative',
      },
      {
        accountName: 'TechCorp',
        healthScore: 65,
        riskLevel: 'yellow',
        escalationPercentage: 40,
        ticketCount: 3,
        criticalTickets: 0,
        sentiment: 'neutral',
      },
      {
        accountName: 'Innovation Inc',
        healthScore: 92,
        riskLevel: 'green',
        escalationPercentage: 5,
        ticketCount: 1,
        criticalTickets: 0,
        sentiment: 'positive',
      },
      {
        accountName: 'Global Systems',
        healthScore: 35,
        riskLevel: 'red',
        escalationPercentage: 85,
        ticketCount: 8,
        criticalTickets: 3,
        sentiment: 'negative',
      },
      {
        accountName: 'NextGen Solutions',
        healthScore: 70,
        riskLevel: 'yellow',
        escalationPercentage: 30,
        ticketCount: 2,
        criticalTickets: 0,
        sentiment: 'neutral',
      },
    ]

    return NextResponse.json({
      accounts: mockAccounts,
      totalTickets: 19,
      freshDeskConnected: true,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        accounts: [],
        error: error.message,
      },
      { status: 500 }
    )
  }
}