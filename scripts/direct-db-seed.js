// Direct database seeding script with environment variable
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

console.log('Database URL:', process.env.DATABASE_URL);
console.log('Node env:', process.env.NODE_ENV);

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['query', 'info', 'warn', 'error'],
});

async function seed() {
  try {
    console.log('Connecting to database...');
    await prisma.$connect();
    console.log('Connected successfully!');
    
    const testPatient = await prisma.patient.create({
      data: {
        id: `test-${Date.now()}`,
        folderName: `test-folder-${Date.now()}`,
        dateOfBirth: '1990-01-01',
        gender: 'Other',
        conditions: 'Hypertension, Diabetes',
        allergies: 'Penicillin',
        comments: 'This is a test patient record',
        uploadedAt: new Date(),
        reportReady: true,
        paid: true
      }
    });
    
    console.log('Test patient created:', testPatient);
    
    const patientCount = await prisma.patient.count();
    console.log(`Total patients in database: ${patientCount}`);
    
    if (patientCount > 0) {
      const patients = await prisma.patient.findMany({ take: 3 });
      console.log('Sample patients:', patients);
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
    console.log('Disconnected from database');
  }
}

seed();
