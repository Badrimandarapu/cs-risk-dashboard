import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CS Risk Intelligence Dashboard",
  description: "Enterprise customer success intelligence",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>CS Risk Intelligence Dashboard</title>
        <meta name="description" content="Enterprise customer success intelligence" />
      </head>
      <body className={inter.className} style={{ margin: 0, padding: 0, display: 'flex', minHeight: '100vh' }}>
        <nav style={{ width: '240px', backgroundColor: '#0f172a', borderRight: '1px solid #1e293b', padding: '1.5rem 1rem', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ color: '#fff', fontSize: '1.125rem', fontWeight: 'bold', margin: 0 }}>CS Risk</h1>
            <p style={{ color: '#64748b', fontSize: '0.75rem', margin: '0.25rem 0 0 0' }}>Intelligence</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', color: '#94a3b8', textDecoration: 'none', borderRadius: '8px', backgroundColor: 'transparent', transition: 'all 0.2s', fontSize: '0.875rem', fontWeight: '500' }}>
              <span>📊</span> Overview
            </a>
            <a href="/accounts" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', color: '#94a3b8', textDecoration: 'none', borderRadius: '8px', backgroundColor: 'transparent', transition: 'all 0.2s', fontSize: '0.875rem', fontWeight: '500' }}>
              <span>👥</span> Accounts
            </a>
            <a href="/tickets" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', color: '#94a3b8', textDecoration: 'none', borderRadius: '8px', backgroundColor: 'transparent', transition: 'all 0.2s', fontSize: '0.875rem', fontWeight: '500' }}>
              <span>🎫</span> Tickets
            </a>
            <a href="/analytics" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', color: '#94a3b8', textDecoration: 'none', borderRadius: '8px', backgroundColor: 'transparent', transition: 'all 0.2s', fontSize: '0.875rem', fontWeight: '500' }}>
              <span>📈</span> Analytics
            </a>
          </div>
        </nav>
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
