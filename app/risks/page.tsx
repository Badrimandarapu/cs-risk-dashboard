'use client'
import { useEffect, useState } from 'react'

interface Risk {
  id: string
  account: string
  type: string
  severity: string
  probability: number
  description: string
}

export default function RisksPage() {
  const [risks, setRisks] = useState<Risk[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/risks')
      .then(r => r.json())
      .then(data => { setRisks(data.risks ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div>Loading risks...</div>
    </div>
  )

  const critical = risks.filter(r => r.severity === 'critical').length
  const high = risks.filter(r => r.severity === 'high').length

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff' }}>
      <div style={{ borderBottom: '1px solid #1e293b', padding: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>Identified Risks</h1>
        <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>{risks.length} active risks · {critical} critical · {high} high</p>
      </div>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {risks.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '3rem' }}>No active risks detected</div>
          ) : (
            risks.map((risk) => (
              <div key={risk.id} style={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '1.5rem',
                borderLeft: `4px solid ${risk.severity === 'critical' ? '#ef4444' : risk.severity === 'high' ? '#f59e0b' : '#10b981'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{risk.type}</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{risk.description}</p>
                    <p style={{ color: '#64748b', fontSize: '0.75rem' }}>Account: <strong>{risk.account}</strong></p>
                  </div>
                  <div style={{ textAlign: 'right', marginLeft: '2rem' }}>
                    <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: risk.severity === 'critical' ? '#ef4444' : '#f59e0b', marginBottom: '0.5rem' }}>{risk.probability}%</p>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Probability</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
