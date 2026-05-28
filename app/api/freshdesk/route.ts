import { NextResponse } from 'next/server'

// Mock Freshdesk data - realistic for demo
const MOCK_COMPANIES = [
  { id: 1, name: 'Acme Global Corp', description: 'E-Commerce Platform' },
  { id: 2, name: 'TechVenture Inc', description: 'SaaS Analytics' },
  { id: 3, name: 'GlobalTrade Solutions', description: 'Logistics Software' },
  { id: 4, name: 'Fashion Retail Group', description: 'Fashion Tech' },
  { id: 5, name: 'CloudFirst Analytics', description: 'Data Platform' },
]

const MOCK_TICKETS = [
  { id: 1, company_id: 1, subject: 'Payment gateway integration failing', priority: 4, status: 2 },
  { id: 2, company_id: 1, subject: 'User authentication timeout', priority: 4, status: 2 },
  { id: 3, company_id: 1, subject: 'Database migration delayed', priority: 3, status: 2 },
  { id: 4, company_id: 1, subject: 'API rate limiting issues', priority: 4, status: 2 },
  { id: 5, company_id: 1, subject: 'Dashboard performance', priority: 3, status: 2 },
  
  { id: 6, company_id: 2, subject: 'Data export feature request', priority: 2, status: 2 },
  { id: 7, company_id: 2, subject: 'Report generation slow', priority: 3, status: 3 },
  { id: 8, company_id: 2, subject: 'API documentation updates', priority: 1, status: 2 },
  
  { id: 9, company_id: 3, subject: 'System working smoothly', priority: 1, status: 5 },
  { id: 10, company_id: 3, subject: 'Scheduled maintenance', priority: 2, status: 3 },
  
  { id: 11, company_id: 4, subject: 'Inventory sync failures', priority: 4, status: 2 },
  { id: 12, company_id: 4, subject: 'Mobile app crashes', priority: 4, status: 2 },
  { id: 13, company_id: 4, subject: 'User permission issues', priority: 3, status: 2 },
  { id: 14, company_id: 4, subject: 'Report formatting', priority: 2, status: 2 },
  
  { id: 15, company_id: 5, subject: 'Dashboard improvements', priority: 2, status: 3 },
  { id: 16, company_id: 5, subject: 'Minor bug fixes', priority: 1, status: 2 },
]

export async function GET() {
  try {
    const companies = MOCK_COMPANIES
    const allTickets = MOCK_TICKETS

    const accounts = companies.map((company) => {
      const tickets = allTickets.filter((t) => t.company_id === company.id)
      const openTickets = tickets.filter((t) => t.status === 2)
      const criticalTickets = openTickets.filter((t) => t.priority === 4)

      const healthScore = Math.max(0, 100 - openTickets.length * 5 - criticalTickets.length * 15)

      return {
        id: company.id,
        name: company.name,
        health: healthScore,
        risk: healthScore >= 70 ? 'green' : healthScore >= 40 ? 'yellow' : 'red',
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
      error: error.message,
    })
  }
}
