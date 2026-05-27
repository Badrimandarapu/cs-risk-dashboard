'use client'

import { mockTickets } from '@/lib/mockData'

export default function TicketIntelligence() {
  const criticalTickets = mockTickets.filter((t) => t.priority === 'critical')
  const openTickets = mockTickets.filter((t) => t.status === 'open')

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
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>🎟️ Ticket Intelligence</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ padding: '16px', backgroundColor: '#fef2f2', borderRadius: '6px', borderLeft: '4px solid #ef4444' }}>
          <p style={{ fontSize: '12px', color: '#7f1d1d', fontWeight: '600' }}>Critical Tickets</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#991b1b' }}>{criticalTickets.length}</p>
        </div>

        <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '6px', borderLeft: '4px solid #22c55e' }}>
          <p style={{ fontSize: '12px', color: '#15803d', fontWeight: '600' }}>Open Tickets</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#15803d' }}>{openTickets.length}</p>
        </div>

        <div style={{ padding: '16px', backgroundColor: '#fffbeb', borderRadius: '6px', borderLeft: '4px solid #f59e0b' }}>
          <p style={{ fontSize: '12px', color: '#92400e', fontWeight: '600' }}>Avg Resolution Time</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#b45309' }}>3.2 days</p>
        </div>
      </div>

      <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px', color: '#111827' }}>Recent Critical Issues:</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {criticalTickets.map((ticket) => (
          <div
            key={ticket.id}
            style={{
              padding: '12px',
              backgroundColor: '#fee2e2',
              borderLeft: '4px solid #ef4444',
              borderRadius: '4px',
            }}
          >
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#991b1b' }}>🔴 {ticket.title}</p>
            <p style={{ fontSize: '12px', color: '#7f1d1d', marginTop: '4px' }}>Status: {ticket.status} • Priority: {ticket.priority}</p>
          </div>
        ))}
      </div>
    </div>
  )
}