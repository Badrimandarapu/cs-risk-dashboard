'use client'

const INSIGHTS = [
  { id: 1, title: 'Executive Escalation Risk - Acme Global', description: 'Escalation probability surged to 89%. Payment blocking go-live. CFO sentiment dropped 35 points.', action: 'Schedule emergency sync' },
  { id: 2, title: 'Negative Sentiment - Fashion Retail', description: 'Sentiment declined 40 points. 4 critical tickets unresolved. No support response in 3 days.', action: 'Assign senior engineer' },
]

export default function InsightsPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff' }}>
      <div style={{ borderBottom: '1px solid #1e293b', padding: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>AI Insights</h1>
        <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Operational intelligence and predictions</p>
      </div>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
        {INSIGHTS.map((insight) => (
          <div key={insight.id} style={{
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '1rem',
            borderLeft: '4px solid #ef4444'
          }}>
            <h3 style={{ fontWeight: '600' }}>{insight.title}</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.75rem' }}>{insight.description}</p>
            <p style={{ fontWeight: '500', fontSize: '0.875rem', color: '#60a5fa', marginTop: '1rem' }}>→ {insight.action}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
