'use client'
import { useState, useEffect } from 'react'
import {
  BarChart, Bar, PieChart, Pie,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

interface AnalyticsData {
  kpis: any
  status: any[]
  priority: any[]
  clients: any[]
  categories: any[]
}

const KPICard = ({ title, value, icon, color }: any) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 hover:shadow-xl transition-all">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-white mt-2">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
    </div>
  </div>
)

export default function FreshdeskAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-white">Loading Freshdesk Analytics...</div>
    </div>
  )

  if (!data) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-white">Error loading analytics</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-white">Freshdesk Analytics</h1>
          <p className="text-slate-400 mt-1">Support tickets visualization & insights</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6">Key Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard title="Total Tickets" value={data.kpis.totalTickets} icon="🎫" color="bg-blue-500/20" />
            <KPICard title="Open" value={data.kpis.openTickets} icon="📂" color="bg-orange-500/20" />
            <KPICard title="Resolved" value={data.kpis.resolvedTickets} icon="✅" color="bg-green-500/20" />
            <KPICard title="Escalated" value={data.kpis.escalatedTickets} icon="⚠️" color="bg-red-500/20" />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-6">Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.status}>
                <CartesianGrid stroke="#334155" />
                <XAxis dataKey="status" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {data.status.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-6">Priority Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={data.priority} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
                  {data.priority.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 mb-12">
          <h3 className="text-lg font-bold text-white mb-6">Top Clients by Ticket Volume</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data.clients} layout="vertical">
              <CartesianGrid stroke="#334155" />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" width={150} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b' }} />
              <Bar dataKey="tickets" fill="#3b82f6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-6">Tickets by Category</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data.categories}>
              <CartesianGrid stroke="#334155" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b' }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {data.categories.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
