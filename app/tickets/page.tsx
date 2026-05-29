'use client'
import { useState, useEffect } from 'react'

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
const statusMap: Record<number, string> = { 2: 'Open', 3: 'Pending', 4: 'Resolved', 5: 'Closed' }

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetch('/api/tickets')
      .then(r => r.json())
      .then(d => { setTickets(d.tickets || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = tickets.filter(t => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false
    if (priorityFilter !== 'all' && t.priority.toString() !== priorityFilter) return false
    if (searchQuery && !t.subject.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-white">Support Tickets</h1>
          <p className="text-slate-400 mt-1">{filtered.length} tickets</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 space-y-4">
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 placeholder-slate-500"
          />
          <div className="grid grid-cols-2 gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2"
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
              className="bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2"
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
          <div className="text-center py-12 text-slate-400">Loading tickets...</div>
        ) : (
          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-900 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Subject</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Account</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Priority</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Created</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                    <td className="px-6 py-4 text-sm text-white">{ticket.subject.substring(0, 50)}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{ticket.account.name}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        ticket.status === 'Open' ? 'bg-blue-500/20 text-blue-400' :
                        ticket.status === 'Resolved' ? 'bg-green-500/20 text-green-400' :
                        ticket.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        ticket.priority === 4 ? 'bg-red-500/20 text-red-400' :
                        ticket.priority === 3 ? 'bg-orange-500/20 text-orange-400' :
                        ticket.priority === 2 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {priorityMap[ticket.priority]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-slate-400">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-400">No tickets found</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
