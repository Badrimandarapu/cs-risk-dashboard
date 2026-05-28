'use client'

import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts'
import { TrendingUp, AlertCircle, Users, Zap, ArrowRight } from 'lucide-react'

const ACCOUNTS = [
  { id: '001', name: 'Acme Global', industry: 'E-Commerce', healthScore: 32, risk: 'critical', escalationProb: 89, sentiment: -45, criticalTickets: 5, mrr: 45000 },
  { id: '002', name: 'TechVenture', industry: 'SaaS', healthScore: 58, risk: 'warning', escalationProb: 42, sentiment: 15, criticalTickets: 2, mrr: 18000 },
  { id: '003', name: 'GlobalTrade', industry: 'Logistics', healthScore: 85, risk: 'healthy', escalationProb: 12, sentiment: 72, criticalTickets: 0, mrr: 78000 },
  { id: '004', name: 'Fashion Retail', industry: 'Retail', healthScore: 42, risk: 'critical', escalationProb: 76, sentiment: -28, criticalTickets: 4, mrr: 32000 },
  { id: '005', name: 'CloudFirst', industry: 'Data', healthScore: 78, risk: 'healthy', escalationProb: 18, sentiment: 54, criticalTickets: 1, mrr: 22000 },
]

const HEALTH_TREND = [
  { month: 'Jan', acme: 85, fashion: 78, tech: 68, global: 82 },
  { month: 'Feb', acme: 78, fashion: 75, tech: 72, global: 84 },
  { month: 'Mar', acme: 68, fashion: 68, tech: 65, global: 85 },
  { month: 'Apr', acme: 55, fashion: 58, tech: 58, global: 84 },
  { month: 'May', acme: 42, fashion: 42, tech: 58, global: 85 },
]

const ESCALATION = [
  { week: 'W1', risk: 28 },
  { week: 'W2', risk: 32 },
  { week: 'W3', risk: 38 },
  { week: 'W4', risk: 42 },
  { week: 'W5', risk: 47 },
]

export default function Dashboard() {
  const totalARR = ACCOUNTS.reduce((sum, a) => sum + a.mrr, 0)
  const healthy = ACCOUNTS.filter(a => a.risk === 'healthy').length
  const atRisk = ACCOUNTS.filter(a => a.risk !== 'healthy').length
  const avgEsc = Math.round(ACCOUNTS.reduce((sum, a) => sum + a.escalationProb, 0) / ACCOUNTS.length)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #1e293b', padding: '2rem', backgroundImage: 'linear-gradient(to right, #0f172a, #0f172a)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#fff' }}>CS Risk Intelligence</h1>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Executive visibility into account health and escalation risk</p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem', color: '#fff' }}>
        
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: '500' }}>Total ARR</p>
            <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#3b82f6', marginTop: '0.5rem' }}>${(totalARR / 1000000).toFixed(2)}M</p>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>{ACCOUNTS.length} accounts</p>
          </div>

          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: '500' }}>Healthy</p>
            <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#10b981', marginTop: '0.5rem' }}>{healthy}</p>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>No action needed</p>
          </div>

          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: '500' }}>At Risk</p>
            <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#ef4444', marginTop: '0.5rem' }}>{atRisk}</p>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>Require attention</p>
          </div>

          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: '500' }}>Avg Escalation</p>
            <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#f59e0b', marginTop: '0.5rem' }}>{avgEsc}%</p>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>Churn risk</p>
          </div>
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem' }}>
            <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Account Health Trajectory</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={HEALTH_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                <Legend />
                <Line type="monotone" dataKey="acme" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="fashion" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="global" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem' }}>
            <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Escalation Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ESCALATION}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="week" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Radar Table */}
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #334155', backgroundColor: '#0f172a' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Risk Radar</h3>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.25rem' }}>Account health and escalation probability</p>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155', backgroundColor: '#0f172a' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#fff' }}>Account</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#fff' }}>Risk</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#fff' }}>Escalation</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#fff' }}>Sentiment</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#fff' }}>Critical</th>
                </tr>
              </thead>
              <tbody>
                {ACCOUNTS.map((account) => (
                  <tr key={account.id} style={{ borderBottom: '1px solid #334155' }}>
                    <td style={{ padding: '1rem' }}>
                      <p style={{ fontWeight: '600' }}>{account.name}</p>
                      <p style={{ fontSize: '0.75rem', color: '#64748b' }}>${(account.mrr / 1000).toFixed(0)}K MRR</p>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        backgroundColor: account.risk === 'critical' ? '#7f1d1d' : account.risk === 'warning' ? '#78350f' : '#064e3b',
                        color: account.risk === 'critical' ? '#fca5a5' : account.risk === 'warning' ? '#fcd34d' : '#6ee7b7'
                      }}>
                        {account.risk === 'critical' ? '🔴' : account.risk === 'warning' ? '🟡' : '🟢'} {account.risk}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '120px' }}>
                        <div style={{ flex: 1, height: '8px', backgroundColor: '#334155', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: `${account.escalationProb}%`,
                            backgroundColor: account.escalationProb > 70 ? '#ef4444' : account.escalationProb > 40 ? '#f59e0b' : '#10b981'
                          }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>{account.escalationProb}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '600', color: account.sentiment > 40 ? '#10b981' : account.sentiment > -20 ? '#94a3b8' : '#ef4444' }}>
                      {account.sentiment > 0 ? '+' : ''}{account.sentiment}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '600' }}>{account.criticalTickets}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
