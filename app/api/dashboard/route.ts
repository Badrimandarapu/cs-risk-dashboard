import { NextResponse } from 'next/server'

async function getClientsFromSheet() {
  const SHEET_ID = '1hf1DESzc6ub-88V-jilbxGBe_0nu0Ssp0vaTsDKqYNA'
  const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`
  
  try {
    const response = await fetch(csvUrl, { cache: 'no-store' })
    const csv = await response.text()
    const lines = csv.split('\n').filter(l => l.trim())
    return lines.slice(1).map(line => line.trim()).filter(Boolean)
  } catch (error) {
    console.error('Failed to fetch clients:', error)
    return []
  }
}

async function getTicketsFromPastHour() {
  const API_KEY = process.env.FRESHDESK_API_KEY
  const DOMAIN = process.env.FRESHDESK_DOMAIN
  
  if (!API_KEY || !DOMAIN) return []
  
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const query = `created_at:>='${oneHourAgo}'`
  
  try {
    const auth = Buffer.from(`${API_KEY}:X`).toString('base64')
    const response = await fetch(
      `https://${DOMAIN}.freshdesk.com/api/v2/tickets?query="${encodeURIComponent(query)}"`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      }
    )
    
    if (!response.ok) return []
    const data = await response.json()
    return data.tickets || []
  } catch (error) {
    console.error('Failed to fetch tickets:', error)
    return []
  }
}

function extractClientFromTicket(ticket: any): string | null {
  const cfClient = ticket.custom_fields?.cf_client || ''
  if (cfClient) return cfClient
  
  const cfClientShort = ticket.custom_fields?.cf_client450902 || ''
  if (cfClientShort) return cfClientShort
  
  return null
}

export async function GET() {
  try {
    const clients = await getClientsFromSheet()
    const allTickets = await getTicketsFromPastHour()
    
    const clientMetrics: Record<string, any> = {}
    
    for (const client of clients) {
      clientMetrics[client] = {
        name: client,
        totalTickets: 0,
        openTickets: 0,
        criticalTickets: 0,
      }
    }
    
    for (const ticket of allTickets) {
      const clientName = extractClientFromTicket(ticket)
      if (!clientName) continue
      
      const matchedClient = clients.find(c => 
        c.toLowerCase().includes(clientName.toLowerCase()) ||
        clientName.toLowerCase().includes(c.toLowerCase())
      )
      
      if (!matchedClient) continue
      
      const metrics = clientMetrics[matchedClient]
      metrics.totalTickets++
      
      if (ticket.status === 2) metrics.openTickets++
      if (ticket.priority === 4) metrics.criticalTickets++
    }
    
    const accounts = Object.values(clientMetrics).map((metric: any) => {
      let healthScore = 100
      healthScore -= metric.openTickets * 5
      healthScore -= metric.criticalTickets * 15
      healthScore = Math.max(0, Math.min(100, healthScore))
      
      let riskLevel: 'green' | 'yellow' | 'red' = 'green'
      if (healthScore < 40) riskLevel = 'red'
      else if (healthScore < 70) riskLevel = 'yellow'
      
      return {
        name: metric.name,
        company: metric.name,
        email: '',
        healthScore,
        riskLevel,
        escalationPercentage: Math.min(100, metric.criticalTickets * 20),
        ticketCount: metric.openTickets,
        criticalTickets: metric.criticalTickets,
        totalTickets: metric.totalTickets,
      }
    })
    
    return NextResponse.json({
      accounts: accounts.filter(a => a.totalTickets > 0),
      totalTickets: allTickets.length,
      success: true,
    })
  } catch (error: any) {
    return NextResponse.json({
      accounts: [],
      totalTickets: 0,
      error: error.message,
      success: false,
    }, { status: 500 })
  }
}
