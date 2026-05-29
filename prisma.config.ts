import path from 'node:path'
import { defineConfig } from 'prisma/config'
import { PrismaNeonHttp } from '@prisma/adapter-neon'
import { neon } from '@neondatabase/serverless'

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrate: {
    adapter: () => {
      const connectionString = process.env.DATABASE_URL!
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sql = neon(connectionString)
      return new PrismaNeonHttp(sql as any, connectionString)
    },
  },
})
