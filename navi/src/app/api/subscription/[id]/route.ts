import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { SubscriptionStatus } from '@prisma/client';

// GET /api/subscription/[id] - Get a specific subscription
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const subscriptionId = parseInt(params.id);

    if (isNaN(subscriptionId)) {
      return NextResponse.json({ error: 'Invalid subscription ID' }, { status: 400 });
    }

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

    return NextResponse.json(subscription);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
  }
}

// PUT /api/subscription/[id] - Update a subscription
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const subscriptionId = parseInt(params.id);

    if (isNaN(subscriptionId)) {
      return NextResponse.json({ error: 'Invalid subscription ID' }, { status: 400 });
    }

    const body = await request.json();
    const updateData: {
      status?: SubscriptionStatus;
      cancelAtPeriodEnd?: boolean;
      currentPeriodStart?: Date;
      currentPeriodEnd?: Date;
      stripePriceId?: string;
      canceledAt?: Date;
    } = {};

    // Allow updating specific fields
    if (body.status !== undefined) updateData.status = body.status as SubscriptionStatus;
    if (body.cancelAtPeriodEnd !== undefined) updateData.cancelAtPeriodEnd = body.cancelAtPeriodEnd;
    if (body.currentPeriodStart !== undefined) updateData.currentPeriodStart = new Date(body.currentPeriodStart);
    if (body.currentPeriodEnd !== undefined) updateData.currentPeriodEnd = new Date(body.currentPeriodEnd);
    if (body.stripePriceId !== undefined) updateData.stripePriceId = body.stripePriceId;

    // Set canceledAt if canceling
    if (body.status === 'CANCELED' && !updateData.canceledAt) {
      updateData.canceledAt = new Date();
    }

    const subscription = await prisma.subscription.update({
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
      success: true,
      message: 'Subscription updated successfully',
      subscription
    });

  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
  }
}

// DELETE /api/subscription/[id] - Cancel/Delete a subscription
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const subscriptionId = parseInt(params.id);

    if (isNaN(subscriptionId)) {
      return NextResponse.json({ error: 'Invalid subscription ID' }, { status: 400 });
    }

    // Check if subscription exists
    const existingSubscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId }
    });

    if (!existingSubscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    // Update subscription to canceled status instead of deleting
    const subscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'CANCELED' as SubscriptionStatus,
        canceledAt: new Date(),
        cancelAtPeriodEnd: true
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
      success: true,
      message: 'Subscription canceled successfully',
      subscription
    });

  } catch (error) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
  }
}
