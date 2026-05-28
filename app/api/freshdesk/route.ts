import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey = 'U6ZNaOkxNplnfPesmJ0I'
    const domain = 'increff'

    const auth = Buffer.from(`${apiKey}:X`).toString('base64')

    // Fetch companies
    const companiesRes = await fetch(
      `https://${domain}.freshdesk.com/api/v2/companies`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const companiesData = await companiesRes.json()
    const companies = companiesData.companies || []

    console.log('Companies response:', companiesData)
    console.log('Companies count:', companies.length)

    // Fetch tickets
    const ticketsRes = await fetch(
      `https://${domain}.freshdesk.com/api/v2/tickets`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const ticketsData = await ticketsRes.json()
    const allTickets = ticketsData.tickets || []

    console.log('Tickets response keys:', Object.keys(ticketsData))
    console.log('Tickets count:', allTickets.length)

    const accounts = companies.slice(0, 10).map((company: any) => {
      const tickets = allTickets.filter((t: any) => t.company_id === company.id)
      const openTickets = tickets.filter((t: any) => t.status === 2)
      const criticalTickets = openTickets.filter((t: any) => t.priority === 4)

      const healthScore = Math.max(0, 100 - openTickets.length * 5 - criticalTickets.length * 15)

      return {
        id: company.id,
        name: company.name,
        health: healthScore,
        risk: healthScore >= 70 ? 'green' : healthScore >= 40 ? 'yellow' : 'red',
        open: openTickets.length,
        critical: criticalTickets.length,
      }
    })

    return NextResponse.json({
      success: true,
      accounts,
      totalTickets: allTickets.length,
      debug: {
        companiesCount: companies.length,
        ticketsCount: allTickets.length,
        companiesSample: companies.slice(0, 2),
        ticketsSample: allTickets.slice(0, 2),
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      accounts: [],
      error: error.message,
    })
  }
}
