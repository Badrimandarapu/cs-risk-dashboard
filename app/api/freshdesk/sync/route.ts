import { NextRequest, NextResponse } from 'next/server'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { FreshdeskClient } = require('@/lib/freshdesk/client') as any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { ingestTickets } = require('@/lib/freshdesk/ingest') as any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { extractAllSignals } = require('@/lib/signals/extractor') as any

export const maxDuration = 60

export async function POST(req: NextRequest) {
  const start = Date.now()
  try {
    const body = await req.json().catch(() => ({}))

    const secret = process.env.INGEST_SECRET
    if (secret && process.env.NODE_ENV === 'production' && body.secret !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = new FreshdeskClient()
    const since = new Date(Date.now() - 75 * 60 * 1000).toISOString()
    
    const ticketResult = await ingestTickets(client, since)
    const signalResult = await extractAllSignals()

    return NextResponse.json({
      success: true,
      tickets: ticketResult.upserted,
      signals: signalResult.totalSignals,
      durationMs: Date.now() - start,
    })
  } catch (err: unknown) {
    console.error('[Sync Error]', err)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
