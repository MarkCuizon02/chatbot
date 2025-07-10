import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { Database } from '@/lib/model/database';
import { prisma } from '@/lib/db';
import Stripe from 'stripe';

const db = new Database();

// This is the webhook secret from your Stripe Dashboard
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  console.log('🔔 Stripe webhook received');
  
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('❌ No Stripe signature found');
    return new Response('No signature', { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log('✅ Webhook signature verified');
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err);
    return new Response(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`, {
      status: 400,
    });
  }

  console.log(`📨 Received event: ${event.type}`);

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      
      default:
        console.log(`🤷‍♂️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    return new Response(
      `Webhook Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { status: 500 }
    );
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('💰 Payment Intent succeeded:', paymentIntent.id);
  
  const { metadata } = paymentIntent;
  
  // Check if this is a credit purchase
  if (metadata?.type === 'credit_purchase' && metadata?.credits && metadata?.accountId) {
    const credits = parseInt(metadata.credits);
    const accountId = parseInt(metadata.accountId);
    
    try {
      // Get the account and associated user
      const account = await db.account.getAccountById(accountId);
      if (!account) {
        console.error('❌ Account not found for credit purchase:', accountId);
        return;
      }

      const userAccount = await db.account.getUserAccountForAccount(accountId);
      if (!userAccount?.user) {
        console.error('❌ User not found for account:', accountId);
        return;
      }

      // Add credits to the user
      const updatedUser = await prisma.user.update({
        where: { id: userAccount.user.id },
        data: {
          credits: {
            increment: credits
          }
        }
      });

      console.log(`✅ Added ${credits} credits to user ${userAccount.user.email}`);
      console.log(`💳 User now has ${updatedUser.credits} total credits`);
      
      // You could also log this transaction to a Transaction table if needed
      // await logTransaction({
      //   userId: userAccount.user.id,
      //   accountId: accountId,
      //   type: 'credit_purchase',
      //   amount: amount / 100, // Convert from cents
      //   credits: credits,
      //   stripePaymentIntentId: paymentIntent.id,
      //   status: 'completed'
      // });

    } catch (error) {
      console.error('❌ Error processing credit purchase:', error);
      throw error;
    }
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('❌ Payment Intent failed:', paymentIntent.id);
  
  const { metadata } = paymentIntent;
  
  if (metadata?.type === 'credit_purchase') {
    console.log('💸 Credit purchase payment failed for:', metadata);
    // You might want to notify the user or log this failure
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('📄 Invoice payment succeeded:', invoice.id);
  
  // Handle subscription invoice payments here if needed
  // This is typically for recurring subscription charges
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('🔄 Subscription updated:', subscription.id);
  // TODO: Implement subscription update logic
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('🗑️ Subscription deleted:', subscription.id);
  // TODO: Implement subscription deletion logic
}
