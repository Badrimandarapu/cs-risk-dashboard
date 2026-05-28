'use client'
import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Account {
  id: number
  name: string
  healthScore: number
  riskLevel: string
  metrics: any
  signals: any[]
}

const HEALTH_DATA = [
  { month: 'Jan', value: 85 },
  { month: 'Feb', value: 78 },
  { month: 'Mar', value: 68 },
  { month: 'Apr', value: 55 },
  { month: 'May', value: 42 },
]

export default function Dashboard() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/intelligence')
      .then(res => res.json())
      .then(data => {
        setAccounts(data.accounts || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const totalAccounts = accounts.length
  const criticalAccounts = accounts.filter(a => a.riskLevel === 'red').length
  const healthyAccounts = accounts.filter(a => a.riskLevel === 'green').length
  const avgHealth = Math.round(accounts.reduce((s, a) => s + a.healthScore, 0) / (accounts.length || 1))

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff' }}>
      <div style={{ borderBottom: '1px solid #1e293b', padding: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>CS Risk Intelligence</h1>
        <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Live Freshdesk Integration</p>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem', display: 'grid', gap: '2rem' }}>
        
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Total Accounts</p>
            <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#3b82f6', marginTop: '0.5rem' }}>{totalAccounts}</p>
          </div>
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Healthy</p>
            <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#10b981', marginTop: '0.5rem' }}>{healthyAccounts}</p>
          </div>
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Critical</p>
            <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#ef4444', marginTop: '0.5rem' }}>{criticalAccounts}</p>
          </div>
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Avg Health</p>
            <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#f59e0b', marginTop: '0.5rem' }}>{avgHealth}</p>
          </div>
        </div>

        {/* Chart */}
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Health Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={HEALTH_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Accounts Table */}
        {!loading && (
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #334155', backgroundColor: '#0f172a' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Risk Radar (From Freshdesk)</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155', backgroundColor: '#0f172a' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Account</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Health</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Open</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Critical</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Risk</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id} style={{ borderBottom: '1px solid #334155' }}>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>{account.name}</td>
                    <td style={{ padding: '1rem', fontWeight: '500', color: '#3b82f6' }}>{account.healthScore}</td>
                    <td style={{ padding: '1rem' }}>{account.metrics.openTickets}</td>
                    <td style={{ padding: '1rem', color: '#ef4444' }}>{account.metrics.criticalTickets}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        backgroundColor: account.riskLevel === 'red' ? '#7f1d1d' : account.riskLevel === 'yellow' ? '#78350f' : '#064e3b',
                        color: account.riskLevel === 'red' ? '#fca5a5' : account.riskLevel === 'yellow' ? '#fcd34d' : '#6ee7b7'
                      }}>
                        {account.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
