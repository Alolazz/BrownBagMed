'use client';

import { useState } from 'react';
import { createHmac } from 'crypto';

/**
 * This page helps simulate NOWPayments IPN callbacks for testing
 * Note: Client-side HMAC generation is not secure for production, but is useful for testing
 */
export default function SimulateCallbackPage() {
  const [patientId, setPatientId] = useState('test-payment-patient');
  const [paymentStatus, setPaymentStatus] = useState('confirmed');
  const [amount, setAmount] = useState('99');
  const [currency, setCurrency] = useState('EUR');
  const [ipnSecret, setIpnSecret] = useState('70yT7jJURapV9qLwSaGUZM7PmvjhAqyF');
  
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Generate a test payload that matches the NOWPayments IPN format
   */
  const generatePayload = () => {
    const orderId = `patient-${patientId}-${Date.now()}`;
    return {
      payment_id: `test-${Date.now()}`,
      payment_status: paymentStatus,
      order_id: orderId,
      price_amount: parseFloat(amount),
      price_currency: currency,
      pay_address: '0x123456789abcdef',
      pay_amount: parseFloat(amount),
      actually_paid: parseFloat(amount),
      pay_currency: 'BTC',
      order_description: 'Medical Report',
      plan_name: paymentStatus === 'confirmed' ? 'Standard' : 'Basic',
      patient_id: patientId
    };
  };

  /**
   * Generate HMAC signature for the payload using the IPN secret
   */
  const generateHmacSignature = (payload: any): string => {
    try {
      // This is client-side only for testing purposes
      // In a real environment, HMAC signatures should only be generated server-side
      const hmacGenerator = require('crypto').createHmac('sha512', ipnSecret);
      return hmacGenerator.update(JSON.stringify(payload)).digest('hex');
    } catch (error) {
      console.error('Error generating HMAC signature:', error);
      return '';
    }
  };

  /**
   * Send a simulated NOWPayments callback to our API endpoint
   */
  const simulateCallback = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      const payload = generatePayload();
      const hmacSignature = generateHmacSignature(payload);
      
      // Send the simulated callback to our endpoint
      const response = await fetch('/api/payment/nowpayments-callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-nowpayments-sig': hmacSignature
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      setResponse(JSON.stringify({
        requestPayload: payload,
        hmacSignature: hmacSignature.substring(0, 16) + '...',
        responseStatus: response.status,
        responseData: data
      }, null, 2));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Simulate NOWPayments Callback</h1>
      <p className="mb-4 text-gray-600">
        This tool helps test the payment callback endpoint using the IPN secret: <code className="bg-gray-100 px-1">{ipnSecret}</code>
      </p>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
            <input
              type="text"
              id="patientId"
              className="w-full border rounded-md px-3 py-2 text-gray-700"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
            <select
              id="paymentStatus"
              className="w-full border rounded-md px-3 py-2 text-gray-700"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            >
              <option value="confirmed">confirmed</option>
              <option value="finished">finished</option>
              <option value="failed">failed</option>
              <option value="partially_paid">partially_paid</option>
              <option value="waiting">waiting</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="text"
              id="amount"
              className="w-full border rounded-md px-3 py-2 text-gray-700"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <input
              type="text"
              id="currency"
              className="w-full border rounded-md px-3 py-2 text-gray-700"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex justify-center mt-6">
          <button
            onClick={simulateCallback}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {loading ? 'Sending...' : 'Simulate Callback'}
          </button>
        </div>
        
        {error && (
          <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            {error}
          </div>
        )}
        
        {response && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Response</h3>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-80 text-sm">
              {response}
            </pre>
          </div>
        )}
      </div>

      <div className="mt-8 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h2 className="text-lg font-medium mb-2">Important Notes</h2>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>This tool is for testing purposes only and should not be used in production</li>
          <li>The HMAC signature is generated client-side, which is not secure for real environments</li>
          <li>Make sure your server has the IPN secret <code className="bg-gray-100 px-1">70yT7jJURapV9qLwSaGUZM7PmvjhAqyF</code> configured</li>
          <li>For production, use the actual NOWPayments IPN callback system</li>
        </ul>
      </div>
    </div>
  );
}
