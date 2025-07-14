import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const subscriptionId = parseInt(id);
    const body = await request.json();
    const { planId } = body;

    if (isNaN(subscriptionId)) {
      return NextResponse.json({ error: 'Invalid subscription ID' }, { status: 400 });
    }

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      );
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

    // Check if it's the same plan
    if (subscription.stripePriceId === newPlan.stripePriceId) {
      return NextResponse.json({ 
        error: 'You are already on this plan',
        currentPlan: subscription.stripePriceId,
        requestedPlan: newPlan.stripePriceId
      }, { status: 400 });
    }

    // TODO: Implement Stripe integration for plan changes
    // For now, we'll return an error since Stripe integration is not yet implemented
    // In production, this should first update Stripe and only update DB on success
    console.log('⚠️ API: Stripe integration not yet implemented for plan changes');
    
    return NextResponse.json(
      { 
        error: 'Stripe integration not yet implemented for plan changes. Please try again later.',
        stripeIntegrationRequired: true
      },
      { status: 501 } // 501 Not Implemented
    );

    // Note: Invoice records for plan changes can be created via Stripe webhooks
    // to ensure accurate billing information

    return NextResponse.json({
      success: true,
      message: 'Plan changed successfully',
      subscription: updatedSubscription,
      newPlan: newPlan
    });
  } catch (error) {
    console.error('Error changing plan:', error);
    return NextResponse.json({ error: 'Failed to change plan' }, { status: 500 });
  }
}