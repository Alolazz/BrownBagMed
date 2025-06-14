#!/usr/bin/env node
// filepath: /mnt/Aly/brown-bag-med/Brown-Bag-1/scripts/verify-nowpayments-config.js

/**
 * Script to verify the NOWPayments configuration
 * Run with: node scripts/verify-nowpayments-config.js
 */
const { createHmac } = require('crypto');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

// Expected IPN secret
const EXPECTED_IPN_SECRET = '70yT7jJURapV9qLwSaGUZM7PmvjhAqyF';

function checkIpnSecret() {
  console.log('Verifying NOWPayments IPN Secret configuration...');
  
  const configuredSecret = process.env.NOWPAYMENTS_IPN_SECRET;
  
  if (!configuredSecret) {
    console.error('❌ ERROR: NOWPAYMENTS_IPN_SECRET is not set in the environment');
    console.log('\nPlease add the following to your .env.local file:');
    console.log(`NOWPAYMENTS_IPN_SECRET="${EXPECTED_IPN_SECRET}"\n`);
    return false;
  }
  
  if (configuredSecret !== EXPECTED_IPN_SECRET) {
    console.warn(`⚠️ WARNING: IPN Secret does not match expected value`);
    console.log('Configured:', configuredSecret);
    console.log('Expected:', EXPECTED_IPN_SECRET);
    return false;
  }
  
  console.log('✅ IPN Secret correctly configured');
  return true;
}

function testHmacVerification() {
  console.log('\nTesting HMAC verification with sample data...');
  
  // Sample payment data
  const sampleData = {
    payment_id: 'test-payment-123',
    payment_status: 'confirmed',
    order_id: 'patient-test123-1717274635',
    price_amount: 99,
    price_currency: 'EUR'
  };
  
  try {
    // Create HMAC signature
    const hmac = createHmac('sha512', EXPECTED_IPN_SECRET);
    const signature = hmac.update(JSON.stringify(sampleData)).digest('hex');
    
    console.log('Generated signature:', signature.substring(0, 16) + '...');
    
    // Verify HMAC
    const verifyHmac = createHmac('sha512', process.env.NOWPAYMENTS_IPN_SECRET || '');
    const verifySignature = verifyHmac.update(JSON.stringify(sampleData)).digest('hex');
    
    if (signature === verifySignature) {
      console.log('✅ HMAC verification successful');
      return true;
    } else {
      console.error('❌ HMAC verification failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing HMAC verification:', error.message);
    return false;
  }
}

function checkApiEndpoint() {
  console.log('\nVerifying NOWPayments callback endpoint configuration...');
  
  const nowpaymentsCallbackRoute = path.resolve(__dirname, '..', 'src/app/api/payment/nowpayments-callback/route.ts');
  
  if (!fs.existsSync(nowpaymentsCallbackRoute)) {
    console.error('❌ NOWPayments callback endpoint not found at:', nowpaymentsCallbackRoute);
    return false;
  }
  
  console.log('✅ NOWPayments callback endpoint found');
  return true;
}

// Run all checks
async function main() {
  console.log('NOWPayments Configuration Verification\n');
  
  const ipnSecretValid = checkIpnSecret();
  const hmacVerificationValid = testHmacVerification();
  const apiEndpointValid = checkApiEndpoint();
  
  console.log('\n=== Overall Status ===');
  if (ipnSecretValid && hmacVerificationValid && apiEndpointValid) {
    console.log('✅ NOWPayments configuration is valid and ready for production use');
  } else {
    console.log('⚠️ NOWPayments configuration has issues that need to be resolved');
  }
  
  // Configuration instructions
  console.log('\n=== Next Steps ===');
  console.log('1. Configure your NOWPayments account with the following IPN URL:');
  console.log('   https://your-domain.com/api/payment/nowpayments-callback');
  console.log('2. Set the IPN Secret in your NOWPayments dashboard settings to:');
  console.log(`   ${EXPECTED_IPN_SECRET}`);
  console.log('3. Deploy your app with environment variables properly configured');
}

main().catch(console.error);
