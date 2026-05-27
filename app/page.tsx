'use client'

import { useState, useEffect } from 'react'
import TicketIntelligence from '@/components/TicketIntelligence'
import SentimentPanel from '@/components/SentimentPanel'
import ActionCenter from '@/components/ActionCenter'
import AIInsights from '@/components/AIInsights'
import { calculateRiskScore } from '@/lib/riskCalculator'

interface Account {
  name: string
  company: string
  healthScore: number
  riskLevel: 'green' | 'yellow' | 'red'
  escalationProbability: number
  email: string
}

export default function Home() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const response = await fetch('/api/accounts')
        const data = await response.json()
        setAccounts(data.accounts || [])
      } catch (error) {
        console.error('Error loading accounts:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAccounts()
  }, [])

  const healthyCount = accounts.filter((a) => a.riskLevel === 'green').length
  const atRiskCount = accounts.filter((a) => a.riskLevel === 'red').length
  const avgScore = accounts.length > 0 
    ? Math.round(accounts.reduce((sum, a) => sum + a.healthScore, 0) / accounts.length)
    : 0

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'red': return { bg: '#fee2e2', text: '#991b1b', border: '#dc2626' }
      case 'yellow': return { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' }
      case 'green': return { bg: '#dcfce7', text: '#15803d', border: '#22c55e' }
      default: return { bg: '#f3f4f6', text: '#374151', border: '#9ca3af' }
    }
  }

  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>📊 CS Risk Intelligence Dashboard</h1>
        <p style={{ fontSize: '16px', color: '#6b7280' }}>Real-time risk intelligence powered by AI (Data from Google Sheets)</p>
      </div>

      {loading ? (
        <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px' }}>📥 Loading accounts from Google Sheets...</p>
      ) : (
        <>
          {/* Health Overview Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            {[
              { label: 'Total Accounts', value: accounts.length, color: '#3b82f6' },
              { label: 'Healthy Accounts', value: healthyCount, color: '#22c55e' },
              { label: 'At-Risk Accounts', value: atRiskCount, color: '#ef4444' },
              { label: 'Avg Health Score', value: avgScore + '%', color: '#a855f7' },
            ].map((card, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'white',
                  padding: '24px',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  borderLeft: `4px solid ${card.color}`,
                }}
              >
                <p style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500', marginBottom: '8px' }}>{card.label}</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>{card.value}</p>
              </div>
            ))}
          </div>

          {/* Risk Radar Table */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '24px',
              marginBottom: '32px',
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>🎯 Risk Radar</h2>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#111827' }}>Account</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#111827' }}>Risk Level</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#111827' }}>Health Score</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#111827' }}>Escalation %</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#111827' }}>Email</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => {
                  const colors = getRiskColor(account.riskLevel)
                  return (
                    <tr key={account.name} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px', color: '#111827', fontWeight: '500' }}>{account.name}</td>
                      <td style={{ padding: '12px' }}>
                        <span
                          style={{
                            padding: '6px 12px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            backgroundColor: colors.bg,
                            color: colors.text,
                          }}
                        >
                          {account.riskLevel.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: '#111827', fontWeight: '600' }}>{account.healthScore}%</td>
                      <td style={{ padding: '12px', color: '#dc2626', fontWeight: '600' }}>{Math.round(account.escalationProbability * 100)}%</td>
                      <td style={{ padding: '12px', color: '#2563eb', fontSize: '12px' }}>{account.email}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* AI Insights */}
          <AIInsights />

          {/* Ticket Intelligence */}
          <TicketIntelligence />

          {/* Sentiment Panel */}
          <SentimentPanel />

          {/* Action Center */}
          <ActionCenter />
        </>
      )}
    </div>
  )
}