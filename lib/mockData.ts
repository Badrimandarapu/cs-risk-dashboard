export const mockAccounts = [
  { id: 1, name: 'Acme Corp', company: 'Acme', riskLevel: 'red', healthScore: 45, escalationProbability: 0.75 },
  { id: 2, name: 'TechCorp', company: 'TechCorp', riskLevel: 'yellow', healthScore: 65, escalationProbability: 0.40 },
  { id: 3, name: 'Innovation Inc', company: 'InnovationInc', riskLevel: 'green', healthScore: 92, escalationProbability: 0.05 },
  { id: 4, name: 'Global Systems', company: 'GlobalSys', riskLevel: 'red', healthScore: 35, escalationProbability: 0.85 },
  { id: 5, name: 'NextGen Solutions', company: 'NextGen', riskLevel: 'yellow', healthScore: 70, escalationProbability: 0.30 },
]

export const mockInsights = [
  { id: 1, accountId: 1, message: '⚠️ Client sentiment declined after pricing issue', type: 'warning' },
  { id: 2, accountId: 4, message: '⚠️ 3 critical tickets reopened in 7 days', type: 'warning' },
  { id: 3, accountId: 2, message: '⚠️ Stakeholder engagement dropped 40%', type: 'critical' },
  { id: 4, accountId: 3, message: '✅ Support response time improved 25%', type: 'positive' },
]

export const mockTickets = [
  { id: 1, accountId: 1, title: 'Payment integration broken', status: 'open', priority: 'critical' },
  { id: 2, accountId: 1, title: 'Feature request not addressed', status: 'open', priority: 'high' },
  { id: 3, accountId: 4, title: 'API rate limiting issue', status: 'open', priority: 'critical' },
  { id: 4, accountId: 2, title: 'Documentation update needed', status: 'open', priority: 'medium' },
]