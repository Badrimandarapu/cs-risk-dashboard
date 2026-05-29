'use client'
import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ padding: '2rem', color: '#94a3b8' }}>Loading analytics...</div>
  if (!data) return <div style={{ padding: '2rem', color: '#ef4444' }}>Error loading analytics</div>

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff', padding: '2rem' }}>
      <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '2rem' }}>Freshdesk Analytics</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
        {/* Status Distribution */}
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '2rem' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.status}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Distribution */}
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '2rem' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.priority} dataKey="value" label>
                {data.priority.map((entry: any, i: number) => (
                  <Cell key={i} fill={['#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Clients */}
      <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Top Clients by Tickets</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.clients} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" stroke="#94a3b8" />
            <YAxis dataKey="name" type="category" width={150} stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
            <Bar dataKey="tickets" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Categories */}
      {data.categories?.length > 0 && (
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '2rem' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Tickets by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.categories}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="category" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
              <Bar dataKey="count" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
