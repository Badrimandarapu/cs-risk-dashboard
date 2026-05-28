'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import TicketIntelligence from '@/components/TicketIntelligence'
import SentimentPanel from '@/components/SentimentPanel'
import ActionCenter from '@/components/ActionCenter'
import AIInsights from '@/components/AIInsights'

interface Account {
  name: string
  company: string
  email: string
  healthScore: number
  riskLevel: 'green' | 'yellow' | 'red'
  escalationPercentage: number
  ticketCount: number
  criticalTickets: number
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
        console.error('Failed to fetch dashboard:', error)
        setData({ accounts: [], totalTickets: 0, success: false })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  const accounts = data?.accounts || []
  const totalTickets = data?.totalTickets || 0

  const avgHealth = accounts.length > 0 ? Math.round(accounts.reduce((sum, a) => sum + a.healthScore, 0) / accounts.length) : 0
  const redAccounts = accounts.filter(a => a.riskLevel === 'red').length
  const criticalTickets = accounts.reduce((sum, a) => sum + a.criticalTickets, 0)
  const avgEscalation = accounts.length > 0 ? Math.round(accounts.reduce((sum, a) => sum + a.escalationPercentage, 0) / accounts.length) : 0

  const getRiskColor = (level: string) => {
    if (level === 'red') return 'text-red-600'
    if (level === 'yellow') return 'text-yellow-600'
    return 'text-green-600'
  }

  const getRiskBg = (level: string) => {
    if (level === 'red') return 'bg-red-50'
    if (level === 'yellow') return 'bg-yellow-50'
    return 'bg-green-50'
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="border-b bg-white p-6">
          <h1 className="text-3xl font-bold text-gray-900">CS Risk Intelligence</h1>
          <p className="text-gray-600 mt-1">Real-time customer success metrics powered by Freshdesk + Google Sheets</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border p-6">
              <div className="text-sm font-medium text-gray-600">Avg Health Score</div>
              <div className="text-4xl font-bold mt-2 text-blue-600">{avgHealth}</div>
              <div className="text-xs text-gray-500 mt-2">{accounts.length} accounts tracked</div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="text-sm font-medium text-gray-600">At-Risk Accounts</div>
              <div className="text-4xl font-bold mt-2 text-red-600">{redAccounts}</div>
              <div className="text-xs text-gray-500 mt-2">High priority</div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="text-sm font-medium text-gray-600">Critical Tickets</div>
              <div className="text-4xl font-bold mt-2 text-orange-600">{criticalTickets}</div>
              <div className="text-xs text-gray-500 mt-2">Priority 4</div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="text-sm font-medium text-gray-600">Avg Escalation Risk</div>
              <div className="text-4xl font-bold mt-2 text-purple-600">{avgEscalation}%</div>
              <div className="text-xs text-gray-500 mt-2">Probability</div>
            </div>
          </div>

          <div className="bg-white rounded-lg border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Risk Radar</h2>
              <p className="text-sm text-gray-600 mt-1">Account health and escalation tracking</p>
            </div>

            {loading ? (
              <div className="p-12 text-center text-gray-500">Loading accounts...</div>
            ) : accounts.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No accounts found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Account</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Company</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Health</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Risk Level</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tickets</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Escalation %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((account, i) => (
                      <tr key={i} className={`border-b ${getRiskBg(account.riskLevel)}`}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{account.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{account.company}</td>
                        <td className="px-6 py-4 text-sm font-semibold">{account.healthScore}</td>
                        <td className={`px-6 py-4 text-sm font-semibold ${getRiskColor(account.riskLevel)}`}>
                          {account.riskLevel.toUpperCase()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium">
                            {account.ticketCount} open
                            {account.criticalTickets > 0 && ` • ${account.criticalTickets} critical`}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-purple-600">{account.escalationPercentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TicketIntelligence accounts={accounts} />
            <SentimentPanel />
            <ActionCenter />
          </div>

          <AIInsights />
        </div>
      </main>
    </div>
  )
}
