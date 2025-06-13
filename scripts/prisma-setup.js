// This script ensures that Prisma generates the client correctly during build
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Database URL:', process.env.DATABASE_URL);
console.log('Node environment:', process.env.NODE_ENV);
console.log('Running Prisma setup for production build...');

try {
  // Generate Prisma Client
  console.log('Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Push schema to database (works for both SQLite and PostgreSQL)
  console.log('Pushing schema to database...');
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
  
  console.log('Prisma setup completed successfully!');
} catch (error) {
  console.error('Error during Prisma setup:', error);
  process.exit(1);
}
