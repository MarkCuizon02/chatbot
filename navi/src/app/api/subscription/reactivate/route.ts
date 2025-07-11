import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscriptionId, planId } = body;

    if (!subscriptionId) {
      return NextResponse.json({ error: 'Subscription ID is required' }, { status: 400 });
    }

    // Get the current subscription
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
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

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    // Check if subscription is canceled
    if (subscription.status !== 'CANCELED') {
      return NextResponse.json({ error: 'Only canceled subscriptions can be reactivated' }, { status: 400 });
    }

    // Prepare reactivation data
    const reactivateData: {
      status: 'ACTIVE';
      cancelAtPeriodEnd: boolean;
      canceledAt: null;
      currentPeriodStart: Date;
      currentPeriodEnd: Date;
      stripePriceId?: string | null;
    } = {
      status: 'ACTIVE',
      cancelAtPeriodEnd: false,
      canceledAt: null,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    };

    // If planId is provided, also update the plan
    if (planId) {
      const plan = await prisma.pricingPlan.findUnique({
        where: { id: planId }
      });

      if (!plan) {
        return NextResponse.json({ error: 'Invalid plan ID' }, { status: 400 });
      }

      reactivateData.stripePriceId = plan.stripePriceId;
    }

    // Update the subscription
    const reactivatedSubscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: reactivateData,
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

    return NextResponse.json({
      message: 'Subscription reactivated successfully',
      subscription: reactivatedSubscription
    });
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    return NextResponse.json({ error: 'Failed to reactivate subscription' }, { status: 500 });
  }
}
