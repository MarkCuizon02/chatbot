import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createSubscription, createOrRetrieveCustomer } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API: Create subscription with Stripe request received');
    
    const body = await request.json();
    console.log('📦 API: Request body:', body);
    
    const { userId, accountId, planId, email, name, phone } = body;

    if (!userId || !accountId || !planId || !email) {
      console.log('❌ API: Missing required fields');
      return NextResponse.json(
        { error: 'User ID, Account ID, Plan ID, and Email are required' },
        { status: 400 }
      );
    }

    // Get the pricing plan to get Stripe price ID
    const pricingPlan = await prisma.pricingPlan.findUnique({
      where: { id: planId }
    });

    if (!pricingPlan) {
      console.log('❌ API: Invalid plan ID:', planId);
      return NextResponse.json({ error: 'Invalid plan ID' }, { status: 400 });
    }

    // Check if user and account exist
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const account = await prisma.account.findUnique({ where: { id: accountId } });

    if (!user || !account) {
      console.log('❌ API: User or Account not found');
      return NextResponse.json({ error: 'User or Account not found' }, { status: 404 });
    }

    // Check if user already has an active subscription
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: { in: ['ACTIVE', 'TRIALING'] }
      }
    });

    if (existingSubscription) {
      console.log('❌ API: User already has an active subscription');
      return NextResponse.json({ 
        error: 'User already has an active subscription',
        existingSubscription 
      }, { status: 400 });
    }

    // Step 1: Create or retrieve customer in Stripe
    let customerResult;
    let customerId: string;
    try {
      console.log('🔍 API: Creating/retrieving customer in Stripe for email:', email);
      
      customerResult = await createOrRetrieveCustomer({
        email,
        name: name || email,
        phone
      });

      if (!customerResult.customer_id) {
        throw new Error('Failed to create or retrieve customer - no customer ID returned');
      }

      customerId = customerResult.customer_id as string;
      console.log('✅ API: Customer created/retrieved in Stripe:', customerId);
    } catch (stripeError) {
      console.error('❌ API: Failed to create/retrieve customer in Stripe:', stripeError);
      return NextResponse.json(
        { 
          error: 'Failed to create customer in Stripe', 
          details: stripeError instanceof Error ? stripeError.message : 'Unknown Stripe error' 
        },
        { status: 500 }
      );
    }

    // Step 2: Create subscription in Stripe
    let stripeSubscriptionResult;
    try {
      console.log('🔍 API: Creating subscription in Stripe');
      
              stripeSubscriptionResult = await createSubscription(
          customerId,
          1, // quantity
          'card', // payment method type
          pricingPlan.stripePriceId
        );

      console.log('✅ API: Stripe subscription created successfully:', stripeSubscriptionResult);
    } catch (stripeError) {
      console.error('❌ API: Failed to create subscription in Stripe:', stripeError);
      return NextResponse.json(
        { 
          error: 'Failed to create subscription in Stripe', 
          details: stripeError instanceof Error ? stripeError.message : 'Unknown Stripe error' 
        },
        { status: 500 }
      );
    }

    // Step 3: Update account with Stripe customer ID if not already set
    try {
      if (!account.stripCustomerId) {
        await prisma.account.update({
          where: { id: accountId },
          data: {
            stripCustomerId: customerId
          }
        });
        console.log('✅ API: Account updated with Stripe customer ID');
      }
    } catch (accountUpdateError) {
      console.error('⚠️ API: Failed to update account with Stripe customer ID:', accountUpdateError);
      // Don't fail the entire request if account update fails
    }

    // Step 4: Create a minimal subscription record in database
    // The webhook will handle the full subscription synchronization
    let createdSubscription;
    try {
      console.log('🔍 API: Creating initial subscription record in database');
      
      createdSubscription = await prisma.subscription.create({
        data: {
          userId,
          accountId,
          stripePriceId: pricingPlan.stripePriceId,
          stripeCustomerId: customerId,
          stripeSubscriptionId: stripeSubscriptionResult.subscription_id,
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          status: 'ACTIVE', // Will be updated by webhook to correct status
          cancelAtPeriodEnd: false
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstname: true,
              lastname: true
            }
          },
          account: {
            select: {
              id: true,
              name: true,
              type: true
            }
          }
        }
      });

      console.log('✅ API: Initial subscription record created in database');
    } catch (dbError) {
      console.error('❌ API: Failed to create subscription record in database:', dbError);
      
      // If we successfully created in Stripe but failed to create in DB, we have a problem
      console.error('⚠️ API: WARNING - Stripe subscription was created but database creation failed');
      // The webhook will handle this when it receives the subscription.created event
      
      return NextResponse.json(
        { 
          error: 'Failed to create subscription record in database', 
          details: dbError instanceof Error ? dbError.message : 'Unknown database error' 
        },
        { status: 500 }
      );
    }

    console.log('✅ API: Subscription creation initiated successfully');
    console.log('📡 API: Webhook will handle full subscription synchronization');

    return NextResponse.json({
      success: true,
      message: 'Subscription creation initiated successfully. Webhook will handle synchronization.',
      subscription: createdSubscription,
      stripeSubscription: stripeSubscriptionResult.subscription,
      customerId: customerId,
      note: 'Subscription status will be updated by webhook'
    });

  } catch (error) {
    console.error('❌ API: Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 