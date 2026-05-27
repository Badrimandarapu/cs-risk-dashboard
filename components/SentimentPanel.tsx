'use client'

export default function SentimentPanel() {
  const sentimentData = [
    { account: 'Acme Corp', sentiment: -15, trend: '↓ declining', color: '#ef4444' },
    { account: 'TechCorp', sentiment: 5, trend: '→ stable', color: '#f59e0b' },
    { account: 'Innovation Inc', sentiment: 45, trend: '↑ improving', color: '#22c55e' },
    { account: 'Global Systems', sentiment: -35, trend: '↓↓ critical', color: '#dc2626' },
  ]

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '24px',
        marginBottom: '32px',
      }}
    >
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>😊 Stakeholder Sentiment Panel</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {sentimentData.map((data, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              backgroundColor: '#f9fafb',
              borderRadius: '6px',
              borderLeft: `4px solid ${data.color}`,
            }}
          >
            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{data.account}</p>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>Sentiment Score: {data.sentiment}</p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '13px', fontWeight: 'bold', color: data.color }}>{data.trend}</p>
              <div
                style={{
                  width: '100px',
                  height: '6px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '3px',
                  marginTop: '4px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${Math.max(0, data.sentiment + 50)}%`,
                    height: '100%',
                    backgroundColor: data.color,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}