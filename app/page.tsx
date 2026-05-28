'use client'
import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const MOCK_ACCOUNTS = [
  { id: 1, name: 'Acme Global', health: 32, risk: 'red', open: 12, critical: 5 },
  { id: 2, name: 'TechVenture', health: 58, risk: 'yellow', open: 6, critical: 2 },
  { id: 3, name: 'GlobalTrade', health: 85, risk: 'green', open: 2, critical: 0 },
  { id: 4, name: 'Fashion Retail', health: 42, risk: 'red', open: 10, critical: 4 },
  { id: 5, name: 'CloudFirst', health: 78, risk: 'green', open: 3, critical: 1 },
]

const HEALTH_DATA = [
  { month: 'Jan', value: 75 },
  { month: 'Feb', value: 70 },
  { month: 'Mar', value: 65 },
  { month: 'Apr', value: 55 },
  { month: 'May', value: 48 },
]

export default function Dashboard() {
  const avgHealth = Math.round(MOCK_ACCOUNTS.reduce((s, a) => s + a.health, 0) / MOCK_ACCOUNTS.length)
  const critical = MOCK_ACCOUNTS.filter(a => a.risk === 'red').length
  const healthy = MOCK_ACCOUNTS.filter(a => a.risk === 'green').length

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff' }}>
      <div style={{ borderBottom: '1px solid #1e293b', padding: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>CS Risk Intelligence Dashboard</h1>
        <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Enterprise customer success monitoring</p>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
        
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Total Accounts</p>
            <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#3b82f6', marginTop: '0.5rem' }}>{MOCK_ACCOUNTS.length}</p>
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
            <LineChart data={HEALTH_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Radar Table */}
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #334155', backgroundColor: '#0f172a' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Risk Radar</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155', backgroundColor: '#0f172a' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Account</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Health</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Open</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Critical</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Risk</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ACCOUNTS.map((account) => (
                <tr key={account.id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{account.name}</td>
                  <td style={{ padding: '1rem', fontWeight: '500', color: '#3b82f6' }}>{account.health}</td>
                  <td style={{ padding: '1rem' }}>{account.open}</td>
                  <td style={{ padding: '1rem', color: '#ef4444' }}>{account.critical}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: account.risk === 'red' ? '#7f1d1d' : account.risk === 'yellow' ? '#78350f' : '#064e3b',
                      color: account.risk === 'red' ? '#fca5a5' : account.risk === 'yellow' ? '#fcd34d' : '#6ee7b7'
                    }}>
                      {account.risk}
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
