import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cancelSubscription } from '@/lib/stripe';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API: Cancel subscription request received');
    
    const body = await request.json();
    console.log('📦 API: Request body:', body);
    
    const { userId, accountId, reason, feedback } = body;

    if (!userId && !accountId) {
      console.log('❌ API: Missing required field: userId or accountId');
      return NextResponse.json(
        { error: 'Missing required field: userId or accountId' },
        { status: 400 }
      );
    }

    console.log('🔍 API: Looking for subscription for:', { userId, accountId });

    // Find the subscription - prioritize accountId
    let subscription;
    if (accountId) {
      subscription = await prisma.subscription.findFirst({
        where: { accountId: accountId }
      });
    } else if (userId) {
      subscription = await prisma.subscription.findFirst({
        where: { userId: userId }
      });
    }

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

    // Step 1: Cancel subscription in Stripe if stripeSubscriptionId exists
    let stripeCancelResult = null;
    if (subscription.stripeSubscriptionId) {
      try {
        console.log('🔍 API: Canceling subscription in Stripe:', subscription.stripeSubscriptionId);
        stripeCancelResult = await cancelSubscription(subscription.stripeSubscriptionId);
        console.log('✅ API: Stripe subscription canceled successfully:', stripeCancelResult);
      } catch (stripeError) {
        console.error('❌ API: Failed to cancel subscription in Stripe:', stripeError);
        return NextResponse.json(
          { 
            error: 'Failed to cancel subscription in Stripe', 
            details: stripeError instanceof Error ? stripeError.message : 'Unknown Stripe error' 
          },
          { status: 500 }
        );
      }
    } else {
      console.log('⚠️ API: No Stripe subscription ID found, proceeding with database-only cancellation');
    }

    // Step 2: Update database only if Stripe operation succeeded (or if no Stripe subscription)
    let updatedSubscription;
    try {
      console.log('🔍 API: Updating subscription in database');
      
      updatedSubscription = await prisma.subscription.update({
        where: {
          id: subscription.id
        },
        data: {
          status: 'CANCELED',
          cancelAtPeriodEnd: true,
          canceledAt: new Date(),
          updatedAt: new Date(),
          // Note: Stripe subscription data is already updated via the cancelSubscription call
        }
      });

      console.log('✅ API: Database updated successfully:', updatedSubscription);
    } catch (dbError) {
      console.error('❌ API: Failed to update database after Stripe cancellation:', dbError);
      
      // If we successfully canceled in Stripe but failed to update DB, we have a problem
      if (stripeCancelResult) {
        console.error('⚠️ API: WARNING - Stripe subscription was canceled but database update failed');
        // In a production environment, you might want to implement a retry mechanism
        // or alert administrators about this inconsistency
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to update subscription in database', 
          details: dbError instanceof Error ? dbError.message : 'Unknown database error' 
        },
        { status: 500 }
      );
    }

    // Step 3: Create invoice record for cancellation (for billing history tracking)
    try {
      // Determine the account ID for the invoice
      const invoiceAccountId = accountId || (await prisma.user.findUnique({
        where: { id: userId },
        include: { accounts: true }
      }))?.accounts[0]?.accountId;

      if (invoiceAccountId) {
        // Create a $0 invoice record for cancellation tracking
        await prisma.invoice.create({
          data: {
            accountId: invoiceAccountId,
            subscriptionId: updatedSubscription.stripeSubscriptionId || `sub_${updatedSubscription.id}`,
            stripeInvoiceId: `cancellation_${updatedSubscription.id}_${Date.now()}`,
            amountDue: 0.00, // $0 for cancellation
            amountPaid: 0.00,
            currency: 'usd',
            status: 'paid', // Mark as paid since it's just a record
            paidAt: new Date(),
          },
        });

        console.log('📄 API: Cancellation record created in billing history');
      }
    } catch (invoiceError) {
      console.error('⚠️ API: Failed to create cancellation record, but subscription was canceled:', invoiceError);
      // Don't fail the entire request if invoice creation fails
    }

    // Log the cancellation with feedback
    console.log(`📝 API: Subscription canceled for user ${userId}:`, {
      reason: reason || 'No reason provided',
      feedback: feedback || 'No feedback provided',
      canceledAt: new Date(),
      stripeCanceled: !!stripeCancelResult
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
      endDate: updatedSubscription.currentPeriodEnd,
      stripeCanceled: !!stripeCancelResult
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