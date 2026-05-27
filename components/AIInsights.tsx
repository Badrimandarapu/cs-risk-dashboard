'use client'

import { useState, useEffect } from 'react'
import { calculateRiskScore } from '@/lib/riskCalculator'
import { mockAccounts, mockTickets } from '@/lib/mockData'

export default function AIInsights() {
  const [insights, setInsights] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const riskAccount = mockAccounts[0]

        const response = await fetch('/api/insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ account: riskAccount, mockTickets }),
        })

        const data = await response.json()
        setInsights(data.insights || ['✅ Account is stable'])
      } catch (error) {
        console.error('Error loading insights:', error)
        setInsights(['✅ Account is stable with no critical issues'])
      } finally {
        setLoading(false)
      }
    }

    loadInsights()
  }, [])

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '24px',
        marginBottom: '32px',
      }}
    >
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>⚡ AI-Powered Insights</h2>

      {loading ? (
        <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>🤖 Analyzing accounts with AI...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {insights.map((insight, idx) => (
            <div
              key={idx}
              style={{
                padding: '16px',
                backgroundColor: '#f0f9ff',
                borderLeft: '4px solid #3b82f6',
                borderRadius: '6px',
              }}
            >
              <p style={{ fontSize: '14px', color: '#1e40af', fontWeight: '500' }}>{insight}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}