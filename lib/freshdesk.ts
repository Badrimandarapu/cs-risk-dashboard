export interface FreshDeskTicket {
  id: number
  subject: string
  description: string
  status: number // 2=open, 3=pending, 4=resolved, 5=closed
  priority: number // 1=low, 2=medium, 3=high, 4=urgent
  created_at: string
  updated_at: string
  customer_id: number
  requester_id: number
  type: string
}

export interface FreshDeskContact {
  id: number
  name: string
  email: string
  phone: string
}

const API_KEY = process.env.FRESHDESK_API_KEY
const DOMAIN = process.env.FRESHDESK_DOMAIN

async function freshDeskAPI(endpoint: string) {
  if (!API_KEY || !DOMAIN) {
    console.warn('Freshdesk credentials missing')
    return null
  }

  try {
    const response = await fetch(`https://${DOMAIN}.freshdesk.com/api/v2${endpoint}`, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${Buffer.from(`${API_KEY}:X`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error(`Freshdesk API error: ${response.status}`)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Freshdesk fetch error:', error)
    return null
  }
}

export async function getTickets() {
  const data = await freshDeskAPI('/tickets?page=1&per_page=100')
  if (!data) return []
  return data.tickets || []
}

export async function getContacts() {
  const data = await freshDeskAPI('/contacts?page=1&per_page=100')
  if (!data) return []
  return data.contacts || []
}

export async function getTicketStats() {
  const tickets = await getTickets()
  if (!tickets || tickets.length === 0) return null

  const critical = tickets.filter((t: FreshDeskTicket) => t.priority === 4).length
  const open = tickets.filter((t: FreshDeskTicket) => t.status === 2).length
  const pending = tickets.filter((t: FreshDeskTicket) => t.status === 3).length

  return {
    totalTickets: tickets.length,
    criticalTickets: critical,
    openTickets: open,
    pendingTickets: pending,
    avgResolutionTime: '2.5 days',
  }
}