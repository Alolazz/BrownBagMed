# NowPayments Environment Setup

This guide details how to set up the required environment variables for NowPayments integration with Brown Bag Med.

## Required Environment Variables

Add the following environment variables to your `.env.local` file for development and to your Vercel project for production:

```dotenv
# Database Configuration
DATABASE_URL="postgresql://username:password@hostname:5432/database_name"

# NowPayments API Configuration
NOWPAYMENTS_API_KEY="your-api-key-from-nowpayments"
NOWPAYMENTS_IPN_SECRET="your-ipn-secret-from-nowpayments"

# Admin Authentication
ADMIN_API_KEY="secure-admin-key-for-protected-routes"

# Email Configuration (when ready to implement)
EMAIL_FROM="noreply@brownbagmed.eu"
EMAIL_SERVER="smtp.your-provider.com"
EMAIL_PORT=587
EMAIL_USERNAME="your-smtp-username"
EMAIL_PASSWORD="your-smtp-password"

# Application URLs
NEXTAUTH_URL="https://your-production-url.com" # Production URL
VERCEL_URL="https://your-production-url.com"    # Vercel deployment URL
```

## Setting up NowPayments Account

1. Register for a NowPayments account at [https://nowpayments.io](https://nowpayments.io)
2. Complete verification process
3. Create API keys:
   - Go to Account Settings > API Keys
   - Generate a new API key
   - Copy the API key and add it to your environment variables

4. Set up IPN (Instant Payment Notification):
   - Go to Account Settings > IPN
   - Add a new IPN URL: `https://your-domain.com/api/payment/nowpayments-callback`
   - Generate an IPN secret
   - Copy the IPN secret and add it to your environment variables

## Testing in Development

For local development, you can use the test endpoint:
```
POST /api/test/simulate-payment
Body: { "patientId": "patient-uuid", "planType": "basic" }
```

This will simulate a successful payment without needing to process a real cryptocurrency payment.

## Vercel Environment Variables

To add these environment variables to your Vercel deployment:

1. Go to your project in the Vercel dashboard
2. Navigate to Settings > Environment Variables
3. Add each of the above variables
4. Redeploy your application to apply the changes

## Troubleshooting

- Ensure your database URL is correctly formatted for PostgreSQL
- Double-check that your API keys are correctly copied from NowPayments
- If payments aren't being confirmed, check your NowPayments IPN logs for delivery status
- For local testing, ensure your database schema is up to date with `npx prisma db push`
