'use client'

import { useState, useEffect } from 'react'

interface Ticket {
  id: number
  subject: string
  priority: number
  status: number
}

export default function TicketIntelligence() {
  const [stats, setStats] = useState({ critical: 0, open: 0, avgTime: '2.5 days' })
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const response = await fetch('/api/tickets')
        const data = await response.json()
        const allTickets = data.tickets || []

        const critical = allTickets.filter((t: Ticket) => t.priority === 4).length
        const open = allTickets.filter((t: Ticket) => t.status === 2).length

        setStats({
          critical,
          open,
          avgTime: '2.5 days',
        })

        // Get top critical tickets
        const topCritical = allTickets
          .filter((t: Ticket) => t.priority === 4)
          .slice(0, 3)
        setTickets(topCritical)
      } catch (error) {
        console.error('Error loading tickets:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTickets()
  }, [])

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 4: return { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' }
      case 3: return { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' }
      case 2: return { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' }
      default: return { bg: '#f0fdf4', border: '#22c55e', text: '#15803d' }
    }
  }

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 4: return '🔴 URGENT'
      case 3: return '🟡 HIGH'
      case 2: return '🔵 MEDIUM'
      default: return '🟢 LOW'
    }
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
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>🎟️ Ticket Intelligence (Freshdesk)</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ padding: '16px', backgroundColor: '#fef2f2', borderRadius: '6px', borderLeft: '4px solid #ef4444' }}>
          <p style={{ fontSize: '12px', color: '#7f1d1d', fontWeight: '600' }}>Critical Tickets</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#991b1b' }}>{stats.critical}</p>
        </div>

        <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '6px', borderLeft: '4px solid #22c55e' }}>
          <p style={{ fontSize: '12px', color: '#15803d', fontWeight: '600' }}>Open Tickets</p>
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
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px', color: '#111827' }}>Critical Issues from Freshdesk:</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tickets.map((ticket) => {
              const colors = getPriorityColor(ticket.priority)
              return (
                <div
                  key={ticket.id}
                  style={{
                    padding: '12px',
                    backgroundColor: colors.bg,
                    borderLeft: `4px solid ${colors.border}`,
                    borderRadius: '4px',
                  }}
                >
                  <p style={{ fontSize: '13px', fontWeight: '600', color: colors.text }}>
                    {getPriorityLabel(ticket.priority)} #{ticket.id}
                  </p>
                  <p style={{ fontSize: '12px', color: colors.text, marginTop: '4px' }}>{ticket.subject}</p>
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>✅ No critical tickets</p>
      )}
    </div>
  )
}