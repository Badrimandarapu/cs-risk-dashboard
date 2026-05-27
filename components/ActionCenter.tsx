'use client'

import { useState, useEffect } from 'react'
import { calculateRiskScore } from '@/lib/riskCalculator'
import { mockAccounts, mockTickets } from '@/lib/mockData'

export default function ActionCenter() {
  const [actions, setActions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadActions = async () => {
      try {
        const riskAccount = mockAccounts[0]
        const accountTickets = mockTickets.filter((t) => t.accountId === riskAccount.id)
        const riskScore = calculateRiskScore(riskAccount, accountTickets)

        const response = await fetch('/api/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ account: riskAccount, riskScore }),
        })

        const data = await response.json()
        setActions(data.actions || ['TODAY: Schedule account review call'])
      } catch (error) {
        console.error('Error loading actions:', error)
        setActions(['TODAY: Schedule account review call'])
      } finally {
        setLoading(false)
      }
    }

    loadActions()
  }, [])

  const getUrgencyColor = (action: string) => {
    if (action.includes('IMMEDIATE')) return { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' }
    if (action.includes('TODAY')) return { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' }
    return { bg: '#f0fdf4', border: '#22c55e', text: '#15803d' }
  }

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
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>💡 Action Center</h2>

      {loading ? (
        <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>⏳ Generating AI recommendations...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {actions.map((action, idx) => {
            const colors = getUrgencyColor(action)
            return (
              <div
                key={idx}
                style={{
                  padding: '16px',
                  backgroundColor: colors.bg,
                  borderLeft: `4px solid ${colors.border}`,
                  borderRadius: '6px',
                }}
              >
                <p style={{ fontSize: '14px', fontWeight: '600', color: colors.text }}>{action}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}