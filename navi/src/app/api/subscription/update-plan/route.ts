import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API: Subscription update request received');
    
    const body = await request.json();
    console.log('📦 API: Request body:', body);
    
    const { planName, userId, accountId, actionType } = body;

    if (!planName || (!userId && !accountId)) {
      console.log('❌ API: Missing required fields:', { planName, userId, accountId });
      return NextResponse.json(
        { error: 'Missing required fields: planName and (userId or accountId)' },
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

    console.log('🔍 API: Updating subscription for:', { userId, accountId });

    // Find existing subscription - prioritize accountId
    let existingSubscription;
    if (accountId) {
      existingSubscription = await prisma.subscription.findFirst({
        where: { accountId: accountId }
      });
    } else if (userId) {
      existingSubscription = await prisma.subscription.findFirst({
        where: { userId: userId }
      });
    }

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
      console.log('📝 API: Creating new subscription for:', { userId, accountId });
      const subscriptionData = {
        stripePriceId: pricingPlan.stripePriceId,
        status: 'ACTIVE' as const,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        ...(accountId ? { accountId } : {}),
        ...(userId ? { userId } : {})
      };
      
      subscription = await prisma.subscription.create({
        data: {
          ...subscriptionData,
          cancelAtPeriodEnd: false
        }
      });
    }

    console.log('✅ API: Subscription updated successfully:', subscription);

    // Create invoice for plan change
    try {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      
      // Determine the account ID for the invoice
      const invoiceAccountId = accountId || (await prisma.user.findUnique({
        where: { id: userId },
        include: { accounts: true }
      }))?.accounts[0]?.accountId;

      if (invoiceAccountId) {
        // Get count of invoices for this year/month to generate sequential number
        const invoiceCount = await prisma.invoice.count({
          where: {
            accountId: invoiceAccountId,
            createdAt: {
              gte: new Date(year, date.getMonth(), 1),
              lt: new Date(year, date.getMonth() + 1, 1),
            },
          },
        });
        
        const invoiceNumber = `SUB-${year}-${month}-${String(invoiceCount + 1).padStart(3, '0')}`;

        // Create invoice for subscription change
        await prisma.invoice.create({
          data: {
            accountId: invoiceAccountId,
            subscriptionId: subscription.stripeSubscriptionId || `sub_${subscription.id}`,
            stripeInvoiceId: `subscription_${subscription.id}_${Date.now()}`,
            amountDue: pricingPlan.price / 100, // Convert cents to dollars
            amountPaid: pricingPlan.price / 100,
            currency: 'usd',
            status: 'paid',
            paidAt: new Date(),
          },
        });

        console.log(`📄 API: Invoice created for ${actionType}: ${planName} plan`);
      }
    } catch (invoiceError) {
      console.error('⚠️ API: Failed to create invoice, but subscription was updated:', invoiceError);
      // Don't fail the entire request if invoice creation fails
    }

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