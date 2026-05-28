'use client'

import { useState, useEffect } from 'react'

interface Account {
  name: string
  healthScore: number
  riskLevel: 'green' | 'yellow' | 'red'
  escalationPercentage: number
  ticketCount: number
  criticalTickets: number
  totalTickets: number
}

interface DashboardData {
  accounts: Account[]
  totalTickets: number
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/dashboard', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to fetch')
        const json = await res.json()
        setData(json)
      } catch (error) {
        console.error('Error:', error)
        setData({ accounts: [], totalTickets: 0 })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const accounts = data?.accounts || []
  const avgHealth = accounts.length ? Math.round(accounts.reduce((s, a) => s + a.healthScore, 0) / accounts.length) : 0
  const green = accounts.filter(a => a.riskLevel === 'green').length
  const yellow = accounts.filter(a => a.riskLevel === 'yellow').length
  const red = accounts.filter(a => a.riskLevel === 'red').length
  const critical = accounts.reduce((s, a) => s + a.criticalTickets, 0)
  const open = accounts.reduce((s, a) => s + a.ticketCount, 0)

  const atRisk = [...accounts].sort((a, b) => a.healthScore - b.healthScore).slice(0, 10)

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-6 flex flex-col">
        <div className="mb-8">
          <div className="text-xl font-bold text-white">CS Risk Intel</div>
          <div className="text-xs text-slate-400 mt-1">Intelligence Dashboard</div>
        </div>
        
        <nav className="space-y-2 flex-1">
          <div className="px-4 py-3 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30 text-sm font-medium">📊 Overview</div>
          <div className="px-4 py-3 text-slate-400 hover:text-slate-300 text-sm font-medium cursor-pointer">🎫 Tickets</div>
          <div className="px-4 py-3 text-slate-400 hover:text-slate-300 text-sm font-medium cursor-pointer">📧 Emails</div>
          <div className="px-4 py-3 text-slate-400 hover:text-slate-300 text-sm font-medium cursor-pointer">📈 Analytics</div>
        </nav>

        <div className="pt-4 border-t border-slate-800 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live System
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="border-b border-slate-800 bg-gradient-to-r from-slate-900/80 to-transparent p-8">
          <h1 className="text-4xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-2">Real-time customer success intelligence</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-slate-400">Loading...</div>
          </div>
        ) : (
          <div className="p-8 space-y-8">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-blue-500/50 transition">
                <div className="text-sm text-slate-400">Avg Health</div>
                <div className="text-4xl font-bold text-blue-400 mt-2">{avgHealth}</div>
                <div className="text-xs text-slate-500 mt-2">/100</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-emerald-500/50 transition">
                <div className="text-sm text-slate-400">Healthy</div>
                <div className="text-4xl font-bold text-emerald-400 mt-2">{green}</div>
                <div className="text-xs text-slate-500 mt-2">accounts</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-amber-500/50 transition">
                <div className="text-sm text-slate-400">At Risk</div>
                <div className="text-4xl font-bold text-amber-400 mt-2">{yellow}</div>
                <div className="text-xs text-slate-500 mt-2">monitor</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-red-500/50 transition">
                <div className="text-sm text-slate-400">Critical</div>
                <div className="text-4xl font-bold text-red-400 mt-2">{red}</div>
                <div className="text-xs text-slate-500 mt-2">immediate</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-purple-500/50 transition">
                <div className="text-sm text-slate-400">Open Tickets</div>
                <div className="text-4xl font-bold text-purple-400 mt-2">{open}</div>
                <div className="text-xs text-slate-500 mt-2">{critical} critical</div>
              </div>
            </div>

            {/* Risk Radar */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <div className="p-6 border-b border-slate-800">
                <h2 className="text-xl font-bold text-white">Risk Radar</h2>
                <p className="text-sm text-slate-400 mt-1">Accounts requiring attention</p>
              </div>

              {atRisk.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  ✓ All accounts healthy
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-800/50">
                        <th className="px-6 py-3 text-left text-sm font-semibold">Account</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Health</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Risk</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Tickets</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Critical</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Escalation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {atRisk.map((a, i) => (
                        <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition">
                          <td className="px-6 py-4 font-medium">{a.name}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-slate-800 rounded overflow-hidden">
                                <div className={`h-2 ${a.healthScore >= 70 ? 'bg-emerald-500' : a.healthScore >= 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{width: `${a.healthScore}%`}}></div>
                              </div>
                              <span className="text-sm">{a.healthScore}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${a.riskLevel === 'green' ? 'bg-emerald-500/20 text-emerald-300' : a.riskLevel === 'yellow' ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'}`}>
                              {a.riskLevel}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center text-blue-400 font-semibold">{a.ticketCount}</td>
                          <td className="px-6 py-4 text-center text-red-400 font-semibold">{a.criticalTickets}</td>
                          <td className="px-6 py-4 text-center text-purple-400 font-semibold">{a.escalationPercentage}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* AI Insights */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">AI Insights</h2>
              <div className="space-y-3">
                <div className="flex gap-3 p-4 bg-slate-800/50 rounded border-l-2 border-amber-500">
                  <div className="text-lg">⚠️</div>
                  <div>
                    <div className="text-sm font-medium text-white">{red} accounts in critical state</div>
                    <div className="text-xs text-slate-400 mt-1">Immediate escalation recommended</div>
                  </div>
                </div>
                <div className="flex gap-3 p-4 bg-slate-800/50 rounded border-l-2 border-blue-500">
                  <div className="text-lg">📊</div>
                  <div>
                    <div className="text-sm font-medium text-white">{open} open tickets detected</div>
                    <div className="text-xs text-slate-400 mt-1">{critical} critical issues need resolution</div>
                  </div>
                </div>
                <div className="flex gap-3 p-4 bg-slate-800/50 rounded border-l-2 border-emerald-500">
                  <div className="text-lg">✓</div>
                  <div>
                    <div className="text-sm font-medium text-white">{green} healthy accounts</div>
                    <div className="text-xs text-slate-400 mt-1">Continue monitoring for changes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}