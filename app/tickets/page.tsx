'use client'
import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface Ticket {
  id: string
  subject: string
  status: string
  priority: number
  account: { name: string }
  createdAt: string
  resolvedAt: string | null
  isEscalated: boolean
}

const priorityMap: Record<number, string> = { 1: 'Low', 2: 'Medium', 3: 'High', 4: 'Urgent' }
const statusColors: Record<string, string> = {
  'Open': '#3b82f6',
  'Pending': '#f59e0b',
  'Resolved': '#10b981',
  'Closed': '#6b7280',
}

type SortKey = 'id' | 'subject' | 'account' | 'status' | 'priority' | 'createdAt'
type SortOrder = 'asc' | 'desc'
type DateRange = '7days' | '1month' | '3months'

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [statusData, setStatusData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [dateRange, setDateRange] = useState<DateRange>('1month')

  useEffect(() => {
    fetch(`/api/tickets?range=${dateRange}`)
      .then(r => r.json())
      .then(d => {
        setTickets(d.tickets || [])
        
        const statusCount: Record<string, number> = {}
        for (const t of d.tickets || []) {
          if (t.status !== 'Closed') {
            statusCount[t.status] = (statusCount[t.status] || 0) + 1
          }
        }
        
        const chartData = Object.entries(statusCount).map(([status, count]) => ({
          status,
          count,
          color: statusColors[status] || '#94a3b8'
        }))
        setStatusData(chartData)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [dateRange])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('desc')
    }
  }

  const filtered = tickets.filter(t => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false
    if (priorityFilter !== 'all' && t.priority.toString() !== priorityFilter) return false
    if (searchQuery && !t.subject.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    let aVal: any = a[sortKey]
    let bVal: any = b[sortKey]
    
    if (sortKey === 'account') {
      aVal = a.account.name
      bVal = b.account.name
    }
    
    if (typeof aVal === 'string') aVal = aVal.toLowerCase()
    if (typeof bVal === 'string') bVal = bVal.toLowerCase()
    
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <span style={{ opacity: 0.3 }}>⇅</span>
    return <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>Support Tickets</h1>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>{sorted.length} / {tickets.length} tickets</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['7days', '1month', '3months'] as DateRange[]).map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: dateRange === range ? '#3b82f6' : '#334155',
                color: '#fff',
                fontWeight: '600',
                fontSize: '0.875rem'
              }}
            >
              {range === '7days' ? '7 Days' : range === '1month' ? '1 Month' : '3 Months'}
            </button>
          ))}
        </div>
      </div>

      {!loading && statusData.length > 0 && (
        <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', border: '1px solid #475569', borderRadius: '12px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '1rem', fontSize: '1.125rem' }}>📈 Ticket Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity={1} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="status" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '2px solid #3b82f6', borderRadius: '8px' }} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', border: '1px solid #475569', borderRadius: '12px', padding: '2rem', marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Search tickets by subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem' }}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px', padding: '0.5rem' }}
          >
            <option value="all">All Status</option>
            <option value="Open">Open</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px', padding: '0.5rem' }}
          >
            <option value="all">All Priority</option>
            <option value="1">Low</option>
            <option value="2">Medium</option>
            <option value="3">High</option>
            <option value="4">Urgent</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', paddingTop: '3rem', color: '#94a3b8' }}>Loading tickets...</div>
      ) : (
        <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', border: '1px solid #475569', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
          <table style={{ width: '100%' }}>
            <thead style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #334155' }}>
              <tr>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', cursor: 'pointer' }} onClick={() => handleSort('id')}>
                  ID <SortIcon column="id" />
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', cursor: 'pointer' }} onClick={() => handleSort('subject')}>
                  Subject <SortIcon column="subject" />
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', cursor: 'pointer' }} onClick={() => handleSort('account')}>
                  Account <SortIcon column="account" />
                </th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', cursor: 'pointer' }} onClick={() => handleSort('status')}>
                  Status <SortIcon column="status" />
                </th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', cursor: 'pointer' }} onClick={() => handleSort('priority')}>
                  Priority <SortIcon column="priority" />
                </th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', cursor: 'pointer' }} onClick={() => handleSort('createdAt')}>
                  Created <SortIcon column="createdAt" />
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((ticket) => (
                <tr key={ticket.id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', fontFamily: 'monospace', color: '#60a5fa' }}>{ticket.id}</td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#e2e8f0' }}>{ticket.subject.substring(0, 50)}</td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#94a3b8' }}>{ticket.account.name}</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '6
cat > ~/cs-risk-dashboard/app/tickets/page.tsx << 'EOF'
'use client'
import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface Ticket {
  id: string
  subject: string
  status: string
  priority: number
  account: { name: string }
  createdAt: string
  resolvedAt: string | null
  isEscalated: boolean
}

const priorityMap: Record<number, string> = { 1: 'Low', 2: 'Medium', 3: 'High', 4: 'Urgent' }
const statusColors: Record<string, string> = {
  'Open': '#3b82f6',
  'Pending': '#f59e0b',
  'Resolved': '#10b981',
  'Closed': '#6b7280',
}

type SortKey = 'id' | 'subject' | 'account' | 'status' | 'priority' | 'createdAt'
type SortOrder = 'asc' | 'desc'
type DateRange = '7days' | '1month' | '3months'

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [statusData, setStatusData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [dateRange, setDateRange] = useState<DateRange>('1month')

  useEffect(() => {
    fetch(`/api/tickets?range=${dateRange}`)
      .then(r => r.json())
      .then(d => {
        setTickets(d.tickets || [])
        
        const statusCount: Record<string, number> = {}
        for (const t of d.tickets || []) {
          if (t.status !== 'Closed') {
            statusCount[t.status] = (statusCount[t.status] || 0) + 1
          }
        }
        
        const chartData = Object.entries(statusCount).map(([status, count]) => ({
          status,
          count,
          color: statusColors[status] || '#94a3b8'
        }))
        setStatusData(chartData)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [dateRange])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('desc')
    }
  }

  const filtered = tickets.filter(t => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false
    if (priorityFilter !== 'all' && t.priority.toString() !== priorityFilter) return false
    if (searchQuery && !t.subject.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    let aVal: any = a[sortKey]
    let bVal: any = b[sortKey]
    
    if (sortKey === 'account') {
      aVal = a.account.name
      bVal = b.account.name
    }
    
    if (typeof aVal === 'string') aVal = aVal.toLowerCase()
    if (typeof bVal === 'string') bVal = bVal.toLowerCase()
    
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <span style={{ opacity: 0.3 }}>⇅</span>
    return <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>Support Tickets</h1>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>{sorted.length} / {tickets.length} tickets</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['7days', '1month', '3months'] as DateRange[]).map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: dateRange === range ? '#3b82f6' : '#334155',
                color: '#fff',
                fontWeight: '600',
                fontSize: '0.875rem'
              }}
            >
              {range === '7days' ? '7 Days' : range === '1month' ? '1 Month' : '3 Months'}
            </button>
          ))}
        </div>
      </div>

      {!loading && statusData.length > 0 && (
        <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', border: '1px solid #475569', borderRadius: '12px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '1rem', fontSize: '1.125rem' }}>📈 Ticket Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity={1} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="status" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '2px solid #3b82f6', borderRadius: '8px' }} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', border: '1px solid #475569', borderRadius: '12px', padding: '2rem', marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Search tickets by subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem' }}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px', padding: '0.5rem' }}
          >
            <option value="all">All Status</option>
            <option value="Open">Open</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px', padding: '0.5rem' }}
          >
            <option value="all">All Priority</option>
            <option value="1">Low</option>
            <option value="2">Medium</option>
            <option value="3">High</option>
            <option value="4">Urgent</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', paddingTop: '3rem', color: '#94a3b8' }}>Loading tickets...</div>
      ) : (
        <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', border: '1px solid #475569', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
          <table style={{ width: '100%' }}>
            <thead style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #334155' }}>
              <tr>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', cursor: 'pointer' }} onClick={() => handleSort('id')}>
                  ID <SortIcon column="id" />
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', cursor: 'pointer' }} onClick={() => handleSort('subject')}>
                  Subject <SortIcon column="subject" />
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', cursor: 'pointer' }} onClick={() => handleSort('account')}>
                  Account <SortIcon column="account" />
                </th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', cursor: 'pointer' }} onClick={() => handleSort('status')}>
                  Status <SortIcon column="status" />
                </th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', cursor: 'pointer' }} onClick={() => handleSort('priority')}>
                  Priority <SortIcon column="priority" />
                </th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', cursor: 'pointer' }} onClick={() => handleSort('createdAt')}>
                  Created <SortIcon column="createdAt" />
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((ticket) => (
                <tr key={ticket.id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', fontFamily: 'monospace', color: '#60a5fa' }}>{ticket.id}</td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#e2e8f0' }}>{ticket.subject.substring(0, 50)}</td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#94a3b8' }}>{ticket.account.name}</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600', backgroundColor: ticket.status === 'Open' ? '#1e40af' : ticket.status === 'Resolved' ? '#064e3b' : ticket.status === 'Pending' ? '#78350f' : '#374151', color: ticket.status === 'Open' ? '#93c5fd' : ticket.status === 'Resolved' ? '#6ee7b7' : ticket.status === 'Pending' ? '#fcd34d' : '#d1d5db' }}>
                      {ticket.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600', backgroundColor: ticket.priority === 4 ? '#7f1d1d' : ticket.priority === 3 ? '#92400e' : ticket.priority === 2 ? '#713f12' : '#0f766e', color: ticket.priority === 4 ? '#fca5a5' : ticket.priority === 3 ? '#fcd34d' : ticket.priority === 2 ? '#fbbf24' : '#67e8f9' }}>
                      {priorityMap[ticket.priority]}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', color: '#94a3b8' }}>
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sorted.length === 0 && (
            <div style={{ textAlign: 'center', paddingTop: '2rem', paddingBottom: '2rem', color: '#94a3b8' }}>No tickets found</div>
          )}
        </div>
      )}
    </div>
  )
}
