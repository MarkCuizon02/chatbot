import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API: Reactivate subscription request received');
    
    const body = await request.json();
    console.log('📦 API: Request body:', body);
    
    const { userId, planName } = body;

    if (!userId || !planName) {
      console.log('❌ API: Missing required fields:', { userId, planName });
      return NextResponse.json(
        { error: 'Missing required fields: userId and planName' },
        { status: 400 }
      );
    }

    console.log('🔍 API: Looking for pricing plan:', planName);

    // Find the pricing plan
    const pricingPlan = await prisma.pricingPlan.findFirst({
      where: {
        title: planName,
        isActive: true
      }
    });

    if (!pricingPlan) {
      console.log('❌ API: Pricing plan not found:', planName);
      return NextResponse.json(
        { error: 'Pricing plan not found' },
        { status: 404 }
      );
    }

    console.log('🔍 API: Looking for subscription for user:', userId);

    // Find the user's subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: userId
      }
    });

    console.log('📦 API: Found subscription:', subscription);

    if (!subscription) {
      console.log('❌ API: No subscription found for user:', userId);
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      );
    }

    console.log('🔍 API: Reactivating subscription:', subscription.id);

    // Reactivate the subscription
    const updatedSubscription = await prisma.subscription.update({
      where: {
        id: subscription.id
      },
      data: {
        status: 'ACTIVE',
        cancelAtPeriodEnd: false,
        canceledAt: null,
        stripePriceId: pricingPlan.stripePriceId,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        updatedAt: new Date()
      }
    });

    console.log('✅ API: Subscription reactivated successfully:', updatedSubscription);

    return NextResponse.json({
      success: true,
      subscription: updatedSubscription,
      message: `Subscription reactivated successfully! You're now on the ${planName} plan.`,
      planName: planName
    });

  } catch (error) {
    console.error('❌ API: Error reactivating subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 