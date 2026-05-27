'use client'

export default function Sidebar() {
  return (
    <div style={{
      width: '256px',
      backgroundColor: '#1f2937',
      color: 'white',
      padding: '24px',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      overflowY: 'auto'
    }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '32px' }}>📊 CS Risk Intelligence</h1>
      
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <a href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px',
          borderRadius: '6px',
          cursor: 'pointer',
          textDecoration: 'none',
          color: 'white',
          transition: 'background 0.2s'
        }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
          📊 Overview
        </a>
        <a href="/accounts" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px',
          borderRadius: '6px',
          cursor: 'pointer',
          textDecoration: 'none',
          color: 'white',
          transition: 'background 0.2s'
        }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
          📈 Accounts
        </a>
        <a href="/risks" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px',
          borderRadius: '6px',
          cursor: 'pointer',
          textDecoration: 'none',
          color: 'white',
          transition: 'background 0.2s'
        }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
          ⚠️ Risks
        </a>
        <a href="/insights" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px',
          borderRadius: '6px',
          cursor: 'pointer',
          textDecoration: 'none',
          color: 'white',
          transition: 'background 0.2s'
        }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
          ⚡ Insights
        </a>
      </nav>
    </div>
  )
}