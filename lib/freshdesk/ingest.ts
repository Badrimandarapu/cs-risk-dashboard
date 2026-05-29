import { prisma } from '../db/prisma'
import { FreshdeskClient } from './client'
import { analyzeSentiment, isExecutiveContact, isSLABreached } from './sentiment'

export interface IngestResult {
  entity: string
  fetched: number
  upserted: number
  failed: number
  durationMs: number
  errors: string[]
}

export interface FullIngestResult {
  companies: IngestResult
  contacts: IngestResult
  tickets: IngestResult
  conversations: IngestResult
  totalDurationMs: number
  startedAt: string
  completedAt: string
}

async function logSync(entity: string, status: string, fetched: number, processed: number, failed: number, durationMs: number, errorMessage?: string) {
  try {
    await prisma.syncLog.create({
      data: {
        entityType: entity, status, recordsFetched: fetched, recordsProcessed: processed,
        recordsFailed: failed, startedAt: new Date(Date.now() - durationMs),
        completedAt: new Date(), durationSeconds: Math.round(durationMs / 1000),
        errorMessage: errorMessage ?? null,
      },
    })
  } catch { /* don't let logging break ingestion */ }
}

export async function ingestCompanies(client: FreshdeskClient): Promise<IngestResult> {
  const start = Date.now()
  let fetched = 0, upserted = 0, failed = 0
  const errors: string[] = []

  for await (const batch of client.getCompanies()) {
    fetched += batch.length
    for (const company of batch) {
      try {
        await prisma.account.upsert({
          where: { freshdeskCompanyId: BigInt(company.id) },
          create: {
            freshdeskCompanyId: BigInt(company.id), name: company.name, displayName: company.name,
            isActive: true, lastActivity: new Date(),
            metadata: { description: company.description, note: company.note, domains: company.domains, healthScore: company.health_score, accountTier: company.account_tier, industry: company.industry, renewalDate: company.renewal_date, customFields: company.custom_fields },
          },
          update: {
            name: company.name, displayName: company.name, lastActivity: new Date(),
            metadata: { description: company.description, note: company.note, domains: company.domains, healthScore: company.health_score, accountTier: company.account_tier, industry: company.industry, renewalDate: company.renewal_date, customFields: company.custom_fields },
          },
        })
        upserted++
      } catch (err: unknown) { failed++; errors.push(`Company ${company.id}: ${(err as Error).message}`) }
    }
  }
  const durationMs = Date.now() - start
  await logSync('companies', 'completed', fetched, upserted, failed, durationMs, errors[0])
  return { entity: 'companies', fetched, upserted, failed, durationMs, errors }
}

export async function ingestContacts(client: FreshdeskClient, updatedSince?: string): Promise<IngestResult> {
  const start = Date.now()
  let fetched = 0, upserted = 0, failed = 0
  const errors: string[] = []

  const accountMap = new Map<number, string>()
  const accounts = await prisma.account.findMany({ select: { id: true, freshdeskCompanyId: true }, where: { freshdeskCompanyId: { not: null } } })
  for (const a of accounts) { if (a.freshdeskCompanyId) accountMap.set(Number(a.freshdeskCompanyId), a.id) }

  let unassignedAccountId: string | null = null

  for await (const batch of client.getContacts(updatedSince)) {
    fetched += batch.length
    for (const contact of batch) {
      try {
        let accountId: string | null = contact.company_id ? (accountMap.get(contact.company_id) ?? null) : null
        if (!accountId) {
          if (!unassignedAccountId) {
            const ua = await prisma.account.upsert({ where: { freshdeskCompanyId: BigInt(0) }, create: { freshdeskCompanyId: BigInt(0), name: '__unassigned__', displayName: 'Unassigned', isActive: false }, update: {} })
            unassignedAccountId = ua.id
          }
          accountId = unassignedAccountId
        }
        await prisma.stakeholder.upsert({
          where: { freshdeskId: BigInt(contact.id) },
          create: { freshdeskId: BigInt(contact.id), accountId, email: contact.email ?? `contact-${contact.id}@unknown.invalid`, name: contact.name, title: contact.job_title, isExecutive: isExecutiveContact(contact.job_title), isActive: contact.active, firstSeen: new Date(contact.created_at), lastInvolved: contact.updated_at ? new Date(contact.updated_at) : null, metadata: { phone: contact.phone, mobile: contact.mobile, tags: contact.tags, customFields: contact.custom_fields } },
          update: { accountId, name: contact.name, title: contact.job_title, isExecutive: isExecutiveContact(contact.job_title), isActive: contact.active, lastInvolved: contact.updated_at ? new Date(contact.updated_at) : null, metadata: { phone: contact.phone, mobile: contact.mobile, tags: contact.tags, customFields: contact.custom_fields } },
        })
        upserted++
      } catch (err: unknown) { failed++; errors.push(`Contact ${contact.id}: ${(err as Error).message}`) }
    }
  }
  const durationMs = Date.now() - start
  await logSync('contacts', 'completed', fetched, upserted, failed, durationMs, errors[0])
  return { entity: 'contacts', fetched, upserted, failed, durationMs, errors }
}

