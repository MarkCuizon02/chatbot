import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { Database } from '@/lib/model/database';
import Stripe from 'stripe';

const db = new Database();

// Webhook endpoint secret for verification
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Custom interfaces for Stripe webhook events
interface StripeInvoiceEvent {
  id: string;
  customer: string;
  subscription?: string;
  amount_due: number;
  amount_paid: number;
  currency: string;
  status: string;
  due_date?: number;
  status_transitions?: {
    paid_at?: number;
  };
  metadata?: {
    type?: string;
    credits?: string;
  };
}

interface StripeSubscriptionEvent {
  id: string;
  customer: string;
  status: string;
  items: {
    data: Array<{
      price?: {
        id?: string;
      };
    }>;
  };
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  canceled_at?: number;
}

interface StripePaymentIntentEvent {
  id: string;
  customer?: string;
  metadata?: {
    type?: string;
    credits?: string;
  };
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (!endpointSecret || !sig) {
      console.log('Missing webhook secret or signature');
      return NextResponse.json({ error: 'Webhook secret or signature missing' }, { status: 400 });
    }

    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.log(`Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 });
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as StripeInvoiceEvent);
        break;
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as StripeInvoiceEvent);
        break;
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as unknown as StripeSubscriptionEvent);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as unknown as StripeSubscriptionEvent);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as unknown as StripeSubscriptionEvent);
        break;
      
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as StripePaymentIntentEvent);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Error processing webhook' }, { status: 500 });
  }
}

async function handleInvoicePaymentSucceeded(invoice: StripeInvoiceEvent) {
  try {
    console.log('Processing successful invoice payment:', invoice.id);

    // Find the account by Stripe customer ID using Database abstraction
    const account = await db.account.getAccountByStripeCustomerId(invoice.customer);

    if (!account) {
      console.error('Account not found for Stripe customer:', invoice.customer);
      return;
    }

    // Check if invoice already exists to prevent duplicates
    const existingInvoice = await db.invoice.getInvoiceByStripeId(invoice.id);

    if (existingInvoice) {
      console.log('Invoice already exists:', invoice.id);
      return;
    }

    // Create invoice record in database
    const invoiceData = {
      accountId: account.id,
      subscriptionId: invoice.subscription || undefined,
      stripeInvoiceId: invoice.id,
      amountDue: invoice.amount_due / 100, // Convert from cents
      amountPaid: invoice.amount_paid / 100, // Convert from cents
      currency: invoice.currency,
      status: invoice.status,
      dueDate: invoice.due_date ? new Date(invoice.due_date * 1000) : undefined,
      paidAt: invoice.status_transitions?.paid_at ? new Date(invoice.status_transitions.paid_at * 1000) : new Date(),
    };

    const newInvoice = await db.invoice.createInvoice(invoiceData);

    // If this is a credit purchase (one-time payment), add credits to account
    if (invoice.metadata?.type === 'credit_purchase' && invoice.metadata?.credits) {
      const creditsToAdd = parseFloat(invoice.metadata.credits);
      
      await db.account.updateAccountCredits(account.id, creditsToAdd);

      console.log(`Added ${creditsToAdd} credits to account ${account.id}`);
    }

    console.log('Successfully created invoice:', newInvoice?.id);
    
  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
    throw error;
  }
}

async function handleInvoicePaymentFailed(invoice: StripeInvoiceEvent) {
  try {
    console.log('Processing failed invoice payment:', invoice.id);
    
    // Find the account by Stripe customer ID using Database abstraction
    const account = await db.account.getAccountByStripeCustomerId(invoice.customer);

    if (!account) {
      console.error('Account not found for Stripe customer:', invoice.customer);
      return;
    }

    // Only update existing invoice, don't create new one on failure
    const existingInvoice = await db.invoice.getInvoiceByStripeId(invoice.id);

    if (existingInvoice) {
      await db.invoice.updateInvoiceStatus(invoice.id, 'payment_failed');
    }

    console.log('Updated failed payment status for invoice:', invoice.id);
    
  } catch (error) {
    console.error('Error handling invoice payment failed:', error);
    throw error;
  }
}

async function handleSubscriptionCreated(subscription: StripeSubscriptionEvent) {
  try {
    console.log('Processing subscription created:', subscription.id);

    // Find the account by Stripe customer ID using Database abstraction
    const account = await db.account.getAccountByStripeCustomerId(subscription.customer);

    if (!account) {
      console.error('Account not found for Stripe customer:', subscription.customer);
      return;
    }

    // Create or update subscription record using Database abstraction
    await db.subscription.upsertSubscription(subscription.id, {
      accountId: account.id,
      stripeCustomerId: subscription.customer,
      status: mapStripeStatusToPrisma(subscription.status),
      stripePriceId: subscription.items.data[0]?.price?.id,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : undefined,
    });

    console.log('Successfully created/updated subscription:', subscription.id);
    
  } catch (error) {
    console.error('Error handling subscription created:', error);
    throw error;
  }
}

async function handleSubscriptionUpdated(subscription: StripeSubscriptionEvent) {
  try {
    console.log('Processing subscription updated:', subscription.id);

    await db.subscription.updateSubscriptionByStripeId(subscription.id, {
      status: mapStripeStatusToPrisma(subscription.status),
      stripePriceId: subscription.items.data[0]?.price?.id,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : undefined,
    });

    console.log('Successfully updated subscription:', subscription.id);
    
  } catch (error) {
    console.error('Error handling subscription updated:', error);
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription: StripeSubscriptionEvent) {
  try {
    console.log('Processing subscription deleted:', subscription.id);

    await db.subscription.updateSubscriptionByStripeId(subscription.id, {
      status: 'CANCELED',
      canceledAt: new Date(),
    });

    console.log('Successfully marked subscription as canceled:', subscription.id);
    
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
    throw error;
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: StripePaymentIntentEvent) {
  try {
    console.log('Processing payment intent succeeded:', paymentIntent.id);

    // Check if this is a credit purchase based on metadata
    if (paymentIntent.metadata?.type === 'credit_purchase' && paymentIntent.metadata?.credits && paymentIntent.customer) {
      // Find the account by Stripe customer ID using Database abstraction
      const account = await db.account.getAccountByStripeCustomerId(paymentIntent.customer);

      if (!account) {
        console.error('Account not found for Stripe customer:', paymentIntent.customer);
        return;
      }

      const creditsToAdd = parseFloat(paymentIntent.metadata.credits);
      
      await db.account.updateAccountCredits(account.id, creditsToAdd);

      console.log(`Added ${creditsToAdd} credits to account ${account.id} from payment intent`);
    }
    
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error);
    throw error;
  }
}

// Helper function to map Stripe subscription status to Prisma enum
function mapStripeStatusToPrisma(stripeStatus: string) {
  switch (stripeStatus) {
    case 'active':
      return 'ACTIVE';
    case 'canceled':
      return 'CANCELED';
    case 'past_due':
      return 'PAST_DUE';
    case 'unpaid':
      return 'UNPAID';
    case 'trialing':
      return 'TRIALING';
    default:
      return 'ACTIVE';
  }
}
