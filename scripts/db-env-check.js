// Simple environment variable check
require('dotenv').config();

console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Checking database connection...');
    await prisma.$connect();
    console.log('Connected successfully!');

    console.log('Checking for patients...');
    const count = await prisma.patient.count();
    console.log('Patient count:', count);

    console.log('Database provider:', prisma._engineConfig.datamodel.datasources[0].provider);
    console.log('Database URL:', prisma._engineConfig.datamodel.datasources[0].url.value);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
