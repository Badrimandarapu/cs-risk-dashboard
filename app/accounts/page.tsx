'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const ACCOUNTS = [
  { id: 1, name: 'Acme Global Corp', industry: 'E-Commerce', tier: 'Enterprise', health: 32, users: 1240, mrr: 45000, status: 'critical' },
  { id: 2, name: 'TechVenture Inc', industry: 'SaaS', tier: 'Mid-Market', health: 58, users: 520, mrr: 18000, status: 'warning' },
  { id: 3, name: 'GlobalTrade Solutions', industry: 'Logistics', tier: 'Enterprise', health: 85, users: 2100, mrr: 78000, status: 'healthy' },
  { id: 4, name: 'Fashion Retail Group', industry: 'Retail', tier: 'Enterprise', health: 42, users: 850, mrr: 32000, status: 'critical' },
  { id: 5, name: 'CloudFirst Analytics', industry: 'Data', tier: 'Mid-Market', health: 78, users: 420, mrr: 22000, status: 'healthy' },
]

const HEALTH_CHART = [
  { name: 'Acme', health: 32 },
  { name: 'Fashion', health: 42 },
  { name: 'Tech', health: 58 },
  { name: 'Retail', health: 51 },
  { name: 'CloudFirst', health: 78 },
  { name: 'GlobalTrade', health: 85 },
]

export default function AccountsPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff' }}>
      <div style={{ borderBottom: '1px solid #1e293b', padding: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>All Accounts</h1>
        <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Manage and monitor all customer accounts</p>
      </div>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Health Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={HEALTH_CHART}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
              <Bar dataKey="health" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #334155', backgroundColor: '#0f172a' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Accounts</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155', backgroundColor: '#0f172a' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>Account</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>Tier</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>Users</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>MRR</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {ACCOUNTS.map((account) => (
                <tr key={account.id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '500' }}>{account.name}</td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{account.tier}</td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '500' }}>{account.users.toLocaleString()}</td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '500' }}>${(account.mrr / 1000).toFixed(0)}K</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: account.status === 'critical' ? '#7f1d1d' : account.status === 'warning' ? '#78350f' : '#064e3b',
                      color: account.status === 'critical' ? '#fca5a5' : account.status === 'warning' ? '#fcd34d' : '#6ee7b7'
                    }}>
                      {account.status}
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
