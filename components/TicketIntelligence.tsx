'use client'

import { useState, useEffect } from 'react'

interface DashboardData {
  accounts: any[]
  totalTickets: number
  freshDeskConnected: boolean
}

export default function TicketIntelligence() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/dashboard-data')
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return <p style={{ color: '#6b7280', padding: '20px' }}>📥 Loading Freshdesk data...</p>
  }

  const criticalAccounts = data?.accounts?.filter((a: any) => a.criticalTickets > 0) || []

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '32px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>🎟️ Ticket Intelligence (Freshdesk)</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ padding: '16px', backgroundColor: '#fee2e2', borderRadius: '6px', borderLeft: '4px solid #ef4444' }}>
          <p style={{ fontSize: '12px', color: '#7f1d1d', fontWeight: '600' }}>Total Tickets</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#991b1b' }}>{data?.totalTickets || 0}</p>
        </div>

        <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '6px', borderLeft: '4px solid #22c55e' }}>
          <p style={{ fontSize: '12px', color: '#15803d', fontWeight: '600' }}>Freshdesk Connected</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#15803d' }}>{data?.freshDeskConnected ? '✅' : '❌'}</p>
        </div>

        <div style={{ padding: '16px', backgroundColor: '#fffbeb', borderRadius: '6px', borderLeft: '4px solid #f59e0b' }}>
          <p style={{ fontSize: '12px', color: '#92400e', fontWeight: '600' }}>At-Risk Accounts</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#b45309' }}>{criticalAccounts.length}</p>
        </div>
      </div>

      {criticalAccounts.length > 0 && (
        <>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px', color: '#111827' }}>Accounts with Critical Tickets:</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {criticalAccounts.map((account: any, idx: number) => (
              <div key={idx} style={{ padding: '12px', backgroundColor: '#fee2e2', borderLeft: '4px solid #ef4444', borderRadius: '4px' }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#991b1b' }}>
                  🔴 {account.accountName} - {account.criticalTickets} critical tickets
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}