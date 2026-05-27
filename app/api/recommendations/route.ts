import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { actions: ['TODAY: Schedule account review call'] },
        { status: 200 }
      )
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const { account, riskScore } = await request.json()

    const prompt = `You are a CS Manager. Generate 2-3 specific actions for this account.

Account: ${account.name}
Risk Level: ${riskScore.level.toUpperCase()}
Issues: ${riskScore.explanation}

Generate actions like this (one per line):
IMMEDIATE: Schedule escalation call
TODAY: Review payment integration
THIS WEEK: Send feature roadmap

Generate actions now:`

    const message = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 200,
    })

    const text = message.choices[0].message.content || ''
    const actions = text
      .split('\n')
      .filter((line) => line.includes('IMMEDIATE') || line.includes('TODAY') || line.includes('THIS WEEK'))

    return NextResponse.json({
      actions: actions.length > 0 ? actions : ['TODAY: Schedule account review call'],
    })
  } catch (error: any) {
    console.error('OpenAI Error:', error)
    return NextResponse.json(
      { actions: ['TODAY: Schedule account review call'] },
      { status: 200 }
    )
  }
}
