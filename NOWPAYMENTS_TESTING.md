# Testing the NOWPayments Integration

This document provides guidance on testing the NOWPayments integration in Brown Bag Med.

## Test Environment Setup

Before testing, make sure you have:

1. Set up the environment variables properly:
   ```
   NOWPAYMENTS_API_KEY="your-api-key"
   NOWPAYMENTS_IPN_SECRET="70yT7jJURapV9qLwSaGUZM7PmvjhAqyF"
   ```

2. Run the verification script:
   ```bash
   npm run verify:payments
   ```

## Test Pages

There are two test pages available for testing the payment flow:

### 1. Basic Payment Simulation
- **URL**: `/test/payment`
- **Purpose**: Simulates a basic payment flow
- **How it works**:
  - Records a payment plan for a patient
  - Simulates a successful payment
  - Updates patient record and confirms payment
  - No actual cryptocurrency transaction takes place

### 2. Advanced IPN Callback Simulation
- **URL**: `/test/simulate-callback`
- **Purpose**: Tests the NOWPayments callback endpoint with proper HMAC signatures
- **How it works**:
  - Generates a valid NOWPayments IPN callback payload
  - Creates a proper HMAC signature using the IPN secret
  - Sends the request to your endpoint for processing
  - Displays the response and status

## Testing Sequence

For a complete test of the payment system, follow these steps:

1. **As an Admin**:
   - Go to `/admin/dashboard`
   - Log in with the admin password
   - Find a patient in the list
   - Set their required plan (basic, standard, or premium)

2. **As a Patient**:
   - Go to `/alola/{patientId}` using the same patient ID
   - Verify the required plan is displayed
   - Click the payment button to generate a payment URL
   - Note the payment URL (but don't complete it - we'll use the test pages)

3. **Using the Test Simulator**:
   - Go to `/test/payment`
   - Select the same patient
   - Select the same plan type
   - Click "Simulate Payment"
   - Verify the success message

4. **Verify Payment Status**:
   - Go back to `/alola/{patientId}`
   - Verify the payment status is now "Confirmed"
   - Check that the report is now accessible

## Testing HMAC Verification

To test the HMAC signature verification:

1. Go to `/test/simulate-callback`
2. Enter the patient ID
3. Select payment status (e.g., "confirmed")
4. Click "Simulate Callback"
5. Verify the response is successful

## Common Issues and Troubleshooting

### Invalid HMAC Signature
- Check that the IPN Secret is correctly set to: `70yT7jJURapV9qLwSaGUZM7PmvjhAqyF`
- Verify the HMAC calculation is using SHA-512
- Ensure the JSON payload is not modified between signature generation and verification

### Patient Not Found
- Ensure you're using a valid patient ID
- Check that the patient exists in the database
- Verify the format of the order_id in the payment callback

### Payment Not Confirmed
- Check that the payment status is set to "confirmed" or "finished"
- Verify the callback is reaching the endpoint correctly
- Check for errors in the server logs

## Production Testing

For production, you'll need to:

1. Create a test invoice in your NOWPayments account
2. Make a small actual payment (e.g., €1)
3. Monitor the IPN callback in your server logs
4. Verify the payment is correctly recorded

## Relevant Files

- `/src/app/api/payment/nowpayments-callback/route.ts` - Handles IPN callbacks
- `/src/app/utils/nowpayments.ts` - NOWPayments service implementation
- `/scripts/verify-nowpayments-config.js` - Verifies configuration is correct
