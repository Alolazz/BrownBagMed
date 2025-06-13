#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: './.env.local' });
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');

// Load secrets for Alola admin page (simulating what happens during page load)
const DATABASE_URL = process.env.DATABASE_URL;
console.log(`DATABASE_URL being used: ${DATABASE_URL?.substring(0, 20)}...`);
console.log(`Is using SQLite? ${DATABASE_URL?.startsWith('file:')}`);
console.log(`Is using Postgres? ${DATABASE_URL?.startsWith('prisma+postgres:')}`);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Create a new Prisma client with the same settings as the Alola page
async function main() {
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    datasources: {
      db: {
        url: DATABASE_URL,
      },
    },
  });

  try {
    console.log('Fetching patients from database...');
    const patients = await prisma.patient.findMany({
      take: 5,
      orderBy: { uploadedAt: 'desc' },
    });

    console.log(`Found ${patients.length} patients in the database:`);
    patients.forEach((p, i) => {
      console.log(`- Patient ${i + 1}:`);
      console.log(`  ID: ${p.id}`);
      console.log(`  Date of Birth: ${p.dateOfBirth || 'Not provided'}`);
      console.log(`  Gender: ${p.gender || 'Not provided'}`);
      console.log(`  Medications: ${p.medications || 'None'}`);
    });

    await prisma.$disconnect();
    console.log('Disconnected from database');
  } catch (error) {
    console.error('Error connecting to database:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
