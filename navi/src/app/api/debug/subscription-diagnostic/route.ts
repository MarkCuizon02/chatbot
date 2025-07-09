import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/model/database';

const db = new Database();

export async function GET(request: NextRequest) {
  try {
    console.log('🔧 Diagnostic: Testing database connections...');

    // Test 1: Check database connection
    const users = await db.user.getUserById(1);
    console.log('📋 Test 1 - User ID 1:', users);

    // Test 2: Check pricing plans
    const plans = await db.pricingPlan.getPricingPlans();
    console.log('📋 Test 2 - Pricing plans count:', plans?.length || 0);

    // Test 3: Check specific plan
    const personalPlan = await db.pricingPlan.getPricingPlanByTitle('Personal');
    console.log('📋 Test 3 - Personal plan:', personalPlan);

    // Test 4: Check subscriptions
    const subscription = await db.subscription.getSubscriptionByUserId(1);
    console.log('📋 Test 4 - User 1 subscription:', subscription);

    return NextResponse.json({
      success: true,
      diagnostics: {
        userExists: !!users,
        pricingPlansCount: plans?.length || 0,
        personalPlanExists: !!personalPlan,
        userHasSubscription: !!subscription,
        timestamp: new Date().toISOString()
      },
      data: {
        user: users ? { id: users.id, email: users.email } : null,
        personalPlan: personalPlan ? { id: personalPlan.id, title: personalPlan.title } : null,
        subscription: subscription ? { id: subscription.id, status: subscription.status } : null
      }
    });

  } catch (error: unknown) {
    console.error('❌ Diagnostic error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Diagnostic failed', 
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
