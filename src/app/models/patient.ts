import { PrismaClient, Patient as PrismaPatient } from '@prisma/client'

// Create prisma client with better connection handling
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || 
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    datasources: {
      db: {
        // This ensures we use the correct DATABASE_URL in each environment
        url: process.env.DATABASE_URL,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
export type Patient = PrismaPatient
