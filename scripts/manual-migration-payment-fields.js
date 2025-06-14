/**
 * Manual migration script for adding payment-related fields
 * Run this script with Node.js to apply the schema changes to PostgreSQL
 */
const { PrismaClient } = require('@prisma/client');

async function main() {
  console.log('Initializing PrismaClient...');
  console.log('Database URL type:', typeof process.env.DATABASE_URL);
  console.log('Database URL starts with:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + '...' : 'undefined');
  
  const prisma = new PrismaClient();
  
  try {
    console.log('Starting manual migration to add payment-related fields...');
    
    // We'll check if the table exists without assuming its structure
    console.log('Checking if Patient table exists...');
    try {
      await prisma.$executeRawUnsafe(`SELECT 1 FROM "Patient" LIMIT 1;`);
      console.log('Patient table exists, proceeding with column additions.');
    } catch (err) {
      console.error('Error checking Patient table:', err);
      console.log('Patient table might not exist, please check your database.');
      return;
    }
    
    // Using raw SQL to add the columns (safer than Prisma schema changes without migrations)
    console.log('Adding payment-related fields to Patient table...');
    const alterTableQueries = [
      // Add requiredPlanType field with default 'basic'
      `ALTER TABLE "Patient" ADD COLUMN IF NOT EXISTS "requiredPlanType" TEXT DEFAULT 'basic';`,
      // Add paymentId field
      `ALTER TABLE "Patient" ADD COLUMN IF NOT EXISTS "paymentId" TEXT;`,
      // Add paymentAmount field
      `ALTER TABLE "Patient" ADD COLUMN IF NOT EXISTS "paymentAmount" DOUBLE PRECISION;`,
      // Add paymentCurrency field
      `ALTER TABLE "Patient" ADD COLUMN IF NOT EXISTS "paymentCurrency" TEXT;`,
      // Add paymentDate field
      `ALTER TABLE "Patient" ADD COLUMN IF NOT EXISTS "paymentDate" TIMESTAMP;`,
      // Add paid field (if not exists)
      `ALTER TABLE "Patient" ADD COLUMN IF NOT EXISTS "paid" BOOLEAN DEFAULT false;`
    ];
    
    // Execute each query
    for (const query of alterTableQueries) {
      console.log(`Executing: ${query}`);
      await prisma.$executeRawUnsafe(query);
    }
    
    console.log('Migration complete! Payment fields added to database schema.');
    
  } catch (error) {
    console.error('Error performing manual migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
