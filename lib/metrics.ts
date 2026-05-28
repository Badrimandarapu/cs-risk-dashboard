import { FreshDeskTicket } from './freshdesk'

export interface AccountMetrics {
  accountName: string
  healthScore: number
  riskLevel: 'green' | 'yellow' | 'red'
  escalationPercentage: number
  ticketCount: number
  criticalTickets: number
  sentiment: 'positive' | 'neutral' | 'negative'
}

export function calculateAccountMetrics(
  accountName: string,
  healthScoreFromSheet: number,
  escalationFromSheet: number,
  tickets: FreshDeskTicket[]
): AccountMetrics {
  // Start with Google Sheets data as base
  let healthScore = healthScoreFromSheet

  // Adjust health score based on Freshdesk tickets
  const criticalTickets = tickets.filter((t) => t.priority === 4).length
  const openTickets = tickets.filter((t) => t.status === 2).length

  // Each critical ticket reduces health by 5
  healthScore -= criticalTickets * 5
  // Each open ticket reduces health by 2
  healthScore -= openTickets * 2

  // Ensure health score is 0-100
  healthScore = Math.max(0, Math.min(100, healthScore))

  // Determine risk level
  let riskLevel: 'green' | 'yellow' | 'red' = 'green'
  if (healthScore >= 70) riskLevel = 'green'
  else if (healthScore >= 40) riskLevel = 'yellow'
  else riskLevel = 'red'

  // Calculate escalation percentage
  let escalationPercentage = escalationFromSheet
  if (criticalTickets > 0) {
    escalationPercentage = Math.min(100, escalationPercentage + criticalTickets * 15)
  }

  // Determine sentiment based on ticket health
  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral'
  if (criticalTickets > 2) sentiment = 'negative'
  else if (criticalTickets === 0 && openTickets < 2) sentiment = 'positive'

  return {
    accountName,
    healthScore,
    riskLevel,
    escalationPercentage: Math.min(100, escalationPercentage),
    ticketCount: tickets.length,
    criticalTickets,
    sentiment,
  }
}