const FRUSTRATION_SIGNALS: Array<{ pattern: RegExp; weight: number; label: string }> = [
  { pattern: /\b(ceo|cto|coo|vp|president|board|executive|c-suite)\b/i, weight: 0.9, label: 'executive_involvement' },
  { pattern: /\b(escalat(e|ing|ion|ed))\b/i, weight: 0.8, label: 'explicit_escalation' },
  { pattern: /\b(cancel(ling|ing|ed|ation)?|churn|leave|switch(ing)?|competitor|alternative)\b/i, weight: 0.85, label: 'churn_threat' },
  { pattern: /\b(lawsuit|legal|attorney|lawyer|sue|court|breach of contract)\b/i, weight: 0.95, label: 'legal_threat' },
  { pattern: /\b(sla breach|sla violation|contractual)\b/i, weight: 0.8, label: 'sla_violation_mention' },
  { pattern: /\b(unacceptable|inexcusable|ridiculous|outrageous|appalling|terrible|horrible|awful)\b/i, weight: 0.75, label: 'strong_negative' },
  { pattern: /\b(urgent(ly)?|critical(ly)?|immediately|asap|emergency|blocker|blocking)\b/i, weight: 0.6, label: 'urgency_language' },
  { pattern: /\b(disappointed|frustrat(ed|ing)|annoyed|fed up|had enough)\b/i, weight: 0.65, label: 'frustration_language' },
  { pattern: /\b(still (not|no|haven't|waiting)|yet to|weeks? (ago|later)|months? (ago|later))\b/i, weight: 0.7, label: 'delay_complaint' },
  { pattern: /\b(broken|not working|doesn't work|stopped working|fails|failing|crashed|down)\b/i, weight: 0.5, label: 'system_failure' },
  { pattern: /\b(again|another ticket|third time|multiple times|keep (asking|telling)|already (told|said|asked|emailed))\b/i, weight: 0.65, label: 'repetition_frustration' },
  { pattern: /\b(revenue|revenue impact|business impact|losing money|cost(ing)? us|production (issue|down|outage))\b/i, weight: 0.8, label: 'business_impact' },
]

const POSITIVE_SIGNALS: Array<{ pattern: RegExp; weight: number }> = [
  { pattern: /\b(thank(s| you)|appreciate|resolved|fixed|working now|great|excellent|helpful|satisfied)\b/i, weight: 0.6 },
  { pattern: /\b(problem solved|issue closed|all good|looks good|confirmed)\b/i, weight: 0.5 },
]

export interface SentimentResult {
  score: number
  hasFrustrationSignals: boolean
  frustrationLabels: string[]
  confidence: number
  dominantSignal: string | null
}

export function analyzeSentiment(text: string): SentimentResult {
  if (!text || text.trim().length < 10) {
    return { score: 0, hasFrustrationSignals: false, frustrationLabels: [], confidence: 0.1, dominantSignal: null }
  }
  const clean = text.replace(/<[^>]*>/g, ' ').toLowerCase()
  let negativeScore = 0
  const triggeredLabels: Array<{ label: string; weight: number }> = []

  for (const signal of FRUSTRATION_SIGNALS) {
    if (signal.pattern.test(clean)) {
      negativeScore += signal.weight
      triggeredLabels.push({ label: signal.label, weight: signal.weight })
    }
  }

  let positiveScore = 0
  for (const signal of POSITIVE_SIGNALS) {
    if (signal.pattern.test(clean)) positiveScore += signal.weight
  }

  const rawScore = positiveScore - negativeScore
  const normalizedScore = Math.max(-1, Math.min(1, rawScore / 3.0))
  triggeredLabels.sort((a, b) => b.weight - a.weight)

  return {
    score: Math.round(normalizedScore * 100) / 100,
    hasFrustrationSignals: negativeScore >= 0.5,
    frustrationLabels: triggeredLabels.map(t => t.label),
    confidence: Math.min(0.95, 0.3 + triggeredLabels.length * 0.15),
    dominantSignal: triggeredLabels[0]?.label ?? null,
  }
}

export function isExecutiveContact(title: string | null | undefined): boolean {
  if (!title) return false
  return /\b(ceo|cto|coo|cfo|cpo|vp|vice president|president|director|head of|chief|founder|owner|partner)\b/i.test(title)
}

export function isSLABreached(dueBy: string | null, status: number, resolvedAt: string | null): boolean {
  if (!dueBy) return false
  if (status === 4 || status === 5) return false
  if (resolvedAt) return new Date(resolvedAt) > new Date(dueBy)
  return new Date() > new Date(dueBy)
}

