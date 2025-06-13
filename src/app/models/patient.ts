import { PrismaClient, Patient as PrismaPatient } from '@prisma/client'

// Create prisma client with better connection handling
// For Server Components in production, we need a new instance per request 
// to avoid caching issues on Vercel
let prismaInstance: PrismaClient;

// In development, we can still use a global instance for better performance
if (process.env.NODE_ENV === 'development') {
  const globalForPrisma = global as unknown as { prisma: PrismaClient }
  prismaInstance = globalForPrisma.prisma || new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })
  globalForPrisma.prisma = prismaInstance
} else {
  // In production, create a new instance to avoid stale data
  prismaInstance = new PrismaClient({
    log: ['warn', 'error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })
}

export const prisma = prismaInstance
export default prismaInstance
export type Patient = PrismaPatient
