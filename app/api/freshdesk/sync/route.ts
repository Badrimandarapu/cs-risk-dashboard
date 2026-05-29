import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const start = Date.now()
  try {
    const body = await req.json().catch(() => ({}))
    const secret = process.env.INGEST_SECRET

    if (secret && process.env.NODE_ENV === 'production' && body.secret !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Simple response — just acknowledge the sync was triggered
    // Actual syncing will happen via scheduled jobs on the server
    return NextResponse.json({
      success: true,
      message: 'Sync scheduled',
      timestamp: new Date().toISOString(),
      durationMs: Date.now() - start,
    })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
