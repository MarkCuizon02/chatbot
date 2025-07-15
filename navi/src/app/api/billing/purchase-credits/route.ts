import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/model/database';
import { getCreditPackPrice } from '@/lib/navi/creditPricing';
import { createCustomer, oneTimePayment } from '@/lib/navi/stripe';

const db = new Database('prisma');

export async function POST(request: NextRequest) {
  console.log('🔧 Purchase Credits API called');
  
  try {
    const body = await request.json();
    console.log('📝 Request body:', body);
    
    const { accountId, credits, applyDiscount = false } = body;

    if (!accountId || !credits) {
      console.log('❌ Missing required fields:', { accountId, credits });
      return NextResponse.json(
        { error: 'Account ID and credits are required' },
        { status: 400 }
      );
    }

    console.log('🔍 Looking up account with ID:', accountId);
    // Get the account by its ID
    const account = await db.account.getAccountById(accountId);

    if (!account) {
      console.log('❌ Account not found for ID:', accountId);
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    console.log('✅ Account found:', account.name, 'ID:', account.id);

    // Calculate price using the new pricing system
    let totalPrice = getCreditPackPrice(credits);
    
    // Apply 20% discount if requested (for monthly subscribers)
    if (applyDiscount) {
      totalPrice = totalPrice * 0.8;
    }

    // Get or create Stripe customer if needed
    let stripeCustomerId = account.stripCustomerId;
    if (!stripeCustomerId) {
      // Get account owner to get user email
      const accountOwner = await db.account.getAccountOwner(account.id);
      if (!accountOwner?.email) {
        return NextResponse.json(
          { error: 'User email not found for account' },
          { status: 400 }
        );
      }

      const customerResult = await createCustomer({
        email: accountOwner.email,
        fname: accountOwner.firstname || '',
        lname: accountOwner.lastname || '',
        phone: ''
      });

      if ('error_message' in customerResult) {
        return NextResponse.json(
          { error: 'Failed to create Stripe customer', details: customerResult.error_message },
          { status: 500 }
        );
      }

      stripeCustomerId = customerResult.customer_id;
      
      // Update account with Stripe customer ID using updateAccount
      await db.account.updateAccount(account.id, { 
        stripCustomerId: stripeCustomerId 
      });
    }

    // Create Stripe Payment Intent for credit purchase
    const paymentResult = await oneTimePayment({
      customer_id: stripeCustomerId,
      amount: totalPrice,
      description: `Purchase ${credits} credits`,
      metadata: {
        type: 'credit_purchase',
        credits: credits.toString(),
        accountId: account.id.toString()
      }
    });

    if ('error_message' in paymentResult) {
      return NextResponse.json(
        { error: 'Failed to create payment intent', details: paymentResult.error_message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      status: 'payment_intent_created',
      data: {
        paymentId: paymentResult.payment_id,
        clientSecret: paymentResult.client_secret,
        pendingCredits: credits,
        totalPrice: totalPrice,
        discountApplied: applyDiscount,
        message: '⏳ Payment Intent created. Credits will be added ONLY after successful payment completion.',
        nextStep: 'Complete payment using the clientSecret to receive credits',
        creditsAddedImmediately: false
      },
    });

  } catch (error: unknown) {
    console.error('Error purchasing credits:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';
    
    console.error('Full error details:', {
      message: errorMessage,
      stack: errorStack,
      error: error
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to purchase credits', 
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 