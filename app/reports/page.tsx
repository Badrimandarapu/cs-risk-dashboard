'use client'

export default function ReportsPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff' }}>
      <div style={{ borderBottom: '1px solid #1e293b', padding: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>Reports & Analytics</h1>
        <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Executive reports and custom analytics</p>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          {[
            { title: 'Monthly Health Report', desc: 'Account health trends and KPIs' },
            { title: 'Escalation Summary', desc: 'Active escalations and resolutions' },
            { title: 'Sentiment Analysis', desc: 'Stakeholder sentiment trends' },
            { title: 'Renewal Forecast', desc: 'Upcoming renewals and churn risks' },
          ].map((report, i) => (
            <div key={i} style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#60a5fa'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#334155'}>
              <h3 style={{ fontWeight: '600' }}>{report.title}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>{report.desc}</p>
              <button style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' }}>
                View Report →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