export async function ingestTickets(client: FreshdeskClient, updatedSince?: string): Promise<IngestResult> {
  const start = Date.now()
  let fetched = 0, upserted = 0, failed = 0
  const errors: string[] = []

  const accountMap = new Map<number, string>()
  const accounts = await prisma.account.findMany({ select: { id: true, freshdeskCompanyId: true }, where: { freshdeskCompanyId: { not: null } } })
  for (const a of accounts) { if (a.freshdeskCompanyId) accountMap.set(Number(a.freshdeskCompanyId), a.id) }
  const unassigned = await prisma.account.findFirst({ where: { freshdeskCompanyId: BigInt(0) } })

  for await (const batch of client.getTickets(updatedSince)) {
    fetched += batch.length
    for (const ticket of batch) {
      try {
        let accountId: string | null = ticket.company_id ? (accountMap.get(ticket.company_id) ?? null) : null
        if (!accountId) accountId = unassigned?.id ?? null
        if (!accountId) continue

        const slaBreached = isSLABreached(ticket.due_by, ticket.status, ticket.resolved_at)
        const isEscalated = ticket.fr_escalated || ticket.escalated || ticket.is_escalated
        let resolutionTimeMinutes: number | null = null
        if (ticket.stats?.resolved_at && ticket.created_at) resolutionTimeMinutes = Math.round((new Date(ticket.stats.resolved_at).getTime() - new Date(ticket.created_at).getTime()) / 60000)
        let firstResponseMinutes: number | null = null
        if (ticket.stats?.first_responded_at && ticket.created_at) firstResponseMinutes = Math.round((new Date(ticket.stats.first_responded_at).getTime() - new Date(ticket.created_at).getTime()) / 60000)

        await prisma.supportTicket.upsert({
          where: { id: BigInt(ticket.id) },
          create: { id: BigInt(ticket.id), accountId, subject: ticket.subject, description: ticket.description_text ?? ticket.description ?? '', priority: ticket.priority, status: ticket.status, createdAt: new Date(ticket.created_at), updatedAt: new Date(ticket.updated_at), resolvedAt: ticket.resolved_at ? new Date(ticket.resolved_at) : null, dueBy: ticket.due_by ? new Date(ticket.due_by) : null, firstResponseDue: ticket.fr_due_by ? new Date(ticket.fr_due_by) : null, requesterId: ticket.requester_id ? BigInt(ticket.requester_id) : null, agentId: ticket.responder_id ? BigInt(ticket.responder_id) : null, groupId: ticket.group_id ? BigInt(ticket.group_id) : null, reopenedCount: ticket.reopen_count ?? 0, isEscalated, tags: ticket.tags ?? [], customFields: ticket.custom_fields ?? {}, metadata: { source: ticket.source, type: ticket.type, slaBreached, resolutionTimeMinutes, firstResponseMinutes, stats: ticket.stats } },
          update: { accountId, subject: ticket.subject, description: ticket.description_text ?? ticket.description ?? '', priority: ticket.priority, status: ticket.status, updatedAt: new Date(ticket.updated_at), resolvedAt: ticket.resolved_at ? new Date(ticket.resolved_at) : null, dueBy: ticket.due_by ? new Date(ticket.due_by) : null, agentId: ticket.responder_id ? BigInt(ticket.responder_id) : null, reopenedCount: ticket.reopen_count ?? 0, isEscalated, tags: ticket.tags ?? [], customFields: ticket.custom_fields ?? {}, metadata: { source: ticket.source, type: ticket.type, slaBreached, resolutionTimeMinutes, firstResponseMinutes, stats: ticket.stats } },
        })
        upserted++
        await prisma.account.update({ where: { id: accountId }, data: { lastActivity: new Date() } })
      } catch (err: unknown) { failed++; errors.push(`Ticket ${ticket.id}: ${(err as Error).message}`) }
    }
  }
  const durationMs = Date.now() - start
  await logSync('tickets', 'completed', fetched, upserted, failed, durationMs, errors[0])
  return { entity: 'tickets', fetched, upserted, failed, durationMs, errors }
}

