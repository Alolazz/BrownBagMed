import { createHmac } from 'crypto';

interface IpnCallbackData {
  payment_id: string;
  payment_status: string;
  order_id: string;
  price_amount: number;
  price_currency: string;
  pay_address: string;
  pay_amount: number;
  actually_paid: number;
  pay_currency: string;
  order_description?: string;
  purchase_id?: string;
  // Additional fields specific to our implementation
  plan_name?: string;
  patient_id?: string;
}

interface ProcessedPayment {
  paymentId: string;
  patientId: string;
  status: string;
  amount: number;
  currency: string;
  isPaid: boolean;
  planType?: string;
}

class NOWPaymentsService {
  private static readonly API_BASE_URL = 'https://api.nowpayments.io/v1';
  private static readonly API_KEY = process.env.NOWPAYMENTS_API_KEY || '';
  // Use the new IPN secret for HMAC verification
  private static readonly IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET || '70yT7jJURapV9qLwSaGUZM7PmvjhAqyF';

  /**
   * Process IPN (Instant Payment Notification) callback from NOWPayments
   * @param data The callback data from NOWPayments
   * @param hmacHeader The HMAC header for verification
   * @returns Processed payment information
   */
  public static async processIpnCallback(
    data: IpnCallbackData,
    hmacHeader: string
  ): Promise<ProcessedPayment> {
    // Verify the HMAC signature when in production
    if (process.env.NODE_ENV === 'production') {
      this.verifyHmacSignature(data, hmacHeader);
    }

    // Extract the patient ID from the order_id
    // Format is expected to be: patient-{patientId}-{timestamp}
    let patientId = '';
    if (data.order_id) {
      const orderParts = data.order_id.split('-');
      if (orderParts.length >= 2 && orderParts[0] === 'patient') {
        patientId = orderParts[1];
      }
    }

    // Fall back to the patient_id field if provided
    if (!patientId && data.patient_id) {
      patientId = data.patient_id;
    }

    // Check if payment is completed
    const isPaid = ['finished', 'confirmed', 'complete', 'partially_paid'].includes(data.payment_status);

    return {
      paymentId: data.payment_id,
      patientId,
      status: data.payment_status,
      amount: data.price_amount,
      currency: data.price_currency,
      isPaid
    };
  }

  /**
   * Verify HMAC signature from NOWPayments
   * @param data The callback data
   * @param signature The HMAC signature from the header
   * @returns True if verification is successful, throws an error otherwise
   */
  private static verifyHmacSignature(data: any, signature: string): boolean {
    if (!this.IPN_SECRET) {
      throw new Error('NOWPAYMENTS_IPN_SECRET is not defined');
    }

    if (!signature) {
      throw new Error('HMAC signature is missing');
    }

    const hmac = createHmac('sha512', this.IPN_SECRET);
    const computedSignature = hmac
      .update(JSON.stringify(data))
      .digest('hex');

    if (computedSignature !== signature) {
      throw new Error('HMAC signature verification failed');
    }

    return true;
  }

  /**
   * Create a payment URL for a specific plan
   * Note: In a real implementation, this would integrate with the NOWPayments API
   * For simplicity, we're using hardcoded payment URLs defined in the frontend
   */
  public static getPaymentUrl(planType: string): string | null {
    const paymentPlans = {
      basic: 'https://nowpayments.io/payment/?iid=4616546662',
      standard: 'https://nowpayments.io/payment/?iid=5146587257',
      premium: 'https://nowpayments.io/payment/?iid=6107793181'
    };

    return paymentPlans[planType as keyof typeof paymentPlans] || null;
  }

  /**
   * Create an invoice using the NOWPayments API
   * This would be used in a production environment where you need dynamic prices
   * and want to track specific order details
   */
  public static async createInvoice(
    patientId: string,
    planType: string,
    amount: number,
    currency = 'EUR'
  ): Promise<{ paymentUrl: string; invoiceId: string } | null> {
    // This is a placeholder implementation
    // In production, you would make an API call to NOWPayments /invoice endpoint
    
    if (!this.API_KEY) {
      throw new Error('NOWPAYMENTS_API_KEY is not defined');
    }
    
    try {
      // Mock API call - replace with actual implementation
      const orderId = `patient-${patientId}-${Date.now()}`;
      const paymentUrl = this.getPaymentUrl(planType);
      
      return {
        paymentUrl: paymentUrl || '',
        invoiceId: `mock-invoice-${Date.now()}`
      };
    } catch (error) {
      console.error('Failed to create NOWPayments invoice:', error);
      return null;
    }
  }
}

export default NOWPaymentsService;
