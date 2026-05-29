import { NextRequest, NextResponse } from 'next/server'
import { FreshdeskClient } from '@/lib/freshdesk/client'
import { ingestTickets } from '@/lib/freshdesk/ingest'
import { extractAllSignals } from '@/lib/signals/extractor'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  const start = Date.now()
  const body = await req.json().catch(() => ({}))

  const secret = process.env.INGEST_SECRET
  if (secret && process.env.NODE_ENV === 'production' && body.secret !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const client = new FreshdeskClient()
  const since = new Date(Date.now() - 75 * 60 * 1000).toISOString()
  const ticketResult = await ingestTickets(client, since)
  const signalResult = await extractAllSignals()

  return NextResponse.json({ success: true, sync: ticketResult, signals: signalResult, durationMs: Date.now() - start, syncedSince: since })
}
