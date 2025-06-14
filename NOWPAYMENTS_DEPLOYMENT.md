# NOWPayments Deployment Guide

This guide outlines the steps required to deploy the Brown Bag Med application with NOWPayments crypto payment integration.

## Pre-deployment Checklist

Before deploying, ensure:

1. You have a NOWPayments account set up
2. You've configured the IPN settings in your NOWPayments dashboard
3. You have your NOWPayments API key and IPN secret available

## Environment Variables

Set the following environment variables on your deployment platform:

```
NOWPAYMENTS_API_KEY=your_api_key_here
NOWPAYMENTS_IPN_SECRET=70yT7jJURapV9qLwSaGUZM7PmvjhAqyF
DATABASE_URL=your_postgresql_connection_string
ADMIN_API_KEY=your_secure_admin_key
```

## NOWPayments Dashboard Setup

1. Log in to your NOWPayments account
2. Navigate to Settings > API Keys
3. Create a new API key if you don't have one
4. Copy the API key to your environment variables

## IPN Configuration

1. In your NOWPayments dashboard, navigate to Settings > IPN
2. Add a new IPN URL:
   - For production: `https://your-domain.com/api/payment/nowpayments-callback`
   - For testing: `https://your-staging-domain.com/api/payment/nowpayments-callback`
3. Set the IPN secret to: `70yT7jJURapV9qLwSaGUZM7PmvjhAqyF`
4. Save your settings

## Deployment Steps

### 1. Vercel Deployment

1. Push your code to your GitHub repository
2. Connect your repository to Vercel
3. Add the environment variables in the Vercel project settings
4. Deploy the application

### 2. Database Preparation

Ensure your PostgreSQL database has the required payment fields:

```bash
# Run the migration script
node scripts/manual-migration-payment-fields.js
```

Or manually add the fields:

```sql
ALTER TABLE "Patient" ADD COLUMN IF NOT EXISTS "requiredPlanType" TEXT DEFAULT 'basic';
ALTER TABLE "Patient" ADD COLUMN IF NOT EXISTS "paymentId" TEXT;
ALTER TABLE "Patient" ADD COLUMN IF NOT EXISTS "paymentAmount" DOUBLE PRECISION;
ALTER TABLE "Patient" ADD COLUMN IF NOT EXISTS "paymentCurrency" TEXT;
ALTER TABLE "Patient" ADD COLUMN IF NOT EXISTS "paymentDate" TIMESTAMP;
ALTER TABLE "Patient" ADD COLUMN IF NOT EXISTS "paid" BOOLEAN DEFAULT false;
```

### 3. Post-deployment Verification

1. Run the verification script:
   ```bash
   npm run verify:payments
   ```

2. Test an IPN callback:
   - Use the `/test/simulate-callback` endpoint in a staging environment
   - Check the logs to verify the callback is processed correctly

## Monitoring

1. Set up log monitoring for payment-related events
2. Monitor for any authentication failures or HMAC verification issues
3. Set up alerts for failed payment processing

## Troubleshooting

### HMAC Verification Failures

If you encounter HMAC signature verification failures:

1. Check that the IPN secret is correctly set to `70yT7jJURapV9qLwSaGUZM7PmvjhAqyF`
2. Verify the HMAC calculation is using SHA-512
3. Ensure the JSON payload is not modified between signature generation and verification
4. Check that content types are properly set in API requests

### Missing Environment Variables

If environment variables are not being recognized:

1. Restart the application after setting environment variables
2. Check for typos in variable names
3. Ensure the variables are set in the correct environment (development, production)

### Database Issues

If payments are not being recorded in the database:

1. Check database connection string
2. Verify table structure includes the payment fields
3. Run database migration scripts to update the schema

## Support

If you encounter any issues with the NOWPayments integration, please contact:

- NOWPayments Support: [support@nowpayments.io](mailto:support@nowpayments.io)
- Brown Bag Med Technical Support: [tech@brownbagmed.eu](mailto:tech@brownbagmed.eu)
