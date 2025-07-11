import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/subscription - Get subscriptions for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const accountId = searchParams.get('accountId');

    if (!userId && !accountId) {
      return NextResponse.json({ error: 'User ID or Account ID is required' }, { status: 400 });
    }

    const whereClause: { userId?: number; accountId?: number } = {};
    if (userId) whereClause.userId = parseInt(userId);
    if (accountId) whereClause.accountId = parseInt(accountId);

    const subscriptions = await prisma.subscription.findMany({
      where: whereClause,
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
  }
}

// POST /api/subscription - Create a new subscription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, accountId, planId, status = 'ACTIVE' } = body;

    if (!userId || !accountId || !planId) {
      return NextResponse.json({ error: 'User ID, Account ID, and Plan ID are required' }, { status: 400 });
    }

    // Get the pricing plan to get Stripe price ID
    const pricingPlan = await prisma.pricingPlan.findUnique({
      where: { id: planId }
    });

    if (!pricingPlan) {
      return NextResponse.json({ error: 'Invalid plan ID' }, { status: 400 });
    }

    // Check if user and account exist
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const account = await prisma.account.findUnique({ where: { id: accountId } });

    if (!user || !account) {
      return NextResponse.json({ error: 'User or Account not found' }, { status: 404 });
    }

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        accountId,
        stripePriceId: pricingPlan.stripePriceId,
        stripeCustomerId: account.stripCustomerId,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status,
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

    return NextResponse.json({
      success: true,
      message: 'Subscription created successfully',
      subscription
    });

  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
  }
}
