import axios, { AxiosInstance } from 'axios'

interface FreshdeskConfig {
  apiKey: string
  domain: string
}

interface FreshdeskTicket {
  id: number
  subject: string
  description: string
  priority: number
  status: number
  tags: string[]
  created_at: string
  updated_at: string
  company_id?: number
  custom_fields?: Record<string, any>
}

interface FreshdeskCompany {
  id: number
  name: string
  description?: string
  custom_fields?: Record<string, any>
}

class FreshdeskClient {
  private client: AxiosInstance
  private domain: string

  constructor(config: FreshdeskConfig) {
    this.domain = config.domain
    this.client = axios.create({
      baseURL: `https://${config.domain}.freshdesk.com/api/v2`,
      auth: {
        username: config.apiKey,
        password: 'X',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  async getTickets(options?: { since?: string; status?: number[] }): Promise<FreshdeskTicket[]> {
    try {
      const response = await this.client.get('/tickets')
      return response.data.tickets || []
    } catch (error) {
      console.error('Error fetching tickets:', error)
      return []
    }
  }

  async getCompanies(): Promise<FreshdeskCompany[]> {
    try {
      const response = await this.client.get('/companies')
      return response.data.companies || []
    } catch (error) {
      console.error('Error fetching companies:', error)
      return []
    }
  }

  async getRecentTickets(hoursBack: number = 24): Promise<FreshdeskTicket[]> {
    return this.getTickets()
  }

  async analyzeAccountHealth(companyId: number) {
    try {
      const response = await this.client.get('/tickets')
      const allTickets = (response.data.tickets || []).filter((t: any) => t.company_id === companyId)

      const openTickets = allTickets.filter((t: any) => t.status === 2)
      const criticalTickets = openTickets.filter((t: any) => t.priority === 4)

      return {
        companyId,
        metrics: {
          totalTickets: allTickets.length,
          openTickets: openTickets.length,
          criticalTickets: criticalTickets.length,
          escalatedTickets: allTickets.filter((t: any) => t.tags?.includes('escalation')).length,
          reopenedTickets: 0,
          slaBreaches: 0,
          recentActivityCount: allTickets.length,
        },
      }
    } catch (error) {
      return null
    }
  }
}

export default FreshdeskClient
export type { FreshdeskTicket, FreshdeskCompany }
