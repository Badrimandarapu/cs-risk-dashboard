import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey = 'U6ZNaOkxNplnfPesmJ0I'
    const domain = 'support.increff'

    const auth = Buffer.from(`${apiKey}:X`).toString('base64')

    // Fetch companies
    const companiesRes = await fetch(
      `https://${domain}.freshdesk.com/api/v2/companies`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    )

    if (!companiesRes.ok) {
      return NextResponse.json({
        success: false,
        accounts: [],
        error: `Companies fetch failed: ${companiesRes.status}`,
      })
    }

    const companiesData = await companiesRes.json()
    const companies = companiesData.companies || []

    // Fetch tickets
    const ticketsRes = await fetch(
      `https://${domain}.freshdesk.com/api/v2/tickets`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    )

    if (!ticketsRes.ok) {
      return NextResponse.json({
        success: false,
        accounts: [],
        error: `Tickets fetch failed: ${ticketsRes.status}`,
      })
    }

    const ticketsData = await ticketsRes.json()
    const allTickets = ticketsData.tickets || []

    // Analyze each account
    const accounts = companies.slice(0, 10).map((company: any) => {
      const tickets = allTickets.filter((t: any) => t.company_id === company.id)
      const openTickets = tickets.filter((t: any) => t.status === 2)
      const criticalTickets = openTickets.filter((t: any) => t.priority === 4)

      const healthScore = Math.max(0, 100 - openTickets.length * 5 - criticalTickets.length * 15)
      const riskLevel = healthScore >= 70 ? 'green' : healthScore >= 40 ? 'yellow' : 'red'

      return {
        id: company.id,
        name: company.name,
        health: healthScore,
        risk: riskLevel,
        open: openTickets.length,
        critical: criticalTickets.length,
        total: tickets.length,
      }
    })

    return NextResponse.json({
      success: true,
      accounts,
      totalTickets: allTickets.length,
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      accounts: [],
      error: error.message || 'Unknown error',
    })
  }
}
