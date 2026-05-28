export interface Signal {
  id: string
  type: 'escalation' | 'sentiment_decline' | 'support_stress'
  severity: 'low' | 'medium' | 'high' | 'critical'
  confidence: number
  timestamp: Date
  accountId: number
  accountName: string
  description: string
  metadata: Record<string, any>
  recommendedAction?: string
}

export class SignalEngine {
  static createEscalationSignal(
    accountId: number,
    accountName: string,
    metadata: any
  ): Signal | null {
    if (metadata.criticalTickets < 2) return null

    return {
      id: `esc-${accountId}-${Date.now()}`,
      type: 'escalation',
      severity: 'critical',
      confidence: Math.min(100, metadata.criticalTickets * 30),
      timestamp: new Date(),
      accountId,
      accountName,
      description: `${metadata.criticalTickets} critical issues unresolved`,
      metadata,
      recommendedAction: 'Schedule emergency C-level sync',
    }
  }

  static createSupportStressSignal(
    accountId: number,
    accountName: string,
    metadata: any
  ): Signal | null {
    if (metadata.openTickets < 5) return null

    return {
      id: `stress-${accountId}-${Date.now()}`,
      type: 'support_stress',
      severity: 'high',
      confidence: Math.min(100, metadata.openTickets * 15),
      timestamp: new Date(),
      accountId,
      accountName,
      description: `${metadata.openTickets} open tickets`,
      metadata,
      recommendedAction: 'Prioritize critical issues',
    }
  }

  static calculateHealthScore(signals: Signal[]) {
    const score = Math.max(0, 100 - signals.length * 20)
    return {
      score,
      riskLevel: score >= 70 ? 'green' : score >= 40 ? 'yellow' : 'red',
      dominantSignals: signals.map(s => s.type),
    }
  }
}
