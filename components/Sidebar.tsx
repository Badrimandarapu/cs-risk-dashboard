'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, Users, AlertTriangle, Zap, TrendingUp, FileText } from 'lucide-react'

const navigation = [
  { name: 'Overview', href: '/', icon: BarChart3 },
  { name: 'Accounts', href: '/accounts', icon: Users },
  { name: 'Risks', href: '/risks', icon: AlertTriangle },
  { name: 'Escalations', href: '/escalations', icon: Zap },
  { name: 'Insights', href: '/insights', icon: TrendingUp },
  { name: 'Reports', href: '/reports', icon: FileText },
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800 p-6 flex flex-col">
      <div className="mb-12 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
          <BarChart3 size={24} className="text-white" />
        </div>
        <div>
          <p className="text-lg font-bold text-white">CS Risk</p>
          <p className="text-xs text-slate-400">Intelligence</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link key={item.name} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'}`}>
              <Icon size={20} />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-slate-800 pt-6">
        <div className="px-4 py-3 bg-slate-800/50 rounded-lg">
          <p className="text-xs text-slate-400">Status</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <p className="text-xs font-medium text-emerald-400">Live</p>
          </div>
        </div>
      </div>
    </div>
  )
}
