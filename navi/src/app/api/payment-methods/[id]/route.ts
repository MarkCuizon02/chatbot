import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { detachPaymentMethod, updateCustomerDefaultPaymentMethod, retrievePaymentMethod } from '@/lib/stripe';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get payment method from Stripe
    try {
      const stripePaymentMethod = await retrievePaymentMethod(id);
      
      if (!stripePaymentMethod) {
        return NextResponse.json({ error: 'Payment method not found' }, { status: 404 });
      }

      // Format for frontend
      const card = (stripePaymentMethod as { card?: { brand?: string; last4?: string; exp_month?: number; exp_year?: number } }).card;
      
      const paymentMethod = {
        id: stripePaymentMethod.id,
        brand: card?.brand || stripePaymentMethod.type,
        number: `****${card?.last4 || '****'}`,
        expiry: card ? `${card.exp_month?.toString().padStart(2, '0')}/${card.exp_year?.toString().slice(-2)}` : 'N/A',
        cardholderName: stripePaymentMethod.billing_details?.name || '',
        paymentMethod: stripePaymentMethod.type as 'card' | 'paypal' | 'bank',
        status: 'active',
        stripePaymentMethodId: stripePaymentMethod.id,
        createdAt: new Date(stripePaymentMethod.created * 1000).toISOString(),
      };

      return NextResponse.json(paymentMethod);
    } catch (error) {
      console.error('Error fetching payment method from Stripe:', error);
      return NextResponse.json({ error: 'Payment method not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching payment method:', error);
    return NextResponse.json({ error: 'Failed to fetch payment method' }, { status: 500 });
  }
}

// PUT /api/payment-methods/[id] - Update a payment method (mainly for setting as default)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { isDefault, userId } = body;

    if (!id) {
      return NextResponse.json({ error: 'Payment method ID is required' }, { status: 400 });
    }

    // If setting as default, we need to update the customer's default payment method in Stripe
    if (isDefault && userId) {
      try {
        // Get user to find their account
        const user = await prisma.user.findUnique({
          where: { id: parseInt(userId) },
          include: {
            accounts: {
              include: {
                account: true
              }
            }
          }
        });

        if (!user) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Get the primary account
        const primaryAccount = user.accounts[0]?.account;
        if (!primaryAccount?.stripCustomerId) {
          return NextResponse.json({ error: 'No Stripe customer found for user' }, { status: 404 });
        }

        // Update default payment method in Stripe
        await updateCustomerDefaultPaymentMethod(primaryAccount.stripCustomerId, id);
        
        return NextResponse.json({ 
          message: 'Payment method updated successfully',
          id: id,
          isDefault: true
        });
      } catch (error) {
        console.error('Error updating default payment method in Stripe:', error);
        return NextResponse.json({ error: 'Failed to update payment method' }, { status: 500 });
      }
    }

    // For other updates, we could handle them here
    return NextResponse.json({ 
      message: 'Payment method updated successfully',
      id: id 
    });
  } catch (error) {
    console.error('Error in payment method PUT:', error);
    return NextResponse.json({ error: 'Failed to update payment method' }, { status: 500 });
  }
}

// DELETE /api/payment-methods/[id] - Delete (detach) a payment method from Stripe
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Payment method ID is required' }, { status: 400 });
    }

    // Detach the payment method from Stripe customer
    try {
      await detachPaymentMethod(id);
      
      return NextResponse.json({ 
        message: 'Payment method deleted successfully',
        id: id 
      });
    } catch (error) {
      console.error('Error detaching payment method from Stripe:', error);
      return NextResponse.json({ error: 'Failed to delete payment method' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in payment method DELETE:', error);
    return NextResponse.json({ error: 'Failed to delete payment method' }, { status: 500 });
  }
} 