'use client'

export default function ReportsPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff' }}>
      <div style={{ borderBottom: '1px solid #1e293b', padding: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>Reports</h1>
        <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Executive reports and analytics</p>
      </div>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          {['Monthly Health Report', 'Escalation Summary', 'Sentiment Analysis', 'Renewal Forecast'].map((report, i) => (
            <div key={i} style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '1.5rem'
            }}>
              <h3 style={{ fontWeight: '600' }}>{report}</h3>
              <button style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>
                View →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
