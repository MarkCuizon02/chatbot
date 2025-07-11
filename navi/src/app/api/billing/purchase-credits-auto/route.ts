import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/model/database';
import { getCreditPackPrice } from '@/lib/creditPricing';
import { processAutomaticCreditPurchase, getCustomerDefaultPaymentMethod } from '@/lib/stripe';
import { prisma } from '@/lib/db';

const db = new Database();

export async function POST(request: NextRequest) {
  console.log('🚀 Automatic Credit Purchase API called');
  
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

    // Get user information for the account
    const userAccount = await db.account.getUserAccountForAccount(account.id);
    if (!userAccount?.user?.email) {
      return NextResponse.json(
        { error: 'User email not found for account' },
        { status: 400 }
      );
    }

    // Calculate price using the new pricing system
    let totalPrice = getCreditPackPrice(credits);
    
    // Apply 20% discount if requested (for monthly subscribers)
    if (applyDiscount) {
      totalPrice = totalPrice * 0.8;
    }

    console.log('💰 Processing automatic payment...');
    console.log(`Credits: ${credits}, Price: $${totalPrice}, Discount: ${applyDiscount ? '20%' : 'None'}`);

    // Process automatic credit purchase using stored payment method
    const paymentResult = await processAutomaticCreditPurchase({
      email: userAccount.user.email,
      accountId: account.id.toString(),
      credits,
      amount: totalPrice,
      description: `Automatic credit purchase: ${credits} credits${applyDiscount ? ' (20% subscriber discount)' : ''}`,
    });

    if (!paymentResult.success) {
      console.log('❌ Payment failed:', paymentResult);
      return NextResponse.json(
        { 
          error: 'Payment failed', 
          details: paymentResult.message,
          requiresPaymentMethodSetup: paymentResult.message.includes('No payment methods available')
        },
        { status: 402 } // Payment Required
      );
    }

    console.log('✅ Payment successful, adding credits to user...');

    // Add credits to the user (not account) since credits are stored on User model
    const userToUpdate = userAccount.user;
    
    // Update user credits directly using Prisma
    const updatedUser = await prisma.user.update({
      where: { id: userToUpdate.id },
      data: {
        credits: {
          increment: credits
        }
      }
    });
    
    console.log('🎉 Credits added successfully!');
    console.log(`User ${userToUpdate.email} now has ${updatedUser.credits} credits`);

    return NextResponse.json({
      success: true,
      status: 'completed',
      data: {
        paymentId: paymentResult.payment_id,
        creditsAdded: credits,
        totalPrice: totalPrice,
        discountApplied: applyDiscount,
        newCreditBalance: updatedUser.credits,
        message: `✅ Successfully charged $${paymentResult.amount_charged} and added ${credits} credits to your account`,
        amountCharged: paymentResult.amount_charged,
        paymentStatus: paymentResult.status,
        customerId: paymentResult.customer_id,
      },
    });

  } catch (error: unknown) {
    console.error('Error in automatic credit purchase:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';
    
    console.error('Full error details:', {
      message: errorMessage,
      stack: errorStack,
      error: error
    });

    // Check if this is a payment method issue
    const requiresPaymentMethodSetup = errorMessage.includes('No payment methods available') || 
                                      errorMessage.includes('payment method');
    
    return NextResponse.json(
      { 
        error: 'Failed to process automatic credit purchase', 
        details: errorMessage,
        requiresPaymentMethodSetup,
        timestamp: new Date().toISOString(),
        suggestion: requiresPaymentMethodSetup 
          ? 'Please add a payment method at /billing/cards before making purchases'
          : 'Please try again or contact support if the issue persists'
      },
      { status: requiresPaymentMethodSetup ? 402 : 500 }
    );
  }
}

// GET endpoint to check payment method status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');

    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }

    // Get the account
    const account = await db.account.getAccountById(parseInt(accountId));
    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    // Check if account has a Stripe customer ID
    if (!account.stripCustomerId) {
      return NextResponse.json({
        hasPaymentMethod: false,
        message: 'No payment methods set up',
        requiresSetup: true
      });
    }

    // Get default payment method
    try {
      const defaultPaymentMethod = await getCustomerDefaultPaymentMethod(account.stripCustomerId);
      
      return NextResponse.json({
        hasPaymentMethod: !!defaultPaymentMethod,
        paymentMethod: defaultPaymentMethod ? {
          id: defaultPaymentMethod.id,
          type: defaultPaymentMethod.type,
          last4: (defaultPaymentMethod as { card?: { last4?: string; brand?: string } }).card?.last4,
          brand: (defaultPaymentMethod as { card?: { last4?: string; brand?: string } }).card?.brand,
        } : null,
        requiresSetup: !defaultPaymentMethod
      });
    } catch {
      return NextResponse.json({
        hasPaymentMethod: false,
        message: 'Error checking payment methods',
        requiresSetup: true
      });
    }

  } catch (error) {
    console.error('Error checking payment method status:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { error: 'Failed to check payment method status', details: errorMessage },
      { status: 500 }
    );
  }
}
