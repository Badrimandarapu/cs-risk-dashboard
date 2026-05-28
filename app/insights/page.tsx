'use client'

const INSIGHTS = [
  { id: 1, type: 'escalation', severity: 'critical', title: 'Executive Escalation Risk - Acme Global', description: 'Escalation probability surged from 66% to 89% in 48 hours. Payment processing failures blocking go-live. CFO sentiment dropped 35 points.', action: 'Schedule emergency C-suite sync' },
  { id: 2, type: 'sentiment', severity: 'high', title: 'Negative Sentiment Spike - Fashion Retail', description: 'Admin team sentiment declined 40 points over 5 days. 4 critical, unresolved tickets in user management module. No response from support in 3 days.', action: 'Assign senior engineer + priority SLA' },
  { id: 3, type: 'adoption', severity: 'medium', title: 'Implementation Velocity Declining - TechVenture', description: 'Implementation 78% complete but velocity slowed 23%. Key stakeholder marked low availability. Feature adoption at 62% of target.', action: 'Assign dedicated CSM + adoption workshop' },
]

export default function InsightsPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff' }}>
      <div style={{ borderBottom: '1px solid #1e293b', padding: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>AI Insights</h1>
        <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Operational intelligence and escalation predictions</p>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {INSIGHTS.map((insight) => (
            <div key={insight.id} style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '1.5rem',
              borderLeft: `4px solid ${insight.severity === 'critical' ? '#ef4444' : insight.severity === 'high' ? '#f59e0b' : '#3b82f6'}`
            }}>
              <h3 style={{ fontWeight: '600', fontSize: '1rem' }}>{insight.title}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.75rem' }}>{insight.description}</p>
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #334155' }}>
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>Recommended Action</p>
                <p style={{ fontWeight: '500', fontSize: '0.875rem', color: '#60a5fa' }}➜ {insight.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
