import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCustomerPaymentMethods, createOrRetrieveCustomer, getCustomerDefaultPaymentMethod, createPaymentMethod, attachPaymentMethodToCustomer, updateCustomerDefaultPaymentMethod } from '@/lib/stripe';

// GET /api/payment-methods - Get all payment methods for a user via Stripe
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

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

    // Get the primary account (first one)
    const primaryAccount = user.accounts[0]?.account;
    if (!primaryAccount) {
      return NextResponse.json({ error: 'No account found for user' }, { status: 404 });
    }

    // If no Stripe customer ID, create one
    let stripeCustomerId = primaryAccount.stripCustomerId;
    if (!stripeCustomerId) {
      try {
        const customerResult = await createOrRetrieveCustomer({
          email: user.email,
          name: `${user.firstname || ''} ${user.lastname || ''}`.trim() || user.email,
          phone: '',
        });
        stripeCustomerId = customerResult.customer_id;
        
        // Update account with Stripe customer ID
        await prisma.account.update({
          where: { id: primaryAccount.id },
          data: { stripCustomerId: stripeCustomerId }
        });
      } catch (error) {
        console.error('Error creating Stripe customer:', error);
        return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
      }
    }

    // Get payment methods from Stripe
    try {
      const stripePaymentMethods = await getCustomerPaymentMethods(stripeCustomerId);
      const defaultPaymentMethod = await getCustomerDefaultPaymentMethod(stripeCustomerId);
      
      // Format payment methods for frontend
      const paymentMethods = stripePaymentMethods.map((pm) => {
        const card = (pm as { card?: { brand?: string; last4?: string; exp_month?: number; exp_year?: number } }).card;
        
        return {
          id: pm.id,
          userId: parseInt(userId),
          brand: card?.brand || pm.type,
          logo: getCardLogo(card?.brand || pm.type),
          number: `****${card?.last4 || '****'}`,
          expiry: card ? `${card.exp_month?.toString().padStart(2, '0')}/${card.exp_year?.toString().slice(-2)}` : 'N/A',
          isDefault: defaultPaymentMethod?.id === pm.id,
          cardholderName: pm.billing_details?.name || '',
          paymentMethod: pm.type as 'card' | 'paypal' | 'bank',
          status: 'active',
          lastUsed: new Date().toISOString(),
          securityFeatures: ['3D Secure', 'Fraud Protection'],
          stripePaymentMethodId: pm.id,
          createdAt: new Date(pm.created * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        };
      });

      return NextResponse.json(paymentMethods);
    } catch (error) {
      console.error('Error fetching Stripe payment methods:', error);
      return NextResponse.json({ error: 'Failed to fetch payment methods' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in payment methods GET:', error);
    return NextResponse.json({ error: 'Failed to fetch payment methods' }, { status: 500 });
  }
}

function getCardLogo(brand: string): string {
  const logos: Record<string, string> = {
    'visa': 'https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png',
    'mastercard': 'https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png',
    'amex': 'https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg',
    'discover': 'https://upload.wikimedia.org/wikipedia/commons/5/57/Discover_Card_logo.svg',
    'card': 'https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png', // Default
  };
  return logos[brand?.toLowerCase()] || logos.card;
}

// POST /api/payment-methods - Attach a payment method to customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, paymentMethodId, setAsDefault = false } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

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
    if (!primaryAccount) {
      return NextResponse.json({ error: 'No account found for user' }, { status: 404 });
    }

    // If payment method ID is provided, attach it to customer
    if (paymentMethodId) {
      try {
        // Attach payment method to customer
        await attachPaymentMethodToCustomer(primaryAccount.stripCustomerId!, paymentMethodId);
        
        // Set as default if requested
        if (setAsDefault) {
          await updateCustomerDefaultPaymentMethod(primaryAccount.stripCustomerId!, paymentMethodId);
        }

        return NextResponse.json({
          success: true,
          message: 'Payment method attached successfully',
          paymentMethodId: paymentMethodId
        });
      } catch (error) {
        console.error('Error attaching payment method:', error);
        return NextResponse.json({ error: 'Failed to attach payment method' }, { status: 500 });
      }
    }

    // If no payment method ID provided, create a test payment method for development
    // Note: In production, this should be handled via Stripe Elements
    try {
      // Create a test payment method using Stripe's test card token
      const testPaymentMethod = await createPaymentMethod({
        type: 'card',
        card: {
          number: '4242424242424242', // Stripe test card
          exp_month: 12,
          exp_year: 2025,
          cvc: '123',
        },
        billing_details: {
          name: body.cardholderName || 'Test User',
        },
      });

      // Attach to customer
      await attachPaymentMethodToCustomer(primaryAccount.stripCustomerId!, testPaymentMethod.payment_method_id);
      
      // Set as default if requested
      if (setAsDefault) {
        await updateCustomerDefaultPaymentMethod(primaryAccount.stripCustomerId!, testPaymentMethod.payment_method_id);
      }

      return NextResponse.json({
        success: true,
        message: 'Test payment method created and attached successfully',
        paymentMethodId: testPaymentMethod.payment_method_id,
        note: 'This is a test payment method using Stripe test card'
      });
    } catch (error) {
      console.error('Error creating test payment method:', error);
      return NextResponse.json({ error: 'Failed to create payment method' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in payment method POST:', error);
    return NextResponse.json({ error: 'Failed to process payment method' }, { status: 500 });
  }
} 