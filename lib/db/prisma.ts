/* eslint-disable @typescript-eslint/no-explicit-any */
const { PrismaClient } = require('@prisma/client')
const { PrismaNeonHttp } = require('@prisma/adapter-neon')

function createPrismaClient() {
  const adapter = new PrismaNeonHttp(process.env.DATABASE_URL)
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as { prisma: any }
export const prisma: any = globalForPrisma.prisma || createPrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
