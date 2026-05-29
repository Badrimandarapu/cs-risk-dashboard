'use client'
import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Account {
  id: string
  name: string
  health: number
  healthColor: string
  status: string
  openTickets: number
  criticalTickets: number
  escalatedTickets: number
  activeSignals: number
  stakeholders: number
  riskLevel: string
  lastActivity: string
}

type SortKey = 'name' | 'health' | 'openTickets' | 'escalatedTickets' | 'status'
type SortOrder = 'asc' | 'desc'

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [sortKey, setSortKey] = useState<SortKey>('health')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  useEffect(() => {
    fetch('/api/accounts')
      .then(r => r.json())
      .then(data => { setAccounts(data.accounts ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('desc')
    }
  }

  const sorted = [...accounts].sort((a, b) => {
    let aVal: any = a[sortKey]
    let bVal: any = b[sortKey]
    
    if (typeof aVal === 'string') aVal = aVal.toLowerCase()
    if (typeof bVal === 'string') bVal = bVal.toLowerCase()
    
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  const avgHealth = accounts.length > 0 ? Math.round(accounts.reduce((s: number, a: Account) => s + a.health, 0) / accounts.length) : 0
  const critical = accounts.filter((a: Account) => a.status === 'critical').length
  const healthy = accounts.filter((a: Account) => a.status === 'healthy').length

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <span style={{ opacity: 0.3 }}>⇅</span>
    return <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
  }

  // Determine status from health color
  const getStatusFromColor = (healthColor: string, status: string) => {
    if (healthColor === '#ef4444') return 'critical'
    if (healthColor === '#f59e0b') return 'warning'
    return 'healthy'
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff' }}>
      <div style={{ borderBottom: '1px solid #1e293b', padding: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>All Accounts</h1>
        <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Manage and monitor all customer accounts</p>
      </div>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
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

        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #334155', backgroundColor: '#0f172a' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Accounts (Click column to sort)</h3>
          </div>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155', backgroundColor: '#0f172a' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', cursor: 'pointer' }} onClick={() => handleSort('name')}>
                    Account <SortIcon column="name" />
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', cursor: 'pointer' }} onClick={() => handleSort('health')}>
                    Health <SortIcon column="health" />
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', cursor: 'pointer' }} onClick={() => handleSort('openTickets')}>
                    Open <SortIcon column="openTickets" />
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', cursor: 'pointer' }} onClick={() => handleSort('escalatedTickets')}>
                    Escalated <SortIcon column="escalatedTickets" />
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', cursor: 'pointer' }} onClick={() => handleSort('status')}>
                    Status <SortIcon column="status" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((account) => {
                  const displayStatus = getStatusFromColor(account.healthColor, account.status)
                  return (
                    <tr key={account.id} style={{ borderBottom: '1px solid #334155' }}>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '500' }}>{account.name}</td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '60px', height: '6px', backgroundColor: '#334155', borderRadius: '3px', overflow: 'hidden' }}>
                            <div 
                              style={{
                                height: '100%',
                                width: `${account.health}%`,
                                backgroundColor: account.healthColor,
                                borderRadius: '3px'
                              }}
                            />
                          </div>
                          <span style={{ fontWeight: '600', minWidth: '30px', fontSize: '0.875rem' }}>{account.health}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center', fontWeight: '500', fontSize: '0.875rem' }}>{account.openTickets}</td>
                      <td style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#ef4444', fontSize: '0.875rem' }}>{account.escalatedTickets}</td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          backgroundColor: displayStatus === 'critical' ? '#7f1d1d' : displayStatus === 'warning' ? '#78350f' : '#064e3b',
                          color: displayStatus === 'critical' ? '#fca5a5' : displayStatus === 'warning' ? '#fcd34d' : '#6ee7b7'
                        }}>
                          {displayStatus}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
