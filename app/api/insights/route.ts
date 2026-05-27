import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import { calculateRiskScore } from '@/lib/riskCalculator'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { account, mockTickets } = await request.json()

    const accountTickets = mockTickets.filter((t: any) => t.accountId === account.id)
    const riskScore = calculateRiskScore(account, accountTickets)

    const prompt = `You are a Customer Success analyst. Generate 2-3 short insights for this account.

Account: ${account.name}
Health Score: ${account.healthScore}%
Risk Level: ${riskScore.level.toUpperCase()}
Risk Factors: ${riskScore.explanation}

Generate insights like this (one per line, start with emoji):
⚠️ Payment integration failing
✅ Customer engagement improving
📈 Support tickets decreasing

Generate insights now:`

    const message = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 150,
    })

    const text = message.choices[0].message.content || ''
    const insights = text
      .split('\n')
      .filter((line) => line.trim().length > 0 && /^[⚠️✅📈🔴🟡🟢🎯💡]/.test(line.trim()))

    return NextResponse.json({
      insights: insights.length > 0 ? insights : ['✅ Account is stable with no critical issues'],
    })
  } catch (error: any) {
    console.error('OpenAI Error:', error)
    return NextResponse.json(
      { insights: ['✅ Account is stable with no critical issues'] },
      { status: 200 }
    )
  }
}