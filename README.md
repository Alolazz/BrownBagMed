This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Brown Bag Med

Brown Bag Med is a medical review service that allows healthcare professionals to review patient medications and provide tailored reports. The system includes a cryptocurrency payment integration with NOWPayments.

## Getting Started

First, set up your environment variables:

1. Create a `.env.local` file in the root directory
2. Add the required variables (see Environment Variables section below)

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

The following environment variables are required:

```
DATABASE_URL="postgresql://username:password@hostname:5432/database_name"
NOWPAYMENTS_API_KEY="your-api-key"
NOWPAYMENTS_IPN_SECRET="your-ipn-secret"
ADMIN_API_KEY="secure-admin-key"
```

For more details, see [NOWPAYMENTS_ENV_SETUP.md](./NOWPAYMENTS_ENV_SETUP.md)

## Payment System

The application integrates with NOWPayments to accept cryptocurrency payments. The payment flow is as follows:

1. Healthcare professionals review patient data and set an appropriate payment plan (basic, standard, or premium)
2. Patients are presented with their required payment plan and a payment button
3. Upon clicking the payment button, patients are directed to the NOWPayments checkout page
4. After successful payment, patients can access their medical reports
5. Email notifications are sent to both patients and administrators

For detailed documentation on the payment integration, see [NOWPAYMENTS_INTEGRATION.md](./NOWPAYMENTS_INTEGRATION.md)

## Admin Dashboard

An admin dashboard is available at `/admin/dashboard` to:
- View all patients and their payment status
- Set required payment plans for patients
- Monitor payment confirmations

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
