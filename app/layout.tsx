import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CS Risk Intelligence Dashboard",
  description: "Real-time Customer Success intelligence",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          {/* Sidebar */}
          <nav style={{ width: '240px', backgroundColor: '#0f172a', borderRight: '1px solid #1e293b', padding: '2rem 1rem', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 'bold' }}>CS Risk</h1>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.25rem' }}>Intelligence</p>
            </div>

            <div style={{ space: '1rem' }}>
              <NavLink href="/" label="Overview" icon="📊" />
              <NavLink href="/accounts" label="Accounts" icon="👥" />
              <NavLink href="/tickets" label="Tickets" icon="🎫" />
              <NavLink href="/analytics" label="Analytics" icon="📈" />
              <NavLink href="/escalations" label="Escalations" icon="⚡" />
              <NavLink href="/insights" label="Insights" icon="🤖" />
              <NavLink href="/reports" label="Reports" icon="📁" />
            </div>

            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #1e293b' }}>
              <div style={{ backgroundColor: '#1e293b', borderRadius: '0.5rem', padding: '1rem' }}>
                <p style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.5rem' }}>Status</p>
                <p style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: '600' }}>● Live</p>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main style={{ flex: 1 }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

function NavLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        color: '#94a3b8',
        textDecoration: 'none',
        borderRadius: '0.5rem',
        marginBottom: '0.5rem',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#1e293b'
        e.currentTarget.style.color = '#fff'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent'
        e.currentTarget.style.color = '#94a3b8'
      }}
    >
      <span style={{ fontSize: '1.25rem' }}>{icon}</span>
      <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{label}</span>
    </a>
  )
}
