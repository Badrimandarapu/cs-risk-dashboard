export interface FreshdeskTicket {
  id: number
  subject: string
  description: string
  description_text: string
  priority: number
  status: number
  source: number
  type: string | null
  tags: string[]
  created_at: string
  updated_at: string
  due_by: string | null
  fr_due_by: string | null
  resolved_at: string | null
  requester_id: number
  responder_id: number | null
  company_id: number | null
  group_id: number | null
  product_id: number | null
  agent_id: number | null
  fr_escalated: boolean
  escalated: boolean
  is_escalated: boolean
  reopen_count: number
  nr_escalated: boolean
  spam: boolean
  custom_fields: Record<string, unknown>
  stats: {
    agent_responded_at: string | null
    requester_responded_at: string | null
    first_responded_at: string | null
    status_updated_at: string | null
    reopened_at: string | null
    resolved_at: string | null
    closed_at: string | null
    pending_since: string | null
  }
  sla_policy_id: number | null
  association_type: number | null
  nr_due_by: string | null
}

export interface FreshdeskConversation {
  id: number
  ticket_id: number
  user_id: number
  from_email: string | null
  body: string
  body_text: string
  incoming: boolean
  private: boolean
  source: number
  support_email: string | null
  created_at: string
  updated_at: string
  attachments: unknown[]
}

export interface FreshdeskContact {
  id: number
  name: string
  email: string | null
  phone: string | null
  mobile: string | null
  company_id: number | null
  job_title: string | null
  description: string | null
  active: boolean
  created_at: string
  updated_at: string
  last_login_at: string | null
  tags: string[]
  custom_fields: Record<string, unknown>
}

export interface FreshdeskCompany {
  id: number
  name: string
  description: string | null
  note: string | null
  domains: string[]
  created_at: string
  updated_at: string
  renewal_date: string | null
  health_score: string | null
  account_tier: string | null
  industry: string | null
  custom_fields: Record<string, unknown>
}

export interface FreshdeskAgent {
  id: number
  contact: {
    active: boolean
    email: string
    name: string
    phone: string | null
    mobile: string | null
    created_at: string
    updated_at: string
  }
  available: boolean
  available_since: string | null
  created_at: string
  updated_at: string
  type: string
  ticket_scope: number
  group_ids: number[]
  role_ids: number[]
}

interface RateLimitState {
  remaining: number
  resetAt: number
}

export class FreshdeskClient {
  private baseUrl: string
  private auth: string
  private rateLimit: RateLimitState = { remaining: 400, resetAt: 0 }
  private requestCount = 0

  constructor() {
    const domain = process.env.FRESHDESK_DOMAIN
    const apiKey = process.env.FRESHDESK_API_KEY
    if (!domain || !apiKey) {
      throw new Error('FRESHDESK_DOMAIN and FRESHDESK_API_KEY must be set')
    }
    this.baseUrl = `https://${domain}/api/v2`
    this.auth = Buffer.from(`${apiKey}:X`).toString('base64')
  }

  private async throttle(): Promise<void> {
    if (this.rateLimit.remaining <= 5) {
      const waitMs = Math.max(0, this.rateLimit.resetAt - Date.now()) + 200
      console.log(`[Freshdesk] Rate limit near. Waiting ${waitMs}ms`)
      await new Promise(resolve => setTimeout(resolve, waitMs))
    }
    await new Promise(resolve => setTimeout(resolve, 250))
  }

  private async request<T>(path: string, retries = 3): Promise<T> {
    await this.throttle()
    const url = `${this.baseUrl}${path}`
    this.requestCount++

    for (let attempt = 0; attempt <= retries; attempt++) {
      const res = await fetch(url, {
        headers: {
          Authorization: `Basic ${this.auth}`,
          'Content-Type': 'application/json',
        },
      })

      const remaining = res.headers.get('X-RateLimit-Remaining')
      const reset = res.headers.get('X-RateLimit-Reset')
      if (remaining) this.rateLimit.remaining = parseInt(remaining)
      if (reset) this.rateLimit.resetAt = parseInt(reset) * 1000

      if (res.status === 429) {
        const retryAfter = parseInt(res.headers.get('Retry-After') || '60')
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000))
        continue
      }
      if (res.status === 404) return [] as unknown as T
      if (!res.ok) {
        const body = await res.text()
        throw new Error(`Freshdesk API error ${res.status} on ${path}: ${body}`)
      }
      return res.json() as Promise<T>
    }
    throw new Error(`Freshdesk request to ${path} failed after ${retries} retries`)
  }

  async *paginate<T>(
    path: string,
    params: Record<string, string | number> = {},
    maxPages = 100
  ): AsyncGenerator<T[]> {
    for (let page = 1; page <= maxPages; page++) {
      const qp = new URLSearchParams({
        per_page: '100',
        page: String(page),
        ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
      })
      const data = await this.request<T[]>(`${path}?${qp}`)
      if (!Array.isArray(data) || data.length === 0) break
      yield data
      if (data.length < 100) break
    }
  }

  async *getTickets(updatedSince?: string): AsyncGenerator<FreshdeskTicket[]> {
    const params: Record<string, string> = {
      include: 'stats,requester,company',
      order_type: 'asc',
    }
    if (updatedSince) params.updated_since = updatedSince
    yield* this.paginate<FreshdeskTicket>('/tickets', params)
  }

  async getTicketConversations(ticketId: number): Promise<FreshdeskConversation[]> {
    return this.request<FreshdeskConversation[]>(`/tickets/${ticketId}/conversations`)
  }

  async *getContacts(updatedSince?: string): AsyncGenerator<FreshdeskContact[]> {
    const params: Record<string, string> = {}
    if (updatedSince) params._updated_since = updatedSince
    yield* this.paginate<FreshdeskContact>('/contacts', params)
  }

  async *getCompanies(): AsyncGenerator<FreshdeskCompany[]> {
    yield* this.paginate<FreshdeskCompany>('/companies')
  }

  async getCompany(id: number): Promise<FreshdeskCompany> {
    return this.request<FreshdeskCompany>(`/companies/${id}`)
  }

  async getAgents(): Promise<FreshdeskAgent[]> {
    return this.request<FreshdeskAgent[]>('/agents')
  }

  getRequestCount(): number {
    return this.requestCount
  }
}

