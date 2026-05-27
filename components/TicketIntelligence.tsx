'use client'

import { useState, useEffect } from 'react'

export default function TicketIntelligence() {
  const [stats, setStats] = useState({ critical: 0, open: 0, avgTime: '2.5 days' })
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const response = await fetch('/api/tickets')
        const data = await response.json()
        const allTickets = data.tickets || []

        setStats({
          critical: allTickets.length,
          open: allTickets.length,
          avgTime: '2.5 days',
        })

        setTickets(allTickets.slice(0, 3))
      } catch (error) {
        console.error('Error loading tickets:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTickets()
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
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>🎟️ Ticket Intelligence (Freshdesk)</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ padding: '16px', backgroundColor: '#fef2f2', borderRadius: '6px', borderLeft: '4px solid #ef4444' }}>
          <p style={{ fontSize: '12px', color: '#7f1d1d', fontWeight: '600' }}>Total Tickets</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#991b1b' }}>{stats.critical}</p>
        </div>

        <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '6px', borderLeft: '4px solid #22c55e' }}>
          <p style={{ fontSize: '12px', color: '#15803d', fontWeight: '600' }}>From Freshdesk</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#15803d' }}>{stats.open}</p>
        </div>

        <div style={{ padding: '16px', backgroundColor: '#fffbeb', borderRadius: '6px', borderLeft: '4px solid #f59e0b' }}>
          <p style={{ fontSize: '12px', color: '#92400e', fontWeight: '600' }}>Avg Resolution</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#b45309' }}>{stats.avgTime}</p>
        </div>
      </div>

      {loading ? (
        <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>📥 Loading Freshdesk tickets...</p>
      ) : tickets.length > 0 ? (
        <>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px', color: '#111827' }}>Recent Tickets:</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tickets.map((ticket: any, idx: number) => (
              <div
                key={idx}
                style={{
                  padding: '12px',
                  backgroundColor: '#f3f4f6',
                  borderLeft: '4px solid #3b82f6',
                  borderRadius: '4px',
                }}
              >
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>
                  #{ticket.id}
                </p>
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{ticket.subject}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>✅ No tickets</p>
      )}
    </div>
  )
}