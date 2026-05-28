'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3 } from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()
  
  return (
    <div style={{ width: '256px', backgroundImage: 'linear-gradient(to bottom, #0f172a, #020617)', borderRight: '1px solid #1e293b', padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '40px', height: '40px', backgroundImage: 'linear-gradient(135deg, #3b82f6, #1e40af)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart3 size={24} color="#fff" />
          </div>
          <div>
            <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#fff' }}>CS Risk</p>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Intelligence</p>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          backgroundColor: pathname === '/' ? 'rgba(37, 99, 235, 0.2)' : 'transparent',
          color: pathname === '/' ? '#60a5fa' : '#94a3b8',
          border: pathname === '/' ? '1px solid rgba(59, 130, 246, 0.3)' : 'none',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}>
          📊 Overview
        </Link>
      </nav>

      <div style={{ borderTop: '1px solid #334155', paddingTop: '1.5rem' }}>
        <div style={{ padding: '0.75rem 1rem', backgroundColor: 'rgba(51, 65, 85, 0.5)', borderRadius: '8px' }}>
          <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Status</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
            <p style={{ fontSize: '0.75rem', fontWeight: '500', color: '#10b981' }}>Live</p>
          </div>
        </div>
      </div>
    </div>
  )
}
