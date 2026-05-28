'use client'

const ESCALATIONS = [
  { id: 1, account: 'Acme Global Corp', status: 'Active', priority: 'Critical', daysOpen: 3, executive: 'CFO - John Smith', issue: 'Payment module blocking go-live' },
  { id: 2, account: 'Fashion Retail Group', status: 'Active', priority: 'High', daysOpen: 5, executive: 'CTO - Sarah Johnson', issue: 'User management failures' },
  { id: 3, account: 'Retail Dynamics Inc', status: 'Pending', priority: 'High', daysOpen: 2, executive: 'CEO - Mike Chen', issue: 'Renewal discussion needed' },
]

export default function EscalationsPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff' }}>
      <div style={{ borderBottom: '1px solid #1e293b', padding: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>Active Escalations</h1>
        <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>{ESCALATIONS.length} escalations requiring immediate attention</p>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155', backgroundColor: '#0f172a' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>Account</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>Executive</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>Issue</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>Priority</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>Days Open</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {ESCALATIONS.map((esc) => (
                <tr key={esc.id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '1rem', fontWeight: '500', fontSize: '0.875rem' }}>{esc.account}</td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#94a3b8' }}>{esc.executive}</td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#94a3b8' }}>{esc.issue}</td>
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
                  <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '500' }}>{esc.daysOpen} days</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: esc.status === 'Active' ? '#7f1d1d' : '#78350f',
                      color: esc.status === 'Active' ? '#fca5a5' : '#fcd34d'
                    }}>
                      {esc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
