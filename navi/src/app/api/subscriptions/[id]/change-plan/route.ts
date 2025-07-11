import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST /api/subscriptions/[id]/change-plan - Change subscription plan
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

    if (!planId) {
      return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 });
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

    // Check if subscription is active
    if (subscription.status !== 'ACTIVE' && subscription.status !== 'TRIALING') {
      return NextResponse.json({ error: 'Only active subscriptions can change plans' }, { status: 400 });
    }

    // Validate the new plan exists
    const newPlan = await prisma.pricingPlan.findUnique({
      where: { id: planId }
    });

    if (!newPlan) {
      return NextResponse.json({ error: 'Invalid plan ID' }, { status: 400 });
    }

    // Update the subscription with the new plan
    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        stripePriceId: newPlan.stripePriceId,
        // Reset period for immediate plan change
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        updatedAt: new Date()
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

    return NextResponse.json({
      message: 'Plan changed successfully',
      subscription: updatedSubscription,
      newPlan: newPlan
    });
  } catch (error) {
    console.error('Error changing plan:', error);
    return NextResponse.json({ error: 'Failed to change plan' }, { status: 500 });
  }
}
