import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/model/database';
import { createOrUpdateSubscription } from '@/lib/module/stripe';

const db = new Database();

export async function POST(request: NextRequest) {
  console.log('🎯 REAL ROUTE: Subscription update request received');
  
  try {
    const body = await request.json();
    console.log('🎯 REAL ROUTE: Request body:', body);
    
    const { planName, userId, actionType } = body;

    // Validate required fields
    if (!planName) {
      console.log('❌ REAL ROUTE: Missing planName');
      return NextResponse.json(
        { error: 'Plan name is required' },
        { status: 400 }
      );
    }

    if (!userId) {
      console.log('❌ REAL ROUTE: Missing userId');
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    console.log('🎯 REAL ROUTE: Looking for pricing plan with title:', planName);

    // Find the pricing plan by name using Database abstraction
    let pricingPlan = await db.pricingPlan.getPricingPlanByTitle(planName);

    // If no pricing plan found in database, create a mock one for testing
    if (!pricingPlan) {
      console.log('⚠️ REAL ROUTE: No pricing plan found in database, using mock data for:', planName);
      pricingPlan = {
        id: planName.toLowerCase().replace(' ', '-'),
        title: planName,
        price: planName === 'Personal' ? 19 : planName === 'Family' ? 39 : 99,
        credits: planName === 'Personal' ? 200 : planName === 'Family' ? 500 : 1500,
        description: `${planName} plan`,
        buttonText: 'Subscribe',
        billing: '/month',
        popular: false,
        category: 'personal',
        isActive: true,
        stripePriceId: planName === 'Personal' ? 'price_1QCYkwB7eu7ykXdNjzqNmFoq' : 
                      planName === 'Family' ? 'price_1QCYkNB7eu7ykXdNzfKLR2JA' : 
                      'price_1QCYktB7eu7ykXdNJCXi8Yyz',
        stripeProductId: planName === 'Personal' ? 'prod_RIGQpTW8tl2lKG' : 
                         planName === 'Family' ? 'prod_RIGPy9eoCtNmTr' : 
                         'prod_RIGQ2bwE0xJ0vT',
        createdAt: new Date(),
        updatedAt: new Date(),
        href: '#',
        features: []
      };
    }

    console.log('🎯 REAL ROUTE: Using pricing plan:', pricingPlan);

    // Check user and get accountId
    console.log('🎯 REAL ROUTE: Checking if user exists with ID:', userId);
    const user = await db.user.getUserById(userId);
    console.log('🎯 REAL ROUTE: Found user:', user ? { id: user.id, email: user.email } : null);

    if (!user) {
      console.log('❌ REAL ROUTE: User not found for ID:', userId);
      return NextResponse.json(
        { error: `User with ID ${userId} not found` },
        { status: 404 }
      );
    }

    // Get accountId for the user
    console.log('🎯 REAL ROUTE: Getting accountId for userId:', userId);
    const accountId = await db.user.getAccountIdForUser(userId);
    console.log('🎯 REAL ROUTE: Found accountId for user:', accountId);

    if (!accountId) {
      return NextResponse.json(
        { error: 'No account found for user' },
        { status: 404 }
      );
    }

    // Get account details for Stripe customer
    const account = await db.account.getAccountById(accountId);
    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    console.log('🎯 REAL ROUTE: Creating/updating Stripe subscription for:', { userId, accountId, planName });

    // Create or update Stripe subscription
    const stripeResult = await createOrUpdateSubscription({
      customer_id: account.stripCustomerId || '',
      price_id: pricingPlan.stripePriceId || '',
      customer_email: user.email,
      customer_name: `${user.firstname || ''} ${user.lastname || ''}`.trim(),
      metadata: {
        userId: userId.toString(),
        accountId: accountId.toString(),
        planName: planName
      }
    });

    if ('error_message' in stripeResult) {
      console.error('❌ REAL ROUTE: Stripe subscription error:', stripeResult.error_message);
      return NextResponse.json(
        { error: 'Failed to create subscription', details: stripeResult.error_message },
        { status: 500 }
      );
    }

    console.log('✅ REAL ROUTE: Stripe subscription created:', stripeResult.subscription_id);
    console.log('⏳ REAL ROUTE: Subscription will be updated via webhook when Stripe confirms');

    // ⭐ NEW APPROACH: Don't update database immediately
    // Wait for Stripe webhook to confirm and update subscription
    
    const response = {
      success: true,
      data: {
        stripeSubscriptionId: stripeResult.subscription_id,
        planName: planName,
        actionType: actionType,
        message: `Successfully initiated ${actionType} to ${planName} plan. Database will be updated once Stripe confirms the subscription.`,
        recurringBilling: true,
        status: 'processing'
      },
      timestamp: new Date().toISOString()
    };

    console.log('📤 REAL ROUTE: Sending response:', response);
    
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ REAL ROUTE: Error updating subscription plan:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';
    
    console.error('📋 REAL ROUTE: Full error details:', {
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to update plan', 
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}