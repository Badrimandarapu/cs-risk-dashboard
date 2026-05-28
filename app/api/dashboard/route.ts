import { NextResponse } from 'next/server'
import { getAccountsFromSheet } from '@/lib/googleSheets'
import { getTicketsFromFreshdesk } from '@/lib/freshdesk'

export async function GET() {
  try {
    // Fetch real accounts from Google Sheets
    const accounts = await getAccountsFromSheet()
    
    // Fetch real tickets from Freshdesk
    const allTickets = await getTicketsFromFreshdesk()

    // Map tickets to accounts and calculate metrics
    const accountsWithMetrics = accounts.map((account) => {
      // Simple match: tickets with account name in subject/description
      const accountTickets = allTickets.filter((ticket: any) => {
        const text = (ticket.subject + ' ' + (ticket.description || '')).toLowerCase()
        return text.includes(account.name.toLowerCase()) || 
               text.includes(account.company.toLowerCase())
      })

      // Calculate updated health score based on tickets
      let healthScore = account.healthScore
      const criticalTickets = accountTickets.filter((t: any) => t.priority === 4).length
      const openTickets = accountTickets.filter((t: any) => t.status === 2).length

      healthScore -= criticalTickets * 5
      healthScore -= openTickets * 2
      healthScore = Math.max(0, Math.min(100, healthScore))

      // Determine risk level
      let riskLevel: 'green' | 'yellow' | 'red' = 'green'
      if (healthScore >= 70) riskLevel = 'green'
      else if (healthScore >= 40) riskLevel = 'yellow'
      else riskLevel = 'red'

      // Calculate escalation percentage
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
    console.error('Dashboard error:', error)
    return NextResponse.json({
      accounts: [],
      totalTickets: 0,
      error: error.message,
      success: false,
    })
  }
}