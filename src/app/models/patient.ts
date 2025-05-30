import { PrismaClient, Patient as PrismaPatient } from '@prisma/client'

const prisma = new PrismaClient()

export default prisma
export type Patient = PrismaPatient
