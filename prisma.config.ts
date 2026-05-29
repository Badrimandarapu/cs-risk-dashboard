import path from 'node:path'
import { defineConfig } from 'prisma/config'
import { PrismaNeonHttp } from '@prisma/adapter-neon'

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrate: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    adapter: () => new PrismaNeonHttp(process.env.DATABASE_URL!) as any,
  },
})
