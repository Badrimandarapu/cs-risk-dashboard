import { NextRequest, NextResponse } from 'next/server'
import { runFullIngest } from '@/lib/freshdesk/ingest'
import { extractAllSignals } from '@/lib/signals/extractor'

export const maxDuration = 300

export async function POST(req: NextRequest) {
  const startTime = Date.now()
  const body = await req.json().catch(() => ({}))

  const secret = process.env.INGEST_SECRET
  if (secret && process.env.NODE_ENV === 'production' && body.secret !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { mode = 'incremental', updatedSince, includeConversations = true, conversationDaysSince = 7, extractSignals = true } = body
  let since: string | undefined = updatedSince
  if (!since && mode === 'incremental') since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  const ingestResult = await runFullIngest({ updatedSince: since, includeConversations, conversationDaysSince })
  let signalResult = null
  if (extractSignals) signalResult = await extractAllSignals()

  return NextResponse.json({ success: true, mode, ingest: ingestResult, signals: signalResult, totalDurationMs: Date.now() - startTime })
}

export async function GET() {
  return NextResponse.json({ message: 'CS Risk Ingest API — POST to trigger ingestion' })
}

