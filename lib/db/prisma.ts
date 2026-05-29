import { PrismaClient } from '@prisma/client'
import { PrismaNeonHttp } from '@prisma/adapter-neon'
import { neon } from '@neondatabase/serverless'

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL!
  const sql = neon(connectionString)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adapter = new PrismaNeonHttp(sql as any, connectionString)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new PrismaClient({ adapter } as any)
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
