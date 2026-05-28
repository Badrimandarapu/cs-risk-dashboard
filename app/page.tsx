'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'

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

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('/api/dashboard', { cache: 'no-store' })
        const json = await res.json()
        setData(json)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
    const interval = setInterval(fetchDashboard, 60000)
    return () => clearInterval(interval)
  }, [])

  const accounts = data?.accounts || []
  const totalTickets = data?.totalTickets || 0

  const avgHealth = accounts.length > 0 ? Math.round(accounts.reduce((sum, a) => sum + a.healthScore, 0) / accounts.length) : 0
  const redAccounts = accounts.filter(a => a.riskLevel === 'red').length
  const yellowAccounts = accounts.filter(a => a.riskLevel === 'yellow').length
  const greenAccounts = accounts.filter(a => a.riskLevel === 'green').length
  const totalCritical = accounts.reduce((sum, a) => sum + a.criticalTickets, 0)
  const totalOpen = accounts.reduce((sum, a) => sum + a.ticketCount, 0)

  const topRiskAccounts = [...accounts].sort((a, b) => a.healthScore - b.healthScore).slice(0, 5)

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="border-b border-slate-800 bg-gradient-to-r from-slate-900/50 to-transparent p-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Real-time customer success monitoring</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-slate-400">Loading...</div>
          </div>
        ) : (
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Link href="/analytics?metric=health">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all cursor-pointer">
                  <div className="text-sm text-slate-400">Average Health</div>
                  <div className="text-4xl font-bold text-white mt-2">{avgHealth}</div>
                  <div className="text-xs text-slate-500 mt-2">{avgHealth >= 70 ? '✓ Healthy' : '⚠ Monitor'}</div>
                </div>
              </Link>

              <Link href="/analytics?metric=green">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all cursor-pointer">
                  <div className="text-sm text-slate-400">Healthy</div>
                  <div className="text-4xl font-bold text-emerald-400 mt-2">{greenAccounts}</div>
                  <div className="text-xs text-slate-500 mt-2">accounts</div>
                </div>
              </Link>

              <Link href="/analytics?metric=yellow">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-amber-500/50 transition-all cursor-pointer">
                  <div className="text-sm text-slate-400">At Risk</div>
                  <div className="text-4xl font-bold text-amber-400 mt-2">{yellowAccounts}</div>
                  <div className="text-xs text-slate-500 mt-2">need attention</div>
                </div>
              </Link>

              <Link href="/analytics?metric=red">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-red-500/50 transition-all cursor-pointer">
                  <div className="text-sm text-slate-400">Critical</div>
                  <div className="text-4xl font-bold text-red-400 mt-2">{redAccounts}</div>
                  <div className="text-xs text-slate-500 mt-2">high priority</div>
                </div>
              </Link>

              <Link href="/tickets">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-purple-500/50 transition-all cursor-pointer">
                  <div className="text-sm text-slate-400">Tickets</div>
                  <div className="text-4xl font-bold text-purple-400 mt-2">{totalOpen}</div>
                  <div className="text-xs text-slate-500 mt-2">{totalCritical} critical</div>
                </div>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-slate-800">
                  <h3 className="text-lg font-semibold text-white">Priority Accounts</h3>
                </div>

                {topRiskAccounts.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">All accounts healthy!</div>
                ) : (
                  <div className="divide-y divide-slate-800">
                    {topRiskAccounts.map((account, i) => (
                      <Link key={i} href={`/tickets?client=${encodeURIComponent(account.name)}`}>
                        <div className="p-6 hover:bg-slate-800/50 transition-colors cursor-pointer">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-white">{account.name}</h4>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              account.riskLevel === 'green' ? 'bg-emerald-500/20 text-emerald-300' :
                              account.riskLevel === 'yellow' ? 'bg-amber-500/20 text-amber-300' :
                              'bg-red-500/20 text-red-300'
                            }`}>
                              {account.riskLevel}
                            </span>
                          </div>
                          
                          <div className="w-full bg-slate-800 rounded-full h-2 mb-4">
                            <div 
                              className={`h-2 rounded-full ${
                                account.healthScore >= 70 ? 'bg-emerald-500' : 
                                account.healthScore >= 40 ? 'bg-amber-500' : 
                                'bg-red-500'
                              }`}
                              style={{ width: `${account.healthScore}%` }}
                            ></div>
                          </div>

                          <div className="flex gap-4 text-sm">
                            <div><span className="text-slate-400">Health:</span> <span className="text-white font-semibold">{account.healthScore}</span></div>
                            <div><span className="text-slate-400">Open:</span> <span className="text-blue-400 font-semibold">{account.ticketCount}</span></div>
                            <div><span className="text-slate-400">Critical:</span> <span className="text-red-400 font-semibold">{account.criticalTickets}</span></div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase mb-6">Stats</h3>
                  
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between"><span className="text-slate-400">Total Accounts</span><span className="text-white font-semibold">{accounts.length}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Escalation Risk</span><span className="text-purple-400 font-semibold">{accounts.length > 0 ? Math.round(accounts.reduce((sum, a) => sum + a.escalationPercentage, 0) / accounts.length) : 0}%</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Total Tickets</span><span className="text-orange-400 font-semibold">{totalTickets}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Critical</span><span className="text-red-400 font-semibold">{totalCritical}</span></div>
                  </div>
                </div>

                <Link href="/tickets">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 hover:from-blue-500 transition-all cursor-pointer text-white text-center">
                    <div className="font-semibold">View All Tickets →</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
