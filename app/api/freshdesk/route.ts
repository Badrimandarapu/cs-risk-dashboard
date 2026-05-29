import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET() {
  const checks: Record<string, unknown> = {}
  try {
    const domain = process.env.FRESHDESK_DOMAIN
    const apiKey = process.env.FRESHDESK_API_KEY
    if (!domain || !apiKey) {
      checks.freshdesk = { ok: false, error: 'FRESHDESK_DOMAIN or FRESHDESK_API_KEY not set' }
    } else {
      const auth = Buffer.from(`${apiKey}:X`).toString('base64')
      const res = await fetch(`https://${domain}/api/v2/tickets?per_page=1`, {
        headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
      })
      checks.freshdesk = { ok: res.ok, status: res.status, domain, rateLimit: { remaining: res.headers.get('X-RateLimit-Remaining'), total: res.headers.get('X-RateLimit-Total') } }
    }
  } catch (err: unknown) { checks.freshdesk = { ok: false, error: (err as Error).message } }

  try {
    const [accounts, tickets, signals, lastSync] = await Promise.all([
      prisma.account.count({ where: { isActive: true, freshdeskCompanyId: { not: BigInt(0) } } }),
      prisma.supportTicket.count(),
      prisma.operationalSignal.count({ where: { isActive: true } }),
      prisma.syncLog.findFirst({ orderBy: { completedAt: 'desc' } }),
    ])
    checks.database = { ok: true, counts: { accounts, tickets, signals }, lastSync: lastSync ? { entityType: lastSync.entityType, status: lastSync.status, completedAt: lastSync.completedAt, recordsProcessed: lastSync.recordsProcessed } : null }
  } catch (err: unknown) { checks.database = { ok: false, error: (err as Error).message } }

  checks.environment = {
    freshdeskDomain: !!process.env.FRESHDESK_DOMAIN,
    freshdeskApiKey: !!process.env.FRESHDESK_API_KEY,
    databaseUrl: !!process.env.DATABASE_URL,
    openaiApiKey: !!process.env.OPENAI_API_KEY,
    ingestSecret: !!process.env.INGEST_SECRET,
    nodeEnv: process.env.NODE_ENV,
  }

  const allOk = (checks.freshdesk as { ok: boolean }).ok && (checks.database as { ok: boolean }).ok
  return NextResponse.json({ status: allOk ? 'healthy' : 'degraded', checks }, { status: allOk ? 200 : 207 })
}
