// Simple script to check which database the app is connecting to
require('dotenv').config({ path: './.env.local' });
require('dotenv').config();

console.log('DATABASE_URL from env:', process.env.DATABASE_URL?.substring(0, 25) + '...');
console.log('Is SQLite?', process.env.DATABASE_URL?.startsWith('file:'));
console.log('Is Postgres?', process.env.DATABASE_URL?.startsWith('prisma+postgres:'));
console.log('NODE_ENV:', process.env.NODE_ENV);

const { PrismaClient } = require('@prisma/client');

async function checkDb() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  try {
    console.log('Attempting to connect to database...');
    const patientCount = await prisma.patient.count();
    console.log('Connection successful! Patient count:', patientCount);
    
    // Get some sample patient data
    const patients = await prisma.patient.findMany({
      take: 3,
      orderBy: { uploadedAt: 'desc' },
    });
    
    console.log('Recent patients:');
    patients.forEach(p => {
      console.log(`- ID: ${p.id.substring(0, 8)}... | Date: ${p.dateOfBirth || '-'} | Medications: ${p.medications ? 'Present' : 'Missing'}`);
    });
  } catch (err) {
    console.error('Database connection error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

checkDb();
