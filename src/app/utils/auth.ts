import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createHmac } from 'crypto';

/**
 * Verify NOWPayments HMAC signature
 * 
 * @param payload The callback payload data
 * @param signature The HMAC signature from the header
 * @returns boolean indicating if the signature is valid
 */
export function verifyNOWPaymentsSignature(
  payload: any, 
  signature: string
): boolean {
  // For testing, allow validation to be skipped in development
  if (process.env.NODE_ENV === 'development' && process.env.SKIP_HMAC_VERIFY === 'true') {
    console.warn('HMAC verification skipped in development mode');
    return true;
  }
  
  try {
    // Get IPN secret from environment variables
    const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET || '70yT7jJURapV9qLwSaGUZM7PmvjhAqyF';
    
    if (!signature) {
      console.error('HMAC signature is missing');
      return false;
    }
    
    // Create HMAC using SHA-512 and the IPN secret
    const hmac = createHmac('sha512', ipnSecret);
    
    // Generate the signature from the payload
    const computedSignature = hmac
      .update(JSON.stringify(payload))
      .digest('hex');
    
    // Compare the computed signature with the provided one
    const isValid = computedSignature === signature;
    
    if (!isValid) {
      console.error('HMAC signature verification failed');
      console.error('Expected:', computedSignature.substring(0, 16) + '...');
      console.error('Received:', signature.substring(0, 16) + '...');
    }
    
    return isValid;
  } catch (error) {
    console.error('Error verifying HMAC signature:', error);
    return false;
  }
}

/**
 * Check if the user has admin authorization
 * For now, this is a simple implementation that can be expanded later
 * 
 * @param request The incoming request
 * @returns NextResponse if authentication fails, null if authenticated
 */
export function requireAdminAuth(request: NextRequest): NextResponse | null {
  // Skip auth check in development mode for convenience
  if (process.env.NODE_ENV === 'development') {
    return null;
  }
  
  // Get auth token from cookies or Authorization header
  // Try to get from cookie using request
  const tokenFromCookie = request.cookies.get('admin_token')?.value;
  
  // Try to get from Authorization header
  const authHeader = request.headers.get('Authorization');
  const tokenFromHeader = authHeader ? authHeader.replace('Bearer ', '') : null;
  
  // Use either token
  const token = tokenFromCookie || tokenFromHeader;
  
  if (!token || token !== process.env.ADMIN_API_KEY) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  return null;
}

/**
 * Check if the user has patient authorization
 * This would be used to restrict patient access to only their own records
 * 
 * @param request The incoming request
 * @param patientId The patient ID to check against
 * @returns NextResponse if authentication fails, null if authenticated
 */
export function requirePatientAuth(request: NextRequest, patientId: string): NextResponse | null {
  // Skip auth check in development mode for convenience
  if (process.env.NODE_ENV === 'development') {
    return null;
  }
  
  // This is a placeholder for future patient authentication logic
  // In a real application, you would check patient authentication tokens
  
  // For now, we'll just return null (authorized) in all cases
  return null;
}
