import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = 'U6ZNaOkxNplnfPesmJ0I'
  const auth = Buffer.from(`${apiKey}:X`).toString('base64')

  try {
    // Fetch tickets
    const ticketsRes = await fetch(
      'https://increff.freshdesk.com/api/v2/tickets',
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    )

    const ticketsData = await ticketsRes.json()
    const tickets = ticketsData.tickets || []

    // Fetch companies
    const companiesRes = await fetch(
      'https://increff.freshdesk.com/api/v2/companies',
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    )

    const companiesData = await companiesRes.json()
    const companies = companiesData.companies || []

    // Process accounts
    const accounts = companies.map((company: any) => {
      const compTickets = tickets.filter((t: any) => t.company_id === company.id)
      const open = compTickets.filter((t: any) => t.status === 2).length
      const critical = compTickets.filter((t: any) => t.priority === 4).length
      const health = Math.max(0, 100 - open * 5 - critical * 15)

      return {
        id: company.id,
        name: company.name,
        health,
        risk: health >= 70 ? 'green' : health >= 40 ? 'yellow' : 'red',
        open,
        critical,
        total: compTickets.length,
      }
    })

    return NextResponse.json({
      success: true,
      accounts,
      totalTickets: tickets.length,
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      accounts: [],
    })
  }
}
