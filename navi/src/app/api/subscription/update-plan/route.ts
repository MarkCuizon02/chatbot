import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API: Subscription update request received');
    
    const body = await request.json();
    console.log('📦 API: Request body:', body);
    
    const { planName, userId, actionType } = body;

    if (!planName || !userId) {
      console.log('❌ API: Missing required fields:', { planName, userId });
      return NextResponse.json(
        { error: 'Missing required fields: planName and userId' },
        { status: 400 }
      );
    }

    console.log('🔍 API: Looking for pricing plan with title:', planName);

    // Find the pricing plan by name
    const pricingPlan = await prisma.pricingPlan.findFirst({
      where: {
        title: planName,
        isActive: true
      }
    });

    console.log('📦 API: Found pricing plan:', pricingPlan);

    if (!pricingPlan) {
      console.log('❌ API: Pricing plan not found for:', planName);
      return NextResponse.json(
        { error: 'Pricing plan not found' },
        { status: 404 }
      );
    }

    console.log('🔍 API: Checking if user exists with ID:', userId);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    console.log('📦 API: Found user:', user ? { id: user.id, email: user.email } : null);

    if (!user) {
      console.log('❌ API: User not found with ID:', userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('🔍 API: Updating subscription for user:', userId);

    // Find existing subscription for this user
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: userId
      }
    });

    let subscription;
    
    if (existingSubscription) {
      // Update existing subscription
      console.log('📝 API: Updating existing subscription:', existingSubscription.id);
      subscription = await prisma.subscription.update({
        where: {
          id: existingSubscription.id
        },
        data: {
          stripePriceId: pricingPlan.stripePriceId,
          status: 'ACTIVE',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          updatedAt: new Date()
        }
      });
    } else {
      // Create new subscription
      console.log('📝 API: Creating new subscription for user:', userId);
      subscription = await prisma.subscription.create({
        data: {
          userId: userId,
          stripePriceId: pricingPlan.stripePriceId,
          status: 'ACTIVE',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          cancelAtPeriodEnd: false
        }
      });
    }

    console.log('✅ API: Subscription updated successfully:', subscription);

    // Log the plan change
    console.log(`📝 API: Plan updated for user ${userId}: ${planName} (${actionType})`);

    return NextResponse.json({
      success: true,
      subscription,
      message: `Successfully ${actionType === 'upgrade' ? 'upgraded' : 'downgraded'} to ${planName} plan`
    });

  } catch (error) {
    console.error('❌ API: Error updating subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 