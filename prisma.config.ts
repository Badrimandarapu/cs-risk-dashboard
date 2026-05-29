import path from 'node:path'
import { defineConfig } from 'prisma/config'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig, Pool } from '@neondatabase/serverless'
import ws from 'ws'

neonConfig.webSocketConstructor = ws

const connectionString = process.env.DATABASE_URL!

export default defineConfig({
  earlyAccess: true,
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    url: connectionString,
  },
  migrate: {
    adapter: () => {
      const pool = new Pool({ connectionString })
      return new PrismaNeon(pool)
    },
  },
})
