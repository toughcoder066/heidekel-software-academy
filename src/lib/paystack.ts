/**
 * Paystack Integration Service
 * 
 * This module handles Paystack payment integration using the official Inline JS v2.
 * 
 * IMPORTANT: In production, transaction verification MUST happen server-side.
 * The frontend should only initiate payments and receive callbacks.
 * Server-side verification ensures:
 * - Payment amounts cannot be manipulated
 * - Transaction status is authoritative
 * - Webhook signatures are validated
 * - Enrollment is only activated after verified payment
 */



// Paystack public key (from environment variable)
// In production, this would be: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

// Currency for transactions
const CURRENCY = 'GHS';

/**
 * Payment initialization options
 */
export interface PaymentInitOptions {
  email: string;
  amount: number; // Amount in minor units (pesewas for GHS)
  reference: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  metadata?: Record<string, any>;
}

/**
 * Payment success callback data
 */
export interface PaymentSuccessData {
  reference: string;
  trans: string;
  status: string;
  message: string;
  transaction: string;
  trxref: string;
}

/**
 * Initialize a Paystack payment using Inline JS v2
 * 
 * @param options - Payment initialization options
 * @param onSuccess - Callback when payment succeeds
 * @param onCancel - Callback when user cancels
 * @param onError - Callback when payment fails
 * @returns Promise that resolves when payment flow completes
 */
export async function initializePayment(
  options: PaymentInitOptions,
  onSuccess: (data: PaymentSuccessData) => void,
  onCancel: () => void,
  onError: (error: Error) => void
): Promise<void> {
  // Dynamically import Paystack to avoid SSR issues
  const Paystack = (await import('@paystack/inline-js')).default;

  const popup = new Paystack();

  // Configure payment options
  const paystackOptions = {
    key: PAYSTACK_PUBLIC_KEY,
    email: options.email,
    amount: options.amount,
    currency: CURRENCY,
    reference: options.reference,
    firstName: options.firstName,
    lastName: options.lastName,
    phone: options.phone,
    metadata: {
      custom_fields: [
        {
          display_name: 'Platform',
          variable_name: 'platform',
          value: 'Heidekel Software Academy',
        },
        ...Object.entries(options.metadata || {}).map(([key, value]) => ({
          display_name: key,
          variable_name: key,
          value: String(value),
        })),
      ],
    },
    channels: ['card', 'mobile_money'], // Support cards and Mobile Money
    onSuccess: (transaction: PaymentSuccessData) => {
      onSuccess(transaction);
    },
    onCancel: () => {
      onCancel();
    },
    onError: (error: any) => {
      onError(new Error(error.message || 'Payment failed'));
    },
  } as any; // Type assertion needed due to Paystack's dynamic API

  // Initialize the payment
  popup.checkout(paystackOptions);
}

/**
 * Generate a unique payment reference
 * Format: HEIDEKEL-{timestamp}-{random}
 */
export function generatePaymentReference(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `HEIDEKEL-${timestamp}-${random}`;
}

/**
 * Convert GHS amount to minor units (pesewas)
 * Example: 350.00 GHS = 35000 pesewas
 */
export function toMinorUnits(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Convert minor units (pesewas) to GHS
 * Example: 35000 pesewas = 350.00 GHS
 */
export function fromMinorUnits(amount: number): number {
  return amount / 100;
}

/**
 * Verify a transaction (SERVER-SIDE ONLY)
 * 
 * IMPORTANT: This function should ONLY be called from server-side code.
 * Never expose your secret key to the client.
 * 
 * In a real Next.js/Express backend, this would be:
 * 
 * ```typescript
 * const response = await fetch(
 *   `https://api.paystack.co/transaction/verify/${reference}`,
 *   {
 *     headers: {
 *       'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
 *       'Content-Type': 'application/json',
 *     },
 *   }
 * );
 * const data = await response.json();
 * return data;
 * ```
 * 
 * @param reference - Transaction reference to verify
 * @returns Verification result (mock for demo)
 */
export async function verifyTransaction(reference: string): Promise<{
  status: boolean;
  message: string;
  data: {
    status: string;
    paid: boolean;
    amount: number;
    currency: string;
    reference: string;
    gateway_response: string;
    paid_at: string;
  };
}> {
  // MOCK VERIFICATION FOR DEMO
  // In production, this MUST be server-side with secret key
  
  console.warn('⚠️  WARNING: Transaction verification is mocked in this demo.');
  console.warn('In production, verification MUST happen server-side using your Paystack secret key.');
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock successful verification
  return {
    status: true,
    message: 'Verification successful',
    data: {
      status: 'success',
      paid: true,
      amount: 35000, // Mock amount
      currency: CURRENCY,
      reference: reference,
      gateway_response: 'Approved',
      paid_at: new Date().toISOString(),
    },
  };
}

/**
 * Process a webhook from Paystack (SERVER-SIDE ONLY)
 * 
 * IMPORTANT: This function should ONLY be called from server-side code.
 * Webhooks must be verified using the secret key to validate the signature.
 * 
 * In a real Next.js API route:
 * 
 * ```typescript
 * import crypto from 'crypto';
 * 
 * export async function POST(request: Request) {
 *   const body = await request.text();
 *   const signature = request.headers.get('x-paystack-signature');
 *   
 *   // Verify webhook signature
 *   const hash = crypto
 *     .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
 *     .update(body)
 *     .digest('hex');
 *   
 *   if (hash !== signature) {
 *     return new Response('Invalid signature', { status: 401 });
 *   }
 *   
 *   const event = JSON.parse(body);
 *   
 *   // Process the event
 *   if (event.event === 'charge.success') {
 *     const reference = event.data.reference;
 *     // Verify transaction and activate enrollment
 *     await verifyAndActivateEnrollment(reference);
 *   }
 *   
 *   return new Response('Webhook received', { status: 200 });
 * }
 * ```
 */
export function processWebhook(payload: any): void {
  console.warn('⚠️  WARNING: Webhook processing is not implemented in this demo.');
  console.warn('In production, implement server-side webhook handling with signature verification.');
  
  // Webhook event types:
  // - charge.success: Payment successful
  // - charge.failed: Payment failed
  // - transfer.success: Transfer successful
  // - invoice.update: Invoice updated
  
  if (payload.event === 'charge.success') {
    const reference = payload.data.reference;
    console.log('Payment successful:', reference);
    // In production: verify transaction and activate enrollment
  }
}

/**
 * Check if Paystack is properly configured
 */
export function isPaystackConfigured(): boolean {
  return PAYSTACK_PUBLIC_KEY !== 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
}

/**
 * Get Paystack configuration status
 */
export function getPaystackStatus(): {
  configured: boolean;
  mode: 'test' | 'live' | 'demo';
  message: string;
} {
  if (!isPaystackConfigured()) {
    return {
      configured: false,
      mode: 'demo',
      message: 'Paystack is not configured. Set VITE_PAYSTACK_PUBLIC_KEY environment variable.',
    };
  }
  
  const isLive = PAYSTACK_PUBLIC_KEY.startsWith('pk_live_');
  
  return {
    configured: true,
    mode: isLive ? 'live' : 'test',
    message: isLive 
      ? 'Paystack is configured in LIVE mode' 
      : 'Paystack is configured in TEST mode',
  };
}
