// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = require('../lib/db/prisma').prisma as any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { extractAllSignals } = require('../lib/signals/extractor') as any

async function run() {
  console.log('🔍 Extracting signals from tickets...')
  const start = Date.now()
  try {
    const result = await extractAllSignals()
    console.log(`✅ Complete!`)
    console.log(`   Accounts: ${result.accountsProcessed}`)
    console.log(`   Signals: ${result.totalSignals}`)
    console.log(`   Time: ${(Date.now() - start) / 1000}s`)
    process.exit(0)
  } catch (e) {
    console.error('❌ Error:', (e as Error).message)
    process.exit(1)
  }
}

run()
