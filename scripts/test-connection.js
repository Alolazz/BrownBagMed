// Direct test of database connection
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

// Log database connection details
console.log('DATABASE_URL (from env):', process.env.DATABASE_URL?.substring(0, 20) + '...');

// Create a Prisma client to test the connection
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  try {
    console.log('Testing database connection...');
    // Try to count patients to verify connection
    const count = await prisma.patient.count();
    console.log(`✅ Connection successful! Found ${count} patients in the database.`);
    
    // Get some patients to verify data
    const patients = await prisma.patient.findMany({
      take: 3,
      orderBy: { uploadedAt: 'desc' },
      select: { 
        id: true, 
        dateOfBirth: true, 
        medications: true,
        uploadedAt: true 
      },
    });
    
    console.log('Recent patients:');
    patients.forEach(p => {
      console.log(`- ID: ${p.id}`);
      console.log(`  Date of Birth: ${p.dateOfBirth || 'Not provided'}`);
      console.log(`  Medications: ${p.medications ? 'Present' : 'Missing'}`);
      console.log(`  Uploaded: ${p.uploadedAt}`);
      console.log();
    });
  } catch (error) {
    console.error('❌ Database connection error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
