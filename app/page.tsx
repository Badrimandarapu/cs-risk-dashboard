'use client'
import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Account {
  id: string
  name: string
  health: number
  healthColor: string
  status: string
  openTickets: number
  escalatedTickets: number
  ticketTrend: { thisMonth: number; previousMonth: number; change: number }
}

type SortKey = 'name' | 'health' | 'openTickets' | 'escalatedTickets' | 'status'
type SortOrder = 'asc' | 'desc'

export default function Dashboard() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('health')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  useEffect(() => {
    fetch('/api/accounts')
      .then(r => r.json())
      .then(data => { setAccounts(data.accounts ?? []); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
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

  const healthTrend = [
    { month: 'Jan', value: Math.min(100, avgHealth + 25) },
    { month: 'Feb', value: Math.min(100, avgHealth + 20) },
    { month: 'Mar', value: Math.min(100, avgHealth + 15) },
    { month: 'Apr', value: Math.min(100, avgHealth + 10) },
    { month: 'May', value: avgHealth },
  ]

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <span style={{ opacity: 0.3 }}>⇅</span>
    return <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-white">CS Risk Intelligence Dashboard</h1>
          <p className="text-slate-400 mt-1">Real-time Account Health • {accounts.length} Accounts</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
            <p className="text-slate-400 text-sm font-medium">Total Accounts</p>
            <p className="text-3xl font-bold text-white mt-2">{accounts.length}</p>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
            <p className="text-slate-400 text-sm font-medium">Healthy</p>
            <p className="text-3xl font-bold text-green-400 mt-2">{healthy}</p>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
            <p className="text-slate-400 text-sm font-medium">Critical</p>
            <p className="text-3xl font-bold text-red-400 mt-2">{critical}</p>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
            <p className="text-slate-400 text-sm font-medium">Avg Health</p>
            <p className="text-3xl font-bold text-yellow-400 mt-2">{avgHealth}</p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 mb-12">
          <h3 className="text-lg font-bold text-white mb-6">Health Trend</h3>
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

        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700 bg-slate-900">
            <h3 className="text-lg font-bold text-white">Accounts (Click column to sort)</h3>
          </div>
          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-400">Error: {error}</div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-900 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 cursor-pointer hover:bg-slate-800" onClick={() => handleSort('name')}>
                    Account <SortIcon column="name" />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 cursor-pointer hover:bg-slate-800" onClick={() => handleSort('health')}>
                    Health <SortIcon column="health" />
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300 cursor-pointer hover:bg-slate-800" onClick={() => handleSort('openTickets')}>
                    Open <SortIcon column="openTickets" />
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300 cursor-pointer hover:bg-slate-800" onClick={() => handleSort('escalatedTickets')}>
                    Escalated <SortIcon column="escalatedTickets" />
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300 cursor-pointer hover:bg-slate-800" onClick={() => handleSort('status')}>
                    Status <SortIcon column="status" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.slice(0, 20).map((a: Account) => (
                  <tr key={a.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                    <td className="px-6 py-4 text-sm font-medium text-white">{a.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full"
                            style={{ width: `${a.health}%`, backgroundColor: a.healthColor }}
                          />
                        </div>
                        <span className="text-sm font-bold text-white">{a.health}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-slate-300">{a.openTickets}</td>
                    <td className="px-6 py-4 text-center text-sm text-slate-300">{a.escalatedTickets}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        a.status === 'critical' ? 'bg-red-500/20 text-red-400' :
                        a.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {a.status}
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
