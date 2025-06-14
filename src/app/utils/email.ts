
/**
 * Email utility functions for Brown Bag Med
 * 
 * In production, integrate with a real email service provider.
 * For now, we'll just log the emails to the console.
 */

/**
 * Send a payment confirmation email to the patient
 */
export async function sendPaymentConfirmationEmail(
  email: string,
  patientId: string,
  planName: string,
  amount: number | string,
  currency: string
): Promise<boolean> {
  try {
    // In production, integrate with an email service provider
    // For now, just log the email details
    console.log('==================== PAYMENT CONFIRMATION EMAIL ====================');
    console.log(`To: ${email}`);
    console.log(`Subject: Your Brown Bag Med Payment Confirmation`);
    console.log(`
Dear Patient,

Thank you for your payment of ${amount} ${currency} for the ${planName} plan.

Your medical report is now available. You can access it at:
${process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000'}/alola/${patientId}

If you have any questions, please contact us at contact@brownbagmed.eu

Best regards,
The Brown Bag Med Team
    `);
    console.log('==================================================================');
    return true;
  } catch (error) {
    console.error('Failed to send payment confirmation email:', error);
    return false;
  }
}

/**
 * Send a payment notification email to the admin
 */
export async function sendAdminPaymentNotification(
  patientId: string,
  patientName: string,
  planName: string,
  amount: number | string,
  currency: string
): Promise<boolean> {
  try {
    // In production, integrate with an email service provider
    // For now, just log the email details
    console.log('=============== ADMIN PAYMENT NOTIFICATION EMAIL =================');
    console.log(`To: admin@brownbagmed.eu`);
    console.log(`Subject: New Payment Received - Patient ${patientId}`);
    console.log(`
New payment received:

Patient ID: ${patientId}
Patient: ${patientName}
Plan: ${planName}
Amount: ${amount} ${currency}
Date: ${new Date().toISOString()}

Access the admin dashboard to review this payment.
    `);
    console.log('==================================================================');
    return true;
  } catch (error) {
    console.error('Failed to send admin payment notification email:', error);
    return false;
  }
}
