import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST /api/subscriptions/[id]/reactivate - Reactivate a cancelled subscription
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const subscriptionId = parseInt(params.id);
    const { planId } = await request.json();

    if (!subscriptionId) {
      return NextResponse.json({ error: 'Invalid subscription ID' }, { status: 400 });
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

    // If planId is provided, also update the plan
    const updateData: {
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

    if (planId) {
      // Validate the plan exists
      const plan = await prisma.pricingPlan.findUnique({
        where: { id: planId }
      });

      if (!plan) {
        return NextResponse.json({ error: 'Invalid plan ID' }, { status: 400 });
      }

      updateData.stripePriceId = plan.stripePriceId;
    }

    // Update the subscription
    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: updateData,
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
      subscription: updatedSubscription
    });
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    return NextResponse.json({ error: 'Failed to reactivate subscription' }, { status: 500 });
  }
}
