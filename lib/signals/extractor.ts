import { prisma } from '../db/prisma'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toJson(obj: unknown): any {
  return JSON.parse(JSON.stringify(obj ?? {}))
}

export async function extractSignalsForAccount(accountId: string): Promise<number> {
  const signals: Array<{
    accountId: string; signalType: string; severity: string; confidence: number;
    value: Record<string, unknown>; evidence: string; triggeredAt: Date; ticketId?: bigint
  }> = []

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000)

  const [tickets, recentTickets, stakeholders] = await Promise.all([
    prisma.supportTicket.findMany({ where: { accountId }, include: { conversations: { where: { hasFrustrationSignals: true }, select: { id: true, sentimentScore: true, metadata: true, createdAt: true } } }, orderBy: { createdAt: 'desc' } }),
    prisma.supportTicket.findMany({ where: { accountId, createdAt: { gte: thirtyDaysAgo } }, select: { id: true, createdAt: true, priority: true, status: true } }),
    prisma.stakeholder.findMany({ where: { accountId }, select: { id: true, isExecutive: true, lastInvolved: true, involvementCount: true } }),
  ])

  const openTickets = tickets.filter(t => t.status !== 4 && t.status !== 5)
  const criticalOpen = openTickets.filter(t => t.priority === 4)

  const frequentReopens = tickets.filter(t => t.reopenedCount >= 2)
  if (frequentReopens.length > 0) {
    const maxReopens = Math.max(...frequentReopens.map(t => t.reopenedCount))
    signals.push({ accountId, signalType: 'REPEATED_REOPENS', severity: maxReopens >= 4 ? 'HIGH' : 'MEDIUM', confidence: Math.min(0.95, 0.5 + frequentReopens.length * 0.1), value: { ticketsWithReopens: frequentReopens.length, maxReopenCount: maxReopens }, evidence: `${frequentReopens.length} ticket(s) reopened multiple times (max ${maxReopens} reopens).`, triggeredAt: now })
  }

  const last7 = recentTickets.filter(t => t.createdAt >= sevenDaysAgo).length
  const prior = recentTickets.filter(t => t.createdAt < sevenDaysAgo).length
  const priorAvg = prior / (23 / 7)
  if (priorAvg > 0 && last7 >= priorAvg * 2 && last7 >= 3) {
    signals.push({ accountId, signalType: 'TICKET_SPIKE', severity: last7 >= priorAvg * 3 ? 'HIGH' : 'MEDIUM', confidence: 0.8, value: { last7Days: last7, priorWeeklyAverage: Math.round(priorAvg * 10) / 10 }, evidence: `Ticket volume this week (${last7}) is ${Math.round(last7 / priorAvg)}x the prior 3-week average.`, triggeredAt: now })
  }

  const slaBreached = tickets.filter(t => (t.metadata as Record<string, unknown>)?.slaBreached === true)
  if (slaBreached.length >= 2) {
    signals.push({ accountId, signalType: 'SLA_BREACH_CLUSTER', severity: slaBreached.length >= 5 ? 'CRITICAL' : slaBreached.length >= 3 ? 'HIGH' : 'MEDIUM', confidence: 0.9, value: { breachedCount: slaBreached.length, criticalBreaches: slaBreached.filter(t => t.priority === 4).length }, evidence: `${slaBreached.length} tickets with SLA breaches detected.`, triggeredAt: now })
  }

  const frustratedConvs = tickets.flatMap(t => t.conversations)
  if (frustratedConvs.length >= 2) {
    const avgSentiment = frustratedConvs.reduce((sum, c) => sum + (c.sentimentScore ?? 0), 0) / frustratedConvs.length
    signals.push({ accountId, signalType: 'SENTIMENT_DECLINE', severity: avgSentiment <= -0.6 ? 'CRITICAL' : avgSentiment <= -0.3 ? 'HIGH' : 'MEDIUM', confidence: Math.min(0.9, 0.4 + frustratedConvs.length * 0.05), value: { frustrationConversations: frustratedConvs.length, averageSentimentScore: Math.round(avgSentiment * 100) / 100 }, evidence: `${frustratedConvs.length} conversations with negative sentiment. Avg score: ${avgSentiment.toFixed(2)}.`, triggeredAt: now })
  }

  const recentExecActivity = stakeholders.filter(s => s.isExecutive && s.lastInvolved && s.lastInvolved >= sevenDaysAgo)
  if (recentExecActivity.length > 0) {
    signals.push({ accountId, signalType: 'EXECUTIVE_INVOLVEMENT', severity: 'HIGH', confidence: 0.85, value: { activeExecutives: recentExecActivity.length }, evidence: `${recentExecActivity.length} executive-level stakeholder(s) active in the last 7 days.`, triggeredAt: now })
  }

  const escalatedTickets = openTickets.filter(t => t.isEscalated)
  if (escalatedTickets.length > 0) {
    signals.push({ accountId, signalType: 'EXPLICIT_ESCALATION', severity: escalatedTickets.length >= 2 ? 'CRITICAL' : 'HIGH', confidence: 0.95, value: { escalatedTickets: escalatedTickets.length }, evidence: `${escalatedTickets.length} ticket(s) currently flagged as escalated.`, triggeredAt: now })
  }

  if (criticalOpen.length >= 1) {
    const oldest = criticalOpen.reduce((a, b) => a.createdAt < b.createdAt ? a : b)
    const daysOpen = Math.round((now.getTime() - oldest.createdAt.getTime()) / 86400000)
    signals.push({ accountId, signalType: 'CRITICAL_UNRESOLVED', severity: criticalOpen.length >= 3 ? 'CRITICAL' : 'HIGH', confidence: 0.9, value: { criticalOpenCount: criticalOpen.length, oldestOpenDays: daysOpen }, evidence: `${criticalOpen.length} critical-priority ticket(s) unresolved. Oldest open ${daysOpen} days.`, triggeredAt: now })
  }

  if (openTickets.length > 0) {
    const account = await prisma.account.findUnique({ where: { id: accountId }, select: { lastActivity: true } })
    if (account?.lastActivity) {
      const daysSince = Math.round((now.getTime() - account.lastActivity.getTime()) / 86400000)
      if (daysSince >= 14) {
        signals.push({ accountId, signalType: 'STAKEHOLDER_INACTIVITY', severity: daysSince >= 30 ? 'HIGH' : 'MEDIUM', confidence: 0.7, value: { daysSinceLastActivity: daysSince, openTickets: openTickets.length }, evidence: `No stakeholder activity for ${daysSince} days despite ${openTickets.length} open ticket(s).`, triggeredAt: now })
      }
    }
  }

  if (signals.length > 0) {
    const signalTypes = [...new Set(signals.map(s => s.signalType))]
    await prisma.operationalSignal.updateMany({ where: { accountId, signalType: { in: signalTypes }, isActive: true }, data: { isActive: false, resolvedAt: now } })
    await prisma.operationalSignal.createMany({ data: signals.map(s => ({ accountId: s.accountId, ticketId: s.ticketId ?? null, signalType: s.signalType, severity: s.severity, confidence: s.confidence, value: toJson(s.value), evidence: s.evidence, triggeredAt: s.triggeredAt, isActive: true })), skipDuplicates: true })
  }

  return signals.length
}

export async function extractAllSignals(): Promise<{ accountsProcessed: number; totalSignals: number; durationMs: number }> {
  const start = Date.now()
  const accounts = await prisma.account.findMany({ where: { isActive: true, freshdeskCompanyId: { not: BigInt(0) } }, select: { id: true } })
  let totalSignals = 0
  for (const account of accounts) {
    const count = await extractSignalsForAccount(account.id)
    totalSignals += count
  }
  return { accountsProcessed: accounts.length, totalSignals, durationMs: Date.now() - start }
}