export async function ingestConversations(client: FreshdeskClient, options: { fullSync?: boolean; daysSince?: number } = {}): Promise<IngestResult> {
  const start = Date.now()
  let fetched = 0, upserted = 0, failed = 0
  const errors: string[] = []
  const since = options.fullSync ? undefined : new Date(Date.now() - (options.daysSince ?? 7) * 86400000)
  const tickets = await prisma.supportTicket.findMany({ select: { id: true }, where: since ? { updatedAt: { gte: since } } : undefined, orderBy: { updatedAt: 'desc' } })

  for (const ticket of tickets) {
    try {
      const convs = await client.getTicketConversations(Number(ticket.id))
      fetched += convs.length
      for (const conv of convs) {
        try {
          const text = conv.body_text ?? conv.body ?? ''
          const sentiment = analyzeSentiment(text)
          await prisma.supportConversation.upsert({
            where: { id: BigInt(conv.id) },
            create: { id: BigInt(conv.id), ticketId: BigInt(conv.ticket_id), body: text, senderId: conv.user_id ? BigInt(conv.user_id) : null, senderType: conv.incoming ? 'customer' : 'agent', createdAt: new Date(conv.created_at), sentimentScore: sentiment.score, hasFrustrationSignals: sentiment.hasFrustrationSignals, metadata: { fromEmail: conv.from_email, source: conv.source, private: conv.private, frustrationLabels: sentiment.frustrationLabels, dominantSignal: sentiment.dominantSignal } },
            update: { body: text, sentimentScore: sentiment.score, hasFrustrationSignals: sentiment.hasFrustrationSignals, metadata: { fromEmail: conv.from_email, source: conv.source, private: conv.private, frustrationLabels: sentiment.frustrationLabels, dominantSignal: sentiment.dominantSignal } },
          })
          upserted++
        } catch (err: unknown) { failed++; errors.push(`Conv ${conv.id}: ${(err as Error).message}`) }
      }
      await prisma.supportTicket.update({ where: { id: ticket.id }, data: { conversationCount: convs.length } })
    } catch (err: unknown) { failed++; errors.push(`Ticket ${ticket.id} convs: ${(err as Error).message}`) }
  }
  const durationMs = Date.now() - start
  await logSync('conversations', 'completed', fetched, upserted, failed, durationMs, errors[0])
  return { entity: 'conversations', fetched, upserted, failed, durationMs, errors }
}

export async function runFullIngest(options: { updatedSince?: string; includeConversations?: boolean; conversationDaysSince?: number }): Promise<FullIngestResult> {
  const startedAt = new Date().toISOString()
  const totalStart = Date.now()
  const client = new FreshdeskClient()

  const companies = await ingestCompanies(client)
  const contacts = await ingestContacts(client, options.updatedSince)
  const tickets = await ingestTickets(client, options.updatedSince)
  let conversations: IngestResult = { entity: 'conversations', fetched: 0, upserted: 0, failed: 0, durationMs: 0, errors: [] }
  if (options.includeConversations !== false) {
    conversations = await ingestConversations(client, { daysSince: options.conversationDaysSince ?? 7 })
  }
  return { companies, contacts, tickets, conversations, totalDurationMs: Date.now() - totalStart, startedAt, completedAt: new Date().toISOString() }
}

