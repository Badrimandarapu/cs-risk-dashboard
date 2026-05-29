import { NextRequest, NextResponse } from 'next/server'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = require('@/lib/db/prisma').prisma as any

export const maxDuration = 300

interface TicketRow {
  'Ticket ID': string
  'Subject': string
  'Description': string
  'Status': string
  'Priority': string
  'Created time': string
  'Resolved time': string
  'Closed time': string
  'Last update time': string
  'Client': string
  'Contact': string
  'Phone number': string
  'Agent': string
  'Group': string
  'Tags': string
}

function normalizeStatus(status: string): number {
  const s = status.toLowerCase().trim()
  if (s === 'open' || s === 'pending') return 2
  if (s === 'resolved') return 4
  if (s === 'closed') return 5
  return 2
}

function normalizePriority(priority: string): number {
  const p = priority.toLowerCase().trim()
  if (p === 'low') return 1
  if (p === 'medium') return 2
  if (p === 'high') return 3
  if (p === 'urgent') return 4
  return 2
}

function extractEmail(contact: string): string {
  const match = contact?.match(/[\w.-]+@[\w.-]+\.\w+/)
  return match ? match[0] : `contact-${Math.random().toString(36).substr(2, 9)}@unknown.invalid`
}

function extractName(contact: string): string {
  if (!contact) return 'Unknown'
  const parts = contact.split(',').map(p => p.trim())
  return parts[0] || 'Unknown'
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const text = await file.text()
    const lines = text.split('\n')
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    
    const companies = new Map<string, { name: string; industry: string }>()
    const contacts = new Map<string, { email: string; name: string; company: string }>()
    const ticketRows: TicketRow[] = []

    // Parse rows
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue
      
      const values = lines[i].split(',').map(v => v.trim().replace(/^"/, '').replace(/"$/, ''))
      const row: Record<string, string> = {}
      
      headers.forEach((h, idx) => {
        row[h] = values[idx] || ''
      })

      // Extract company
      const clientName = row['Client']?.trim() || 'Unknown'
      if (clientName && !companies.has(clientName)) {
        companies.set(clientName, { name: clientName, industry: 'Unknown' })
      }

      // Extract contact
      const contactStr = row['Contact']?.trim() || ''
      const email = extractEmail(contactStr)
      const name = extractName(contactStr)
      if (email && !contacts.has(email)) {
        contacts.set(email, { email, name, company: clientName })
      }

      ticketRows.push(row as unknown as TicketRow)
    }

    // Bulk insert companies
    const companyMap = new Map<string, string>()
    for (const [name, data] of companies) {
      const company = await prisma.account.upsert({
        where: { name: name },
        create: { name, displayName: name, isActive: true, metadata: { industry: data.industry } },
        update: {},
      })
      companyMap.set(name, company.id)
    }

    // Bulk insert contacts
    const contactMap = new Map<string, string>()
    for (const [email, data] of contacts) {
      const accountId = companyMap.get(data.company) || (await prisma.account.findFirst({ where: { name: '__unassigned__' } }))?.id
      if (accountId) {
        const contact = await prisma.stakeholder.upsert({
          where: { email },
          create: { freshdeskId: BigInt(Math.random() * 1e9), accountId, email, name: data.name, isActive: true },
          update: { name: data.name },
        })
        contactMap.set(email, contact.id)
      }
    }

    // Bulk insert tickets
    let ticketCount = 0
    for (const row of ticketRows) {
      if (!row['Ticket ID'] || !row['Subject']) continue

      const accountId = companyMap.get(row['Client']) || (await prisma.account.findFirst({ where: { name: '__unassigned__' } }))?.id
      if (!accountId) continue

      await prisma.supportTicket.upsert({
        where: { id: BigInt(Math.random() * 1e9) },
        create: {
          id: BigInt(parseInt(row['Ticket ID']) || Math.floor(Math.random() * 1e9)),
          accountId,
          subject: row['Subject'],
          description: row['Description'] || '',
          priority: normalizePriority(row['Priority']),
          status: normalizeStatus(row['Status']),
          createdAt: new Date(row['Created time'] || Date.now()),
          updatedAt: new Date(row['Last update time'] || Date.now()),
          resolvedAt: row['Resolved time'] ? new Date(row['Resolved time']) : null,
          tags: row['Tags']?.split(',').map(t => t.trim()) || [],
          metadata: { source: 'csv_import', client: row['Client'], contact: row['Contact'] },
        },
        update: {},
      })
      ticketCount++
    }

    return NextResponse.json({
      success: true,
      companies: companies.size,
      contacts: contacts.size,
      tickets: ticketCount,
      totalTime: Date.now(),
    })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
