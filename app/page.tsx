'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const HEALTH_DATA = [
  { month: 'Jan', value: 85 },
  { month: 'Feb', value: 78 },
  { month: 'Mar', value: 68 },
  { month: 'Apr', value: 55 },
  { month: 'May', value: 42 },
]

const ACCOUNTS = [
  { id: 1, name: 'Acme Global', risk: 'critical', health: 32, escalation: 89, sentiment: -45 },
  { id: 2, name: 'TechVenture', risk: 'warning', health: 58, escalation: 42, sentiment: 15 },
  { id: 3, name: 'GlobalTrade', risk: 'healthy', health: 85, escalation: 12, sentiment: 72 },
  { id: 4, name: 'Fashion Retail', risk: 'critical', health: 42, escalation: 76, sentiment: -28 },
  { id: 5, name: 'CloudFirst', risk: 'healthy', health: 78, escalation: 18, sentiment: 54 },
]

export default function Dashboard() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #1e293b', padding: '2rem', backgroundImage: 'linear-gradient(to right, #0f172a, #0f172a)' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>CS Risk Intelligence</h1>
        <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Enterprise customer success monitoring</p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
        
        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Total ARR</p>
            <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#3b82f6', marginTop: '0.5rem' }}>$1.95M</p>
          </div>
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Healthy</p>
            <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#10b981', marginTop: '0.5rem' }}>2</p>
          </div>
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>At Risk</p>
            <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#ef4444', marginTop: '0.5rem' }}>3</p>
          </div>
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Avg Escalation</p>
            <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#f59e0b', marginTop: '0.5rem' }}>47%</p>
          </div>
        </div>

        {/* Chart */}
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Account Health Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={HEALTH_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Radar Table */}
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #334155', backgroundColor: '#0f172a' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Risk Radar</h3>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.25rem' }}>Account health and escalation probability</p>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155', backgroundColor: '#0f172a' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>Account</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>Risk</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>Health</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>Escalation</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>Sentiment</th>
              </tr>
            </thead>
            <tbody>
              {ACCOUNTS.map((account) => (
                <tr key={account.id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '500' }}>{account.name}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: account.risk === 'critical' ? '#7f1d1d' : account.risk === 'warning' ? '#78350f' : '#064e3b',
                      color: account.risk === 'critical' ? '#fca5a5' : account.risk === 'warning' ? '#fcd34d' : '#6ee7b7'
                    }}>
                      {account.risk}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '600', color: '#3b82f6' }}>{account.health}</td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '600', color: '#f59e0b' }}>{account.escalation}%</td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '600', color: account.sentiment > 0 ? '#10b981' : '#ef4444' }}>
                    {account.sentiment > 0 ? '+' : ''}{account.sentiment}
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
