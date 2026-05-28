'use client'

import Sidebar from '@/components/Sidebar'

export default function AnalyticsPage() {
  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="border-b border-slate-800 bg-gradient-to-r from-slate-900/50 to-transparent p-8">
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-slate-400 mt-1">Trends, reports, and insights</p>
        </div>
        <div className="p-8">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
            <p>📈 Analytics page coming soon...</p>
            <p className="text-sm mt-2">View detailed analytics and trends</p>
          </div>
        </div>
      </main>
    </div>
  )
}
