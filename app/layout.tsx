import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'

export const metadata: Metadata = {
  title: 'CS Risk Intelligence Dashboard',
  description: 'Customer Success Risk Intelligence Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />

          {/* Main Content */}
          <main style={{
            marginLeft: '256px',
            flex: 1,
            backgroundColor: '#f3f4f6',
            overflowY: 'auto'
          }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}