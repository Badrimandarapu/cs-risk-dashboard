import fs from 'fs'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = require('../lib/db/prisma').prisma as any

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
  const parts = contact.split(',').map((p: string) => p.trim())
  return parts[0] || 'Unknown'
}

async function importCsv(filePath: string) {
  console.log(`📂 Reading ${filePath}...`)
  const text = fs.readFileSync(filePath, 'utf-8')
  const lines = text.split('\n')
  const headers = lines[0].split(',').map((h: string) => h.trim().replace(/"/g, ''))

  const companies = new Map<string, { name: string; industry: string }>()
  const contacts = new Map<string, { email: string; name: string; company: string }>()
  const ticketRows: TicketRow[] = []

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue
    const values = lines[i].split(',').map((v: string) => v.trim().replace(/^"/, '').replace(/"$/, ''))
    const row: Record<string, string> = {}
    headers.forEach((h: string, idx: number) => {
      row[h] = values[idx] || ''
    })

    const clientName = row['Client']?.trim() || 'Unknown'
    if (clientName && !companies.has(clientName)) {
      companies.set(clientName, { name: clientName, industry: 'Unknown' })
    }

    const contactStr = row['Contact']?.trim() || ''
    const email = extractEmail(contactStr)
    const name = extractName(contactStr)
    if (email && !contacts.has(email)) {
      contacts.set(email, { email, name, company: clientName })
    }

    ticketRows.push(row as unknown as TicketRow)
  }

  console.log(`\n📊 Parsed: ${companies.size} companies, ${contacts.size} contacts, ${ticketRows.length} tickets`)

  let unassignedId = (await prisma.account.findFirst({ where: { freshdeskCompanyId: BigInt(0) } }))?.id
  if (!unassignedId) {
    const ua = await prisma.account.create({
      data: { freshdeskCompanyId: BigInt(0), name: '__unassigned__', displayName: 'Unassigned', isActive: false },
    })
    unassignedId = ua.id
  }

  console.log('\n🏢 Importing companies...')
  const companyMap = new Map<string, string>()
  for (const [name, data] of companies) {
    try {
      const existing = await prisma.account.findFirst({ where: { name } })
      if (existing) {
        companyMap.set(name, existing.id)
      } else {
        const company = await prisma.account.create({
          data: { name, displayName: name, isActive: true, metadata: { industry: data.industry }, lastActivity: new Date() },
        })
        companyMap.set(name, company.id)
      }
    } catch (e) {
      console.log(`  ⚠️ ${name}: ${(e as Error).message}`)
    }
  }
  console.log(`✓ ${companyMap.size} companies`)

  console.log('\n👥 Importing contacts...')
  let contactCount = 0
  for (const [email, data] of contacts) {
    const accountId = companyMap.get(data.company) || unassignedId
    try {
      const existing = await prisma.stakeholder.findFirst({ where: { email } })
      if (!existing) {
        await prisma.stakeholder.create({
          data: {
            freshdeskId: BigInt(Math.floor(Math.random() * 1e9)),
            accountId,
            email,
            name: data.name,
            isActive: true,
          },
        })
        contactCount++
      }
    } catch (e) {
      // Skip duplicates
    }
  }
  console.log(`✓ ${contactCount} contacts`)

  console.log('\n🎫 Importing tickets...')
  let ticketCount = 0
  let skipped = 0
  for (const row of ticketRows) {
    if (!row['Ticket ID'] || !row['Subject']) {
      skipped++
      continue
    }

    const accountId = companyMap.get(row['Client']) || unassignedId
    const ticketId = parseInt(row['Ticket ID'])

    try {
      const existing = await prisma.supportTicket.findFirst({ where: { id: BigInt(ticketId) } })
      if (!existing) {
        await prisma.supportTicket.create({
          data: {
            id: BigInt(ticketId),
            accountId,
            subject: row['Subject'],
            description: row['Description'] || '',
            priority: normalizePriority(row['Priority']),
            status: normalizeStatus(row['Status']),
            createdAt: new Date(row['Created time'] || Date.now()),
            updatedAt: new Date(row['Last update time'] || Date.now()),
            resolvedAt: row['Resolved time'] ? new Date(row['Resolved time']) : null,
            tags: row['Tags']?.split(',').map((t: string) => t.trim()).filter(Boolean) || [],
            metadata: { source: 'csv_import', client: row['Client'], contact: row['Contact'] },
          },
        })
        ticketCount++
        if (ticketCount % 100 === 0) process.stdout.write('.')
      }
    } catch (e) {
      skipped++
    }
  }
  console.log(`\n✓ ${ticketCount} tickets (${skipped} skipped)`)
  console.log('\n✅ Import complete!')
  process.exit(0)
}

const csvFile = process.argv[2] || 'tickets.csv'
importCsv(csvFile).catch(e => {
  console.error('❌ Import failed:', e.message)
  process.exit(1)
})
