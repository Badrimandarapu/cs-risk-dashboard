const axios = require('axios')

class FreshdeskClient {
  constructor(apiKey, domain) {
    this.apiKey = apiKey
    this.domain = domain
    this.client = axios.create({
      baseURL: `https://${domain}.freshdesk.com/api/v2`,
      auth: {
        username: apiKey,
        password: 'X'
      }
    })
  }

  async getCompanies() {
    try {
      const response = await this.client.get('/companies')
      return response.data.companies || []
    } catch (error) {
      console.error('Error fetching companies:', error.message)
      return []
    }
  }

  async getTickets() {
    try {
      const response = await this.client.get('/tickets')
      return response.data.tickets || []
    } catch (error) {
      console.error('Error fetching tickets:', error.message)
      return []
    }
  }

  async analyzeAccountHealth(companyId, allTickets) {
    const tickets = allTickets.filter(t => t.company_id === companyId)
    const openTickets = tickets.filter(t => t.status === 2)
    const criticalTickets = openTickets.filter(t => t.priority === 4)
    
    return {
      companyId,
      totalTickets: tickets.length,
      openTickets: openTickets.length,
      criticalTickets: criticalTickets.length,
      slaBreaches: tickets.filter(t => {
        if (!t.due_by) return false
        return new Date(t.due_by) < new Date()
      }).length
    }
  }
}

module.exports = FreshdeskClient
