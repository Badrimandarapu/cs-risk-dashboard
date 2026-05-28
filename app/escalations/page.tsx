'use client'

const ESCALATIONS = [
  { id: 1, account: 'Acme Global Corp', priority: 'Critical', daysOpen: 3, issue: 'Payment module blocking go-live' },
  { id: 2, account: 'Fashion Retail Group', priority: 'High', daysOpen: 5, issue: 'User management failures' },
]

export default function EscalationsPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff' }}>
      <div style={{ borderBottom: '1px solid #1e293b', padding: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>Active Escalations</h1>
        <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>{ESCALATIONS.length} escalations requiring attention</p>
      </div>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155', backgroundColor: '#0f172a' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Account</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Issue</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Priority</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Days Open</th>
              </tr>
            </thead>
            <tbody>
              {ESCALATIONS.map((esc) => (
                <tr key={esc.id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{esc.account}</td>
                  <td style={{ padding: '1rem', color: '#94a3b8' }}>{esc.issue}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: esc.priority === 'Critical' ? '#7f1d1d' : '#78350f',
                      color: esc.priority === 'Critical' ? '#fca5a5' : '#fcd34d'
                    }}>
                      {esc.priority}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{esc.daysOpen} days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
