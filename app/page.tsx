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

const MOCK_DATA = {
  accounts: [
    { name: 'Landmark India', healthScore: 35, riskLevel: 'red' as const, escalationPercentage: 85, ticketCount: 12, criticalTickets: 4, totalTickets: 15 },
    { name: 'LIBAS', healthScore: 52, riskLevel: 'yellow' as const, escalationPercentage: 55, ticketCount: 8, criticalTickets: 2, totalTickets: 10 },
    { name: 'Birkenstock', healthScore: 68, riskLevel: 'yellow' as const, escalationPercentage: 35, ticketCount: 5, criticalTickets: 1, totalTickets: 7 },
    { name: 'Repro Books', healthScore: 42, riskLevel: 'red' as const, escalationPercentage: 70, ticketCount: 10, criticalTickets: 3, totalTickets: 12 },
    { name: 'GlobalBees', healthScore: 78, riskLevel: 'green' as const, escalationPercentage: 15, ticketCount: 2, criticalTickets: 0, totalTickets: 3 },
    { name: 'Puma', healthScore: 85, riskLevel: 'green' as const, escalationPercentage: 10, ticketCount: 1, criticalTickets: 0, totalTickets: 2 },
    { name: 'Meesho', healthScore: 45, riskLevel: 'red' as const, escalationPercentage: 75, ticketCount: 11, criticalTickets: 3, totalTickets: 14 },
    { name: 'Arvind Fashion', healthScore: 60, riskLevel: 'yellow' as const, escalationPercentage: 45, ticketCount: 6, criticalTickets: 1, totalTickets: 8 },
  ],
  totalTickets: 71,
}

