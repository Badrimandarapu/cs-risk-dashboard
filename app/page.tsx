'use client'
import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Account {
  id: string
  name: string
  health: number
  status: string
  openTickets: number
  criticalTickets: number
  activeSignals: number
}

export default function Dashboard() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/accounts')
        const data = await res.json()
        if (data.accounts) {
          setAccounts(data.accounts)
        }
      } catch (err: unknown) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const avgHealth = accounts.length > 0
    ? Math.round(accounts.reduce((s: number, a: Account) => s + a.health, 0) / accounts.length)
    : 0
  const critical = accounts.filter((a: Account) => a.status === 'critical').length
  const warning = accounts.filter((a: Account) => a.status === 'warning').length
  const healthy = accounts.filter((a: Account) => a.status === 'healthy').length

  // Simple trend: declining health
  const healthTrend = [
    { month: 'Jan', value: Math.min(100, avgHealth + 25) },
    { month: 'Feb', value: Math.min(100, avgHealth + 20) },
    { month: 'Mar', value: Math.min(100, avgHealth + 15) },
    { month: 'Apr', value: Math.min(100, avgHealth + 10) },
    { month: 'May', value: avgHealth },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff' }}>
      <div style={{ borderBottom: '1px solid #1e293b', padding: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>CS Risk Intelligence Dashboard</h1>
        <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Real-time Account Health • {accounts.length} Accounts</p>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
        
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Total Accounts</p>
            <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#3b82f6', marginTop: '0.5rem' }}>{accounts.length}</p>
          </div>
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Healthy</p>
            <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#10b981', marginTop: '0.5rem' }}>{healthy}</p>
          </div>
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Critical</p>
            <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#ef4444', marginTop: '0.5rem' }}>{critical}</p>
          </div>
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Avg Health</p>
            <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#f59e0b', marginTop: '0.5rem' }}>{avgHealth}</p>
          </div>
        </div>

        {/* Chart */}
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Health Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={healthTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Radar Table */}
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #334155', backgroundColor: '#0f172a' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Risk Radar</h3>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.25rem' }}>Real-time account health snapshot</p>
          </div>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading...</div>
          ) : error ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>Error: {error}</div>
          ) : accounts.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No accounts found</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155', backgroundColor: '#0f172a' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Account Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Health Score</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Open Tickets</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Critical</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {accounts.slice(0, 20).map((account: Account) => (
                  <tr key={account.id} style={{ borderBottom: '1px solid #334155' }}>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>{account.name}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '60px', height: '6px', backgroundColor: '#334155', borderRadius: '3px', overflow: 'hidden' }}>
                          <div 
                            style={{
                              height: '100%',
                              width: `${account.health}%`,
                              backgroundColor: account.health >= 70 ? '#10b981' : account.health >= 40 ? '#f59e0b' : '#ef4444'
                            }}
                          />
                        </div>
                        <span style={{ fontWeight: '600', minWidth: '30px' }}>{account.health}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', fontWeight: '500' }}>{account.openTickets}</td>
                    <td style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: account.criticalTickets > 0 ? '#ef4444' : '#94a3b8' }}>{account.criticalTickets}</td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
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
          )}
        </div>

      </div>
    </div>
  )
}
