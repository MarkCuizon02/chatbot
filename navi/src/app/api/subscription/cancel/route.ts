import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API: Cancel subscription request received');
    
    const body = await request.json();
    console.log('📦 API: Request body:', body);
    
    const { userId, reason, feedback } = body;

    if (!userId) {
      console.log('❌ API: Missing required field: userId');
      return NextResponse.json(
        { error: 'Missing required field: userId' },
        { status: 400 }
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
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    if (subscription.status === 'CANCELED') {
      console.log('❌ API: Subscription already canceled for user:', userId);
      return NextResponse.json(
        { error: 'Subscription is already canceled' },
        { status: 400 }
      );
    }

    console.log('🔍 API: Canceling subscription:', subscription.id);

    // Cancel the subscription
    const updatedSubscription = await prisma.subscription.update({
      where: {
        id: subscription.id
      },
      data: {
        status: 'CANCELED',
        cancelAtPeriodEnd: true,
        canceledAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log('✅ API: Subscription canceled successfully:', updatedSubscription);

    // Log the cancellation with feedback
    console.log(`📝 API: Subscription canceled for user ${userId}:`, {
      reason: reason || 'No reason provided',
      feedback: feedback || 'No feedback provided',
      canceledAt: new Date()
    });

    // Here you could also:
    // - Send cancellation email
    // - Update analytics
    // - Log to external systems
    // - Trigger webhooks

    return NextResponse.json({
      success: true,
      subscription: updatedSubscription,
      message: 'Subscription canceled successfully. You will continue to have access until the end of your current billing period.',
      cancelDate: updatedSubscription.canceledAt,
      endDate: updatedSubscription.currentPeriodEnd
    });

  } catch (error) {
    console.error('❌ API: Error canceling subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 