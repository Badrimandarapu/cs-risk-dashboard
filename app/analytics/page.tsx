'use client'
import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

type DateRange = '7days' | '1month' | '3months'

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<DateRange>('1month')

  useEffect(() => {
    fetch(`/api/analytics?range=${dateRange}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [dateRange])

  if (loading) return <div style={{ padding: '2rem', color: '#94a3b8' }}>Loading analytics...</div>
  if (!data) return <div style={{ padding: '2rem', color: '#ef4444' }}>Error loading analytics</div>

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>Freshdesk Analytics</h1>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
        {/* Status Distribution - 3D Style */}
        <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', border: '1px solid #475569', borderRadius: '12px', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '1rem', fontSize: '1.125rem' }}>📊 Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.status}>
              <defs>
                <linearGradient id="statusGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity={1} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '2px solid #3b82f6', borderRadius: '8px' }} />
              <Bar dataKey="value" fill="url(#statusGrad)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Distribution - 3D Pie */}
        <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', border: '1px solid #475569', borderRadius: '12px', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '1rem', fontSize: '1.125rem' }}>⚡ Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.priority} dataKey="value" label={{ fill: '#e2e8f0' }} cx="50%" cy="50%" outerRadius={100}>
                {data.priority.map((entry: any, i: number) => (
                  <Cell key={i} fill={['#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '2px solid #10b981', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Clients - 3D Effect */}
      <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', border: '1px solid #475569', borderRadius: '12px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
        <h3 style={{ fontWeight: '600', marginBottom: '1rem', fontSize: '1.125rem' }}>🏆 Top Clients by Tickets</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data.clients} layout="vertical" margin={{ left: 150 }}>
            <defs>
              <linearGradient id="clientGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#34d399" stopOpacity={1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" stroke="#94a3b8" />
            <YAxis dataKey="name" type="category" width={140} stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '2px solid #10b981', borderRadius: '8px' }} />
            <Bar dataKey="tickets" fill="url(#clientGrad)" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Categories */}
      {data.categories?.length > 0 && (
        <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', border: '1px solid #475569', borderRadius: '12px', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '1rem', fontSize: '1.125rem' }}>🏷️ Tickets by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.categories}>
              <defs>
                <linearGradient id="catGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity={1} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="category" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '2px solid #f59e0b', borderRadius: '8px' }} />
              <Bar dataKey="count" fill="url(#catGrad)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
