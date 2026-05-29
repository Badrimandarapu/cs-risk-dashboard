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

async function logSync(entity: string, status: string, fetched: number, processed: number, failed: number, durationMs: number, errorMessage?: string) {
  try {
    await prisma.syncLog.create({
      data: { entityType: entity, status, recordsFetched: fetched, recordsProcessed: processed, recordsFailed: failed, startedAt: new Date(Date.now() - durationMs), completedAt: new Date(), durationSeconds: Math.round(durationMs / 1000), errorMessage: errorMessage ?? null },
    })
  } catch { /* skip */ }
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

        await prisma.supportTicket.upsert({
          where: { id: BigInt(ticket.id) },
          create: {
            id: BigInt(ticket.id), accountId, subject: ticket.subject, description: ticket.description_text ?? ticket.description ?? '',
            priority: ticket.priority, status: ticket.status, createdAt: new Date(ticket.created_at), updatedAt: new Date(ticket.updated_at),
            resolvedAt: ticket.resolved_at ? new Date(ticket.resolved_at) : null, dueBy: ticket.due_by ? new Date(ticket.due_by) : null,
            firstResponseDue: ticket.fr_due_by ? new Date(ticket.fr_due_by) : null, requesterId: ticket.requester_id ? BigInt(ticket.requester_id) : null,
            agentId: ticket.responder_id ? BigInt(ticket.responder_id) : null, groupId: ticket.group_id ? BigInt(ticket.group_id) : null,
            reopenedCount: ticket.reopen_count ?? 0, isEscalated, tags: ticket.tags ?? [], customFields: JSON.parse(JSON.stringify(ticket.custom_fields ?? {})),
            metadata: { source: ticket.source, type: ticket.type, slaBreached, stats: ticket.stats },
          },
          update: {
            subject: ticket.subject, description: ticket.description_text ?? ticket.description ?? '', priority: ticket.priority, status: ticket.status,
            updatedAt: new Date(ticket.updated_at), resolvedAt: ticket.resolved_at ? new Date(ticket.resolved_at) : null,
            dueBy: ticket.due_by ? new Date(ticket.due_by) : null, agentId: ticket.responder_id ? BigInt(ticket.responder_id) : null,
            reopenedCount: ticket.reopen_count ?? 0, isEscalated, tags: ticket.tags ?? [],
            metadata: { source: ticket.source, type: ticket.type, slaBreached, stats: ticket.stats },
          },
        })
        upserted++
      } catch (err: unknown) { failed++; errors.push(`Ticket ${ticket.id}: ${(err as Error).message}`) }
    }
  }

  const durationMs = Date.now() - start
  await logSync('tickets', 'completed', fetched, upserted, failed, durationMs, errors[0])
  return { entity: 'tickets', fetched, upserted, failed, durationMs, errors }
}
