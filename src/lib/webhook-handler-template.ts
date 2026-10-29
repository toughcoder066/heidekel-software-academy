/**
 * Paystack Webhook Handler (Server-Side Template)
 * 
 * This file demonstrates how to handle Paystack webhooks in a production backend.
 * In a Next.js app, this would be an API route at: app/api/webhooks/paystack/route.ts
 * 
 * IMPORTANT: Webhooks MUST be processed server-side with signature verification.
 * Never process webhooks on the client.
 */

// NOTE: In a real Next.js backend, you would import crypto:
// import crypto from 'crypto';
// This is a template file for server-side implementation.

/**
 * Webhook event types from Paystack
 */
export type PaystackWebhookEvent = 
  | 'charge.success'
  | 'charge.failed'
  | 'charge.disputed'
  | 'invoice.create'
  | 'invoice.update'
  | 'transfer.success'
  | 'transfer.failed'
  | 'transfer.reversed';

/**
 * Paystack webhook payload structure
 */
export interface PaystackWebhookPayload {
  event: PaystackWebhookEvent;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: Record<string, any>;
    log: any;
    fees: number;
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
    };
    customer: {
      id: number;
      first_name: string | null;
      last_name: string | null;
      email: string;
      customer_code: string;
      phone: string | null;
      metadata: any;
    };
  };
}

/**
 * Verify webhook signature
 * 
 * Paystack signs all webhook payloads with your secret key.
 * Always verify the signature before processing the webhook.
 * 
 * @param payload - Raw webhook body as string
 * @param signature - Signature from x-paystack-signature header
 * @param secretKey - Your Paystack secret key (from environment variable)
 * @returns true if signature is valid
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secretKey: string
): boolean {
  // In production Node.js backend:
  // const hash = crypto.createHmac('sha512', secretKey).update(payload).digest('hex');
  // return hash === signature;
  
  // This is a template - implement with your backend framework
  console.warn('⚠️  Webhook signature verification must be implemented server-side');
  return false;
}

/**
 * Process a Paystack webhook event
 * 
 * This function handles different event types and performs
 * the appropriate business logic.
 * 
 * @param event - The webhook event type
 * @param data - The event data
 * @returns Processing result
 */
export async function processWebhookEvent(
  event: PaystackWebhookEvent,
  data: PaystackWebhookPayload['data']
): Promise<{ success: boolean; message: string }> {
  
  switch (event) {
    case 'charge.success': {
      // Payment was successful
      const reference = data.reference;
      const amount = data.amount;
      const email = data.customer.email;
      
      console.log(`Payment successful: ${reference} for ${amount} from ${email}`);
      
      // TODO: In production, implement the following:
      // 1. Verify the transaction with Paystack API (GET /transaction/verify/:reference)
      // 2. Validate amount matches the expected order amount
      // 3. Validate currency matches (should be GHS)
      // 4. Check if enrollment already exists (idempotency)
      // 5. Create/update enrollment record
      // 6. Update order status to 'paid'
      // 7. Create payment record
      // 8. Send confirmation email
      // 9. Return success
      
      // Example implementation:
      /*
      const verification = await verifyTransaction(reference);
      
      if (!verification.data.status === 'success') {
        return { success: false, message: 'Transaction not successful' };
      }
      
      if (verification.data.amount !== expectedAmount) {
        return { success: false, message: 'Amount mismatch' };
      }
      
      // Check for duplicate processing
      const existingPayment = await db.payments.findByReference(reference);
      if (existingPayment) {
        return { success: true, message: 'Already processed' };
      }
      
      // Activate enrollment
      await db.enrollments.create({
        student_id: data.metadata.student_id,
        cohort_id: data.metadata.cohort_id,
        order_id: data.metadata.order_id,
        status: 'active',
        enrolled_at: new Date().toISOString(),
      });
      
      // Send confirmation email
      await sendEnrollmentConfirmation(email, data.metadata);
      */
      
      return { success: true, message: 'Payment processed successfully' };
    }
    
    case 'charge.failed': {
      // Payment failed
      const reference = data.reference;
      console.log(`Payment failed: ${reference}`);
      
      // TODO: Update order status to 'failed'
      // TODO: Send failure notification email
      
      return { success: true, message: 'Failure recorded' };
    }
    
    case 'charge.disputed': {
      // Payment disputed
      const reference = data.reference;
      console.log(`Payment disputed: ${reference}`);
      
      // TODO: Flag enrollment for review
      // TODO: Send admin notification
      
      return { success: true, message: 'Dispute recorded' };
    }
    
    default: {
      console.log(`Unhandled event type: ${event}`);
      return { success: true, message: 'Event acknowledged' };
    }
  }
}

/**
 * Example Next.js API Route Handler
 * 
 * This is how you would implement the webhook handler in Next.js App Router:
 * 
 * ```typescript
 * // app/api/webhooks/paystack/route.ts
 * 
 * import { NextRequest, NextResponse } from 'next/server';
 * import { verifyWebhookSignature, processWebhookEvent } from '@/lib/webhooks/paystack';
 * 
 * export async function POST(request: NextRequest) {
 *   try {
 *     // Get raw body
 *     const body = await request.text();
 *     
 *     // Get signature from headers
 *     const signature = request.headers.get('x-paystack-signature');
 *     
 *     if (!signature) {
 *       return NextResponse.json(
 *         { error: 'Missing signature' },
 *         { status: 401 }
 *       );
 *     }
 *     
 *     // Verify signature
 *     const secretKey = process.env.PAYSTACK_SECRET_KEY;
 *     if (!secretKey) {
 *       console.error('PAYSTACK_SECRET_KEY not configured');
 *       return NextResponse.json(
 *         { error: 'Server configuration error' },
 *         { status: 500 }
 *       );
 *     }
 *     
 *     const isValid = verifyWebhookSignature(body, signature, secretKey);
 *     if (!isValid) {
 *       return NextResponse.json(
 *         { error: 'Invalid signature' },
 *         { status: 401 }
 *       );
 *     }
 *     
 *     // Parse payload
 *     const payload = JSON.parse(body) as PaystackWebhookPayload;
 *     
 *     // Process event
 *     const result = await processWebhookEvent(payload.event, payload.data);
 *     
 *     return NextResponse.json({ received: true, ...result });
 *   } catch (error) {
 *     console.error('Webhook processing error:', error);
 *     return NextResponse.json(
 *       { error: 'Webhook processing failed' },
 *       { status: 500 }
 *     );
 *   }
 * }
 * ```
 */

/**
 * Environment variables required for Paystack integration
 * 
 * .env.local:
 * NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
 * PAYSTACK_SECRET_KEY=sk_test_xxxxx
 * PAYSTACK_WEBHOOK_SECRET=whsec_xxxxx (if using webhook signing)
 * 
 * Vercel Environment Variables:
 * - Set NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY for all environments
 * - Set PAYSTACK_SECRET_KEY for production only
 * - Set PAYSTACK_WEBHOOK_SECRET for production only
 */
