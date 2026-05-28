import { NextResponse } from 'next/server'
import { getAccountsFromSheet } from '@/lib/googleSheets'
import { getTicketsFromFreshdesk } from '@/lib/freshdesk'

export async function GET() {
  try {
    console.log('📊 Starting dashboard fetch...')
    
    const accounts = await getAccountsFromSheet()
    console.log(`✅ Got ${accounts.length} accounts`)

    const allTickets = await getTicketsFromFreshdesk()
    console.log(`✅ Got ${allTickets.length} tickets`)

    if (!accounts || accounts.length === 0) {
      return NextResponse.json({
        error: 'No accounts from Google Sheets',
        accounts: [],
        totalTickets: allTickets.length,
        success: false,
      })
    }

    const accountsWithMetrics = accounts.map((account) => {
      const accountTickets = allTickets.filter((ticket: any) => {
        const clientName = ticket.custom_fields?.cf_client || ''
        const clientShort = ticket.custom_fields?.cf_client450902 || ''
        
        return (
          clientName.toLowerCase().includes(account.company.toLowerCase()) ||
          clientShort.toLowerCase().includes(account.company.toLowerCase()) ||
          account.company.toLowerCase().includes(clientName.toLowerCase())
        )
      })

      let healthScore = account.healthScore
      const criticalTickets = accountTickets.filter((t: any) => t.priority === 4).length
      const openTickets = accountTickets.filter((t: any) => t.status === 2).length

      healthScore -= criticalTickets * 5
      healthScore -= openTickets * 2
      healthScore = Math.max(0, Math.min(100, healthScore))

      let riskLevel: 'green' | 'yellow' | 'red' = 'green'
      if (healthScore >= 70) riskLevel = 'green'
      else if (healthScore >= 40) riskLevel = 'yellow'
      else riskLevel = 'red'

      let escalationPercentage = Math.round(account.escalationProbability * 100)
      if (criticalTickets > 0) {
        escalationPercentage = Math.min(100, escalationPercentage + criticalTickets * 15)
      }

      return {
        name: account.name,
        company: account.company,
        email: account.email,
        healthScore,
        riskLevel,
        escalationPercentage,
        ticketCount: accountTickets.length,
        criticalTickets,
      }
    })

    return NextResponse.json({
      accounts: accountsWithMetrics,
      totalTickets: allTickets.length,
      success: true,
    })
  } catch (error: any) {
    console.error('❌ Dashboard error:', error)
    return NextResponse.json({
      accounts: [],
      totalTickets: 0,
      error: error.message,
      stack: error.stack,
      success: false,
    }, { status: 500 })
  }
}
