#!/usr/bin/env node
// filepath: /mnt/Aly/brown-bag-med/Brown-Bag-1/scripts/update-nowpayments-env.js

/**
 * Script to update NOWPayments environment variables
 * Run with: node scripts/update-nowpayments-env.js
 */
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Path to .env.local file
const envPath = path.resolve(__dirname, '..', '.env.local');

async function updateNowPaymentsEnv() {
  console.log('Updating NOWPayments environment variables...');

  try {
    // Check if .env.local exists
    let envConfig = {};
    if (fs.existsSync(envPath)) {
      console.log('.env.local file found, updating...');
      const existingEnv = fs.readFileSync(envPath, 'utf8');
      envConfig = dotenv.parse(existingEnv);
    } else {
      console.log('.env.local not found, creating new file...');
    }

    // Update or add the IPN Secret
    envConfig.NOWPAYMENTS_IPN_SECRET = '70yT7jJURapV9qLwSaGUZM7PmvjhAqyF';
    
    // Make sure DATABASE_URL exists
    if (!envConfig.DATABASE_URL) {
      envConfig.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://username:password@hostname:5432/database_name';
    }
    
    // Make sure other important configs exist
    if (!envConfig.NOWPAYMENTS_API_KEY) {
      envConfig.NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY || '';
    }
    
    if (!envConfig.ADMIN_API_KEY) {
      envConfig.ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'secure-admin-key-for-protected-routes';
    }

    // Convert the object back to an .env string
    const envString = Object.entries(envConfig)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Add comments for readability
    const envWithComments = `# Brown Bag Med Environment Variables
# Updated on ${new Date().toISOString()}

# Database Configuration
${envConfig.DATABASE_URL ? `DATABASE_URL="${envConfig.DATABASE_URL}"` : '# DATABASE_URL="postgresql://username:password@hostname:5432/database_name"'}

# NowPayments API Configuration
${envConfig.NOWPAYMENTS_API_KEY ? `NOWPAYMENTS_API_KEY="${envConfig.NOWPAYMENTS_API_KEY}"` : '# NOWPAYMENTS_API_KEY=""'}
NOWPAYMENTS_IPN_SECRET="70yT7jJURapV9qLwSaGUZM7PmvjhAqyF"

# Admin Authentication
${envConfig.ADMIN_API_KEY ? `ADMIN_API_KEY="${envConfig.ADMIN_API_KEY}"` : '# ADMIN_API_KEY="secure-admin-key-for-protected-routes"'}
`;

    // Write the updated .env.local file
    fs.writeFileSync(envPath, envWithComments);
    console.log('NOWPayments environment variables updated successfully!');
    console.log(`IPN Secret set to: 70yT7jJURapV9qLwSaGUZM7PmvjhAqyF`);
    console.log(`Environment file saved to: ${envPath}`);
  } catch (error) {
    console.error('Error updating environment variables:', error);
  }
}

updateNowPaymentsEnv();
