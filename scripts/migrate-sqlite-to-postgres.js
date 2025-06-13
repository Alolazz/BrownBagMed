// Migration script to transfer data from SQLite to PostgreSQL
require('dotenv').config();
const { PrismaClient: PostgresClient } = require('@prisma/client');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

// Initialize Postgres client with the correct URL
const postgresClient = new PostgresClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['query', 'info', 'warn', 'error'],
});

async function migrateData() {
  console.log('Starting migration from SQLite to PostgreSQL...');
  console.log('Postgres URL:', process.env.DATABASE_URL);

  try {
    // Connect to SQLite database
    console.log('Opening SQLite database...');
    const sqliteDb = await open({
      filename: '/mnt/Aly/brown-bag-med/Brown-Bag-1/prisma/dev.db',
      driver: sqlite3.Database
    });
    
    // Get all patients from SQLite
    console.log('Reading patients from SQLite...');
    const patients = await sqliteDb.all('SELECT * FROM Patient');
    console.log(`Found ${patients.length} patients in SQLite database`);
    
    // Connect to Postgres
    console.log('Connecting to PostgreSQL...');
    await postgresClient.$connect();
    
    // Count existing PostgreSQL records
    const existingCount = await postgresClient.patient.count();
    console.log(`Found ${existingCount} existing patients in PostgreSQL database`);

    // Transfer each patient to Postgres
    console.log('Transferring patients to PostgreSQL...');
    let transferred = 0;
    
    for (const patient of patients) {
      try {
        // Check if patient already exists in Postgres
        const existing = await postgresClient.patient.findUnique({
          where: { id: patient.id }
        });
        
        if (existing) {
          console.log(`Patient ${patient.id} already exists in PostgreSQL, skipping`);
          continue;
        }
        
        // Parse ISO date string back into a Date object
        const uploadedAt = new Date(patient.uploadedAt);
        
        // Create patient in Postgres
        await postgresClient.patient.create({
          data: {
            id: patient.id,
            folderName: patient.folderName,
            dateOfBirth: patient.dateOfBirth,
            gender: patient.gender,
            conditions: patient.conditions,
            allergies: patient.allergies,
            comments: patient.comments,
            uploadedAt: uploadedAt,
            reportReady: Boolean(patient.reportReady),
            paid: Boolean(patient.paid)
          }
        });
        
        transferred++;
        console.log(`Transferred patient ${patient.id}`);
      } catch (error) {
        console.error(`Error transferring patient ${patient.id}:`, error);
      }
    }
    
    console.log(`Migration complete. Transferred ${transferred} new patients to PostgreSQL.`);
    
    // Verify the count in Postgres
    const newCount = await postgresClient.patient.count();
    console.log(`Total patients in PostgreSQL database: ${newCount}`);
    
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await postgresClient.$disconnect();
    console.log('Disconnected from PostgreSQL');
  }
}

migrateData();
