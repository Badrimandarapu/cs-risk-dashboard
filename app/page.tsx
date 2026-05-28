'use client'

import { useState, useEffect } from 'react'
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
        console.error('Failed to fetch:', error)
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

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 border-b border-blue-700">
          <h1 className="text-4xl font-bold">CS Risk Intelligence</h1>
          <p className="text-blue-100 mt-2">Real-time customer success monitoring • {accounts.length} clients tracked</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-white text-xl">Loading dashboard...</div>
          </div>
        ) : (
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                <div className="text-sm text-gray-600 font-medium">Avg Health</div>
                <div className="text-3xl font-bold text-blue-600 mt-2">{avgHealth}</div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-emerald-500">
                <div className="text-sm text-gray-600 font-medium">Healthy</div>
                <div className="text-3xl font-bold text-emerald-600 mt-2">{greenAccounts}</div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-amber-500">
                <div className="text-sm text-gray-600 font-medium">At Risk</div>
                <div className="text-3xl font-bold text-amber-600 mt-2">{yellowAccounts}</div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
                <div className="text-sm text-gray-600 font-medium">Critical</div>
                <div className="text-3xl font-bold text-red-600 mt-2">{redAccounts}</div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                <div className="text-sm text-gray-600 font-medium">Tickets</div>
                <div className="text-3xl font-bold text-purple-600 mt-2">{totalOpen}</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">Accounts</h3>
              </div>

              {accounts.length === 0 ? (
                <div className="p-12 text-center text-gray-500">No accounts with tickets yet</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="px-6 py-3 text-left text-sm font-semibold">Client</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Health</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Risk</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Open</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Critical</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Escalation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accounts.map((account, i) => (
                        <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium">{account.name}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 rounded h-2 overflow-hidden">
                                <div 
                                  className={`h-2 ${
                                    account.healthScore >= 70 ? 'bg-emerald-500' : 
                                    account.healthScore >= 40 ? 'bg-amber-500' : 
                                    'bg-red-500'
                                  }`}
                                  style={{ width: `${account.healthScore}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-semibold w-8">{account.healthScore}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              account.riskLevel === 'green' ? 'bg-emerald-100 text-emerald-800' :
                              account.riskLevel === 'yellow' ? 'bg-amber-100 text-amber-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {account.riskLevel}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center text-sm font-semibold text-blue-600">{account.ticketCount}</td>
                          <td className="px-6 py-4 text-center text-sm font-semibold text-red-600">{account.criticalTickets}</td>
                          <td className="px-6 py-4 text-center text-sm font-semibold text-purple-600">{account.escalationPercentage}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