export default function Dashboard() {
  const [data, setData] = useState(MOCK_DATA)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/dashboard', { cache: 'no-store' })
        if (res.ok) {
          const json = await res.json()
          if (json.accounts && json.accounts.length > 0) {
            setData(json)
          }
        }
      } catch (e) {
        console.log('Using mock data')
      }
    }
    fetchData()
  }, [])

  const accounts = data.accounts
  const avgHealth = Math.round(accounts.reduce((s, a) => s + a.healthScore, 0) / accounts.length)
  const green = accounts.filter(a => a.riskLevel === 'green').length
  const yellow = accounts.filter(a => a.riskLevel === 'yellow').length
  const red = accounts.filter(a => a.riskLevel === 'red').length
  const critical = accounts.reduce((s, a) => s + a.criticalTickets, 0)
  const open = accounts.reduce((s, a) => s + a.ticketCount, 0)

  const atRisk = [...accounts].sort((a, b) => a.healthScore - b.healthScore).slice(0, 8)
  const maxScore = Math.max(...accounts.map(a => a.healthScore))

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-6 flex flex-col fixed h-screen">
        <div className="mb-8">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">CS Risk</div>
          <div className="text-xs text-slate-400 mt-1">Intelligence Dashboard</div>
        </div>
        
        <nav className="space-y-2 flex-1">
          <div className="px-4 py-3 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30 text-sm font-medium cursor-pointer hover:bg-blue-600/30">📊 Overview</div>
          <div className="px-4 py-3 text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 text-sm font-medium cursor-pointer rounded-lg transition">🎫 Tickets</div>
          <div className="px-4 py-3 text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 text-sm font-medium cursor-pointer rounded-lg transition">📧 Emails</div>
          <div className="px-4 py-3 text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 text-sm font-medium cursor-pointer rounded-lg transition">📈 Analytics</div>
        </nav>

        <div className="pt-4 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            Live & Monitoring
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto ml-64">
        {/* Header */}
        <div className="border-b border-slate-800 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent p-8">
          <h1 className="text-4xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-2">Real-time customer success intelligence • {accounts.length} accounts tracked</p>
        </div>

        <div className="p-8 space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all">
              <div className="text-sm text-slate-400 font-medium">Average Health</div>
              <div className="text-5xl font-bold text-blue-400 mt-3">{avgHealth}</div>
              <div className="text-xs text-slate-500 mt-2">Score /100</div>
              <div className="w-full h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">
                <div className="h-1 bg-blue-500" style={{width: `${avgHealth}%`}}></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all">
              <div className="text-sm text-slate-400 font-medium">Healthy</div>
              <div className="text-5xl font-bold text-emerald-400 mt-3">{green}</div>
              <div className="text-xs text-slate-500 mt-2">Green accounts</div>
              <div className="w-full h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">
                <div className="h-1 bg-emerald-500" style={{width: `${(green/accounts.length)*100}%`}}></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-6 hover:border-amber-500/50 transition-all">
              <div className="text-sm text-slate-400 font-medium">At Risk</div>
              <div className="text-5xl font-bold text-amber-400 mt-3">{yellow}</div>
              <div className="text-xs text-slate-500 mt-2">Monitor closely</div>
              <div className="w-full h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">
                <div className="h-1 bg-amber-500" style={{width: `${(yellow/accounts.length)*100}%`}}></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-6 hover:border-red-500/50 transition-all">
              <div className="text-sm text-slate-400 font-medium">Critical</div>
              <div className="text-5xl font-bold text-red-400 mt-3">{red}</div>
              <div className="text-xs text-slate-500 mt-2">Immediate action</div>
              <div className="w-full h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">
                <div className="h-1 bg-red-500" style={{width: `${(red/accounts.length)*100}%`}}></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-6 hover:border-purple-500/50 transition-all">
              <div className="text-sm text-slate-400 font-medium">Open Tickets</div>
              <div className="text-5xl font-bold text-purple-400 mt-3">{open}</div>
              <div className="text-xs text-slate-500 mt-2">{critical} critical</div>
              <div className="w-full h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">
                <div className="h-1 bg-purple-500" style={{width: `${Math.min(100, (open/20)*100)}%`}}></div>
              </div>
            </div>
          </div>

          {/* Chart - Account Health Comparison */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">Account Health Overview</h2>
            <div className="h-80 flex items-end gap-2 px-4">
              {atRisk.map((a, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-xs text-slate-500 mb-1">{a.healthScore}</div>
                  <div 
                    className={`w-full rounded-t-lg transition-all hover:opacity-80 cursor-pointer ${
                      a.healthScore >= 70 ? 'bg-emerald-500' : 
                      a.healthScore >= 40 ? 'bg-amber-500' : 
                      'bg-red-500'
                    }`}
                    style={{height: `${(a.healthScore/maxScore)*300}px`}}
                  ></div>
                  <div className="text-xs text-slate-400 text-center mt-2 truncate w-full">{a.name.split(' ')[0]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Radar Table */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-8 border-b border-slate-800">
              <h2 className="text-2xl font-bold text-white">Risk Radar</h2>
              <p className="text-slate-400 mt-2">All accounts sorted by risk level</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/50">
                    <th className="px-8 py-4 text-left text-sm font-semibold text-slate-300">Account Name</th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-slate-300">Health Score</th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-slate-300">Risk Level</th>
                    <th className="px-8 py-4 text-center text-sm font-semibold text-slate-300">Open Tickets</th>
                    <th className="px-8 py-4 text-center text-sm font-semibold text-slate-300">Critical Issues</th>
                    <th className="px-8 py-4 text-center text-sm font-semibold text-slate-300">Escalation %</th>
                  </tr>
                </thead>
                <tbody>
                  {atRisk.map((a, i) => (
                    <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="px-8 py-5 font-semibold text-white">{a.name}</td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-2 ${a.healthScore >= 70 ? 'bg-emerald-500' : a.healthScore >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                              style={{width: `${a.healthScore}%`}}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-slate-300">{a.healthScore}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          a.riskLevel === 'green' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          a.riskLevel === 'yellow' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}>
                          {a.riskLevel === 'green' ? '✓ Healthy' : a.riskLevel === 'yellow' ? '⚠ Warning' : '✕ Critical'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 font-semibold text-sm">{a.ticketCount}</div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/20 text-red-300 font-semibold text-sm">{a.criticalTickets}</div>
                      </td>
                      <td className="px-8 py-5 text-center font-semibold text-purple-400">{a.escalationPercentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">🤖 AI Insights</h2>
            <div className="space-y-4">
              <div className="flex gap-4 p-6 bg-red-500/10 rounded-lg border border-red-500/30 hover:border-red-500/50 transition">
                <div className="text-2xl">🚨</div>
                <div>
                  <div className="font-semibold text-red-300">{red} Critical Accounts</div>
                  <div className="text-sm text-slate-400 mt-1">Require immediate escalation and intervention</div>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-amber-500/10 rounded-lg border border-amber-500/30 hover:border-amber-500/50 transition">
                <div className="text-2xl">⚠️</div>
                <div>
                  <div className="font-semibold text-amber-300">{yellow} Accounts at Warning Level</div>
                  <div className="text-sm text-slate-400 mt-1">Monitor closely for escalation - preventive action recommended</div>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-blue-500/10 rounded-lg border border-blue-500/30 hover:border-blue-500/50 transition">
                <div className="text-2xl">📊</div>
                <div>
                  <div className="font-semibold text-blue-300">{open} Open Tickets | {critical} Critical</div>
                  <div className="text-sm text-slate-400 mt-1">Address critical tickets within 24 hours to prevent escalation</div>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-emerald-500/10 rounded-lg border border-emerald-500/30 hover:border-emerald-500/50 transition">
                <div className="text-2xl">✓</div>
                <div>
                  <div className="font-semibold text-emerald-300">{green} Healthy Accounts</div>
                  <div className="text-sm text-slate-400 mt-1">Maintain engagement and continue regular check-ins</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}