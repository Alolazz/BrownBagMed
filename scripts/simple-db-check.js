// Simple database check
const { PrismaClient } = require('@prisma/client');

console.log('Starting database check...');
console.log('DATABASE_URL:', process.env.DATABASE_URL);

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Connecting to database...');
    await prisma.$connect();
    console.log('Connected successfully!');
    
    const patientCount = await prisma.patient.count();
    console.log(`Patient count: ${patientCount}`);
    
    if (patientCount > 0) {
      const patients = await prisma.patient.findMany({ take: 3 });
      console.log('Sample patients:', JSON.stringify(patients, null, 2));
    } else {
      console.log('No patients in database');
    }
  } catch (error) {
    console.error('Error connecting to database:', error);
  } finally {
    await prisma.$disconnect();
    console.log('Disconnected from database');
  }
}

main();
