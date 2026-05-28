'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Account {
  name: string
  company: string
  email: string
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
  success: boolean
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
        console.error('Failed to fetch:', error)
        setData({ accounts: [], totalTickets: 0, success: false })
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

  const riskDistribution = [
    { name: 'Green', value: greenAccounts, fill: '#10b981' },
    { name: 'Yellow', value: yellowAccounts, fill: '#f59e0b' },
    { name: 'Red', value: redAccounts, fill: '#ef4444' },
  ]

  const topAccounts = [...accounts].sort((a, b) => b.totalTickets - a.totalTickets).slice(0, 8)

  const healthDistribution = topAccounts.map(a => ({
    name: a.name.substring(0, 15),
    health: a.healthScore,
    tickets: a.totalTickets,
  }))

  const severityData = [
    { name: 'Open', value: totalOpen, fill: '#3b82f6' },
    { name: 'Critical', value: totalCritical, fill: '#dc2626' },
  ]

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-800 backdrop-blur-sm border-b border-blue-700/50 p-8">
          <h1 className="text-4xl font-bold text-white">CS Risk Intelligence</h1>
          <p className="text-blue-100 mt-2">Real-time customer success monitoring</p>
        </div>

        <div className="p-8 space-y-8">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-white text-lg">Loading...</div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg text-white">
                  <div className="text-sm font-medium opacity-90">Avg Health</div>
                  <div className="text-4xl font-bold mt-2">{avgHealth}</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 shadow-lg text-white">
                  <div className="text-sm font-medium opacity-90">Healthy</div>
                  <div className="text-4xl font-bold mt-2">{greenAccounts}</div>
                </div>
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 shadow-lg text-white">
                  <div className="text-sm font-medium opacity-90">At Risk</div>
                  <div className="text-4xl font-bold mt-2">{yellowAccounts}</div>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 shadow-lg text-white">
                  <div className="text-sm font-medium opacity-90">Critical</div>
                  <div className="text-4xl font-bold mt-2">{redAccounts}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 shadow-lg text-white">
                  <div className="text-sm font-medium opacity-90">Tickets</div>
                  <div className="text-4xl font-bold mt-2">{totalOpen}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-slate-700 backdrop-blur rounded-xl p-6 border border-slate-600/50 shadow-lg">
                  <h3 className="text-lg font-semibold text-white mb-4">Risk Distribution</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                        {riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-slate-700 backdrop-blur rounded-xl p-6 border border-slate-600/50 shadow-lg">
                  <h3 className="text-lg font-semibold text-white mb-4">Ticket Severity</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={severityData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                        {severityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-slate-700 backdrop-blur rounded-xl p-6 border border-slate-600/50 shadow-lg">
                  <h3 className="text-lg font-semibold text-white mb-6">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Total Accounts</span>
                      <span className="text-2xl font-bold text-blue-400">{accounts.length}</span>
                    </div>
                    <div className="w-full bg-slate-600 rounded h-1"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Avg Escalation</span>
                      <span className="text-2xl font-bold text-purple-400">{accounts.length > 0 ? Math.round(accounts.reduce((sum, a) => sum + a.escalationPercentage, 0) / accounts.length) : 0}%</span>
                    </div>
                    <div className="w-full bg-slate-600 rounded h-1"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Critical Tickets</span>
                      <span className="text-2xl font-bold text-orange-400">{totalCritical}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-700 backdrop-blur rounded-xl p-6 border border-slate-600/50 shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Health & Ticket Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={healthDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                    <Bar dataKey="health" fill="#3b82f6" name="Health Score" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="tickets" fill="#ef4444" name="Tickets" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-slate-700 backdrop-blur rounded-xl border border-slate-600/50 shadow-lg overflow-hidden">
                <div className="p-6 border-b border-slate-600">
                  <h3 className="text-lg font-semibold text-white">All Accounts</h3>
                </div>

                {accounts.length === 0 ? (
                  <div className="p-12 text-center text-slate-400">No accounts found</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-600 bg-slate-800/50">
                          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Client</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Health</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Risk</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Open</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Critical</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Escalation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {accounts.map((account, i) => (
                          <tr key={i} className="border-b border-slate-600/30 hover:bg-slate-600/20">
                            <td className="px-6 py-4 text-sm font-medium text-white">{account.name}</td>
                            <td className="px-6 py-4 text-sm">
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-slate-600 rounded h-2">
                                  <div className={`h-2 rounded ${account.healthScore >= 70 ? 'bg-emerald-500' : account.healthScore >= 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${account.healthScore}%` }}></div>
                                </div>
                                <span className="text-slate-300">{account.healthScore}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                account.riskLevel === 'green' ? 'bg-emerald-500/20 text-emerald-300' :
                                account.riskLevel === 'yellow' ? 'bg-amber-500/20 text-amber-300' :
                                'bg-red-500/20 text-red-300'
                              }`}>
                                {account.riskLevel}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-blue-400">{account.ticketCount}</td>
                            <td className="px-6 py-4 text-sm text-red-400">{account.criticalTickets}</td>
                            <td className="px-6 py-4 text-sm text-purple-400">{account.escalationPercentage}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
