'use client'
import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Account {
  id: string
  name: string
  displayName: string
  industry: string
  tier: string
  health: number
  status: string
  openTickets: number
  criticalTickets: number
  escalatedTickets: number
  activeSignals: number
  stakeholders: number
  riskLevel: string
  lastActivity: string | null
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/accounts')
      .then(r => r.json())
      .then(data => { setAccounts(data.accounts ?? []); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  const healthChart = accounts.slice(0, 10).map(a => ({ name: a.name.split(' ')[0], health: a.health }))

  if (loading) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Loading accounts...</div>
        <div style={{ color: '#64748b' }}>Fetching from database</div>
      </div>
    </div>
  )

  if (error) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#f87171' }}>Error: {error}</div>
    </div>
  )

  const critical = accounts.filter(a => a.status === 'critical').length
  const warning = accounts.filter(a => a.status === 'warning').length
  const healthy = accounts.filter(a => a.status === 'healthy').length

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff' }}>
      <div style={{ borderBottom: '1px solid #1e293b', padding: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>All Accounts</h1>
        <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>{accounts.length} accounts · {critical} critical · {warning} warning · {healthy} healthy</p>
      </div>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Accounts', value: accounts.length, color: '#3b82f6' },
            { label: 'Critical', value: critical, color: '#ef4444' },
            { label: 'Warning', value: warning, color: '#f59e0b' },
            { label: 'Healthy', value: healthy, color: '#10b981' },
          ].map(card => (
            <div key={card.label} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem' }}>
              <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{card.label}</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: card.color, marginTop: '0.5rem' }}>{card.value}</div>
            </div>
          ))}
        </div>

        {/* Health Chart */}
        {healthChart.length > 0 && (
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
            <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Health Distribution (Top 10)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={healthChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                <Bar dataKey="health" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Accounts Table */}
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #334155', backgroundColor: '#0f172a' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Accounts ({accounts.length})</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155', backgroundColor: '#0f172a' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem', color: '#94a3b8' }}>Account</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem', color: '#94a3b8' }}>Industry</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem', color: '#94a3b8' }}>Health</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem', color: '#94a3b8' }}>Open Tickets</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem', color: '#94a3b8' }}>Signals</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem', color: '#94a3b8' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.id} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>{account.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{account.tier}</div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#94a3b8' }}>{account.industry}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ flex: 1, height: '6px', backgroundColor: '#334155', borderRadius: '3px', maxWidth: '80px' }}>
                        <div style={{ height: '100%', borderRadius: '3px', width: `${account.health}%`, backgroundColor: account.health >= 70 ? '#10b981' : account.health >= 45 ? '#f59e0b' : '#ef4444' }} />
                      </div>
                      <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{account.health}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                    <span style={{ color: account.criticalTickets > 0 ? '#ef4444' : '#94a3b8' }}>
                      {account.openTickets} {account.criticalTickets > 0 && `(${account.criticalTickets} critical)`}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: account.activeSignals > 0 ? '#f59e0b' : '#94a3b8' }}>
                    {account.activeSignals}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600',
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
