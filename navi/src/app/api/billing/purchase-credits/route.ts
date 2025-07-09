import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/model/database';
import { getCreditPackPrice } from '@/lib/creditPricing';
import { createCustomer, oneTimePayment } from '@/lib/stripe';

const db = new Database();

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
      // We need user email to create customer - get it from account
      const userAccount = await db.account.getUserAccountForAccount(account.id);
      if (!userAccount?.user?.email) {
        return NextResponse.json(
          { error: 'User email not found for account' },
          { status: 400 }
        );
      }

      const customerResult = await createCustomer({
        email: userAccount.user.email,
        fname: userAccount.user.firstname || '',
        lname: userAccount.user.lastname || '',
        phone: ''
      });

      if ('error_message' in customerResult) {
        return NextResponse.json(
          { error: 'Failed to create Stripe customer', details: customerResult.error_message },
          { status: 500 }
        );
      }

      stripeCustomerId = customerResult.customer_id;
      
      // Update account with Stripe customer ID
      await db.account.updateAccountStripeCustomerId(account.id, stripeCustomerId);
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
      data: {
        paymentId: paymentResult.payment_id,
        clientSecret: paymentResult.client_secret,
        credits: credits,
        totalPrice: totalPrice,
        discountApplied: applyDiscount,
        message: 'Payment intent created successfully! Complete payment to receive credits.',
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