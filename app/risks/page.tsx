'use client'

const RISKS = [
  { id: 1, account: 'Acme Global', type: 'Escalation Risk', severity: 'critical', probability: 89, description: 'Payment processing failures blocking go-live' },
  { id: 2, account: 'Fashion Retail', type: 'Sentiment Decline', severity: 'high', probability: 76, description: 'Admin team sentiment dropped 40 points in 5 days' },
  { id: 3, account: 'TechVenture', type: 'Implementation Delay', severity: 'medium', probability: 42, description: 'Implementation velocity declining, adoption at 62%' },
]

export default function RisksPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff' }}>
      <div style={{ borderBottom: '1px solid #1e293b', padding: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>Identified Risks</h1>
        <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Account risks and escalation triggers</p>
      </div>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {RISKS.map((risk) => (
            <div key={risk.id} style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '1.5rem',
              borderLeft: `4px solid ${risk.severity === 'critical' ? '#ef4444' : '#f59e0b'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontWeight: '600' }}>{risk.type}</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>{risk.description}</p>
                  <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.5rem' }}>{risk.account}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: risk.severity === 'critical' ? '#ef4444' : '#f59e0b' }}>{risk.probability}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
