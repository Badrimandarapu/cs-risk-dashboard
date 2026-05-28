'use client'

interface Account {
  name: string
  company: string
  ticketCount: number
  criticalTickets: number
}

export default function TicketIntelligence({ accounts }: { accounts: Account[] }) {
  const topTickets = [...accounts].sort((a, b) => b.ticketCount - a.ticketCount).slice(0, 5)
  const totalTickets = accounts.reduce((sum, a) => sum + a.ticketCount, 0)

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Intelligence</h3>
      
      <div className="mb-4 p-3 bg-blue-50 rounded">
        <div className="text-sm font-medium text-blue-900">Total Open Tickets</div>
        <div className="text-2xl font-bold text-blue-600">{totalTickets}</div>
      </div>

      <div className="space-y-3">
        <div className="text-xs font-semibold text-gray-600 uppercase">Top Accounts</div>
        {topTickets.length === 0 ? (
          <p className="text-sm text-gray-500">No tickets</p>
        ) : (
          topTickets.map((account, i) => (
            <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <div>
                <div className="text-sm font-medium text-gray-900">{account.company}</div>
                <div className="text-xs text-gray-500">{account.name}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">{account.ticketCount}</div>
                {account.criticalTickets > 0 && (
                  <div className="text-xs text-red-600 font-medium">{account.criticalTickets} critical</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}