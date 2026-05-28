'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800 h-screen overflow-auto flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CS</span>
          </div>
          <div>
            <div className="text-white font-bold text-sm">Risk Intel</div>
            <div className="text-slate-400 text-xs">Success</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link href="/">
          <div className={`px-4 py-3 rounded-lg transition-all cursor-pointer ${
            isActive('/') 
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
              : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
          }`}>
            <div className="text-sm font-medium">📊 Overview</div>
            <div className="text-xs text-slate-500 mt-1">Dashboard</div>
          </div>
        </Link>

        <Link href="/tickets">
          <div className={`px-4 py-3 rounded-lg transition-all cursor-pointer ${
            isActive('/tickets') 
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
              : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
          }`}>
            <div className="text-sm font-medium">🎫 Tickets</div>
            <div className="text-xs text-slate-500 mt-1">Freshdesk</div>
          </div>
        </Link>

        <Link href="/emails">
          <div className={`px-4 py-3 rounded-lg transition-all cursor-pointer ${
            isActive('/emails') 
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
              : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
          }`}>
            <div className="text-sm font-medium">📧 Emails</div>
            <div className="text-xs text-slate-500 mt-1">Communications</div>
          </div>
        </Link>

        <Link href="/analytics">
          <div className={`px-4 py-3 rounded-lg transition-all cursor-pointer ${
            isActive('/analytics') 
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
              : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
          }`}>
            <div className="text-sm font-medium">📈 Analytics</div>
            <div className="text-xs text-slate-500 mt-1">Trends</div>
          </div>
        </Link>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
        </div>
      </div>
    </div>
  )
}
