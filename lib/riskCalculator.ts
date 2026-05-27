export interface RiskScore {
  score: number // 0-100
  level: 'green' | 'yellow' | 'red'
  factors: string[]
  explanation: string
}

export function calculateRiskScore(account: any, tickets: any[] = []): RiskScore {
  let score = 100 // Start at perfect
  const factors: string[] = []

  // Factor 1: Health Score (40% weight)
  const healthImpact = (100 - account.healthScore) * 0.4
  score -= healthImpact
  if (account.healthScore < 50) {
    factors.push('Critical health score below 50%')
  } else if (account.healthScore < 70) {
    factors.push('Health score declining')
  }

  // Factor 2: Critical Tickets (30% weight)
  const criticalTickets = tickets.filter((t) => t.priority === 'critical').length
  score -= criticalTickets * 15
  if (criticalTickets > 0) {
    factors.push(`${criticalTickets} critical tickets open`)
  }

  // Factor 3: Escalation Probability (30% weight)
  const escImpact = account.escalationProbability * 30
  score -= escImpact
  if (account.escalationProbability > 0.5) {
    factors.push('High escalation probability')
  }

  // Ensure score is 0-100
  score = Math.max(0, Math.min(100, score))

  // Determine level
  let level: 'green' | 'yellow' | 'red' = 'green'
  if (score >= 70) level = 'green'
  else if (score >= 40) level = 'yellow'
  else level = 'red'

  // Generate explanation
  const explanation = factors.length > 0 
    ? factors.join(' • ')
    : 'Account is healthy with no immediate risks'

  return { score, level, factors, explanation }
}