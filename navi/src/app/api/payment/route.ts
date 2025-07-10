import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { detachPaymentMethod, updateCustomerDefaultPaymentMethod } from '@/lib/stripe';
import { Database } from '@/lib/model/database';
import { getCreditPackPrice } from '@/lib/creditPricing';
import { createCustomer, oneTimePayment } from '@/lib/stripe';

const db = new Database();

// GET /api/payment - Get all payment methods for a user from the database
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get payment methods from database
    const paymentMethods = await prisma.paymentMethod.findMany({
      where: { userId: parseInt(userId) },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    // Format payment methods for frontend
    const formattedPaymentMethods = paymentMethods.map((pm) => ({
      id: pm.id,
      userId: pm.userId,
      brand: pm.brand,
      logo: pm.logo || getCardLogo(pm.brand),
      number: pm.number,
      expiry: pm.expiry,
      isDefault: pm.isDefault,
      cardholderName: pm.cardholderName,
      paymentMethod: pm.paymentMethod,
      status: pm.status,
      lastUsed: pm.lastUsed?.toISOString(),
      securityFeatures: pm.securityFeatures,
      stripePaymentMethodId: pm.stripePaymentMethodId,
      bankName: pm.bankName,
      accountNumber: pm.accountNumber,
      routingNumber: pm.routingNumber,
      email: pm.email,
      zipCode: pm.zipCode,
      country: pm.country,
      createdAt: pm.createdAt.toISOString(),
      updatedAt: pm.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedPaymentMethods);
  } catch (error) {
    console.error('Error in payment GET:', error);
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

// POST /api/payment - Handle both payment method creation and credit purchases
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    if (action === 'add_payment_method') {
      return handleAddPaymentMethod(data);
    } else if (action === 'purchase_credits') {
      return handlePurchaseCredits(data);
    } else {
      return NextResponse.json({ error: 'Invalid action. Use "add_payment_method" or "purchase_credits"' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in payment POST:', error);
    return NextResponse.json({ error: 'Failed to process payment request' }, { status: 500 });
  }
}

// Handle adding a payment method (store in database for display purposes)
async function handleAddPaymentMethod(data: {
  userId: string;
  accountId?: number;
  brand?: string;
  cardNumber?: string;
  cardholderName?: string;
  expiry?: string;
  isDefault?: boolean;
  paymentMethod?: string;
  zipCode?: string;
  country?: string;
  email?: string;
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  stripePaymentMethodId?: string;
}) {
  const { 
    userId, 
    accountId, 
    brand, 
    cardNumber, 
    cardholderName, 
    expiry, 
    isDefault, 
    paymentMethod,
    zipCode,
    country,
    email,
    bankName,
    accountNumber,
    routingNumber,
    stripePaymentMethodId 
  } = data;

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    // If setting as default, first unset all other default payment methods for this user
    if (isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId: parseInt(userId) },
        data: { isDefault: false }
      });
    }

    // Create the payment method in database
    const paymentMethodData = {
      userId: parseInt(userId),
      accountId: accountId || null,
      brand: brand || 'Card',
      logo: getCardLogo(brand || 'card'),
      number: cardNumber ? `****${cardNumber.slice(-4)}` : '****0000',
      expiry: expiry || null,
      cardholderName: cardholderName || null,
      isDefault: isDefault || false,
      paymentMethod: paymentMethod || 'card',
      status: 'active',
      lastUsed: new Date(),
      securityFeatures: ['3D Secure', 'Fraud Protection'],
      stripePaymentMethodId: stripePaymentMethodId || null,
      zipCode: zipCode || null,
      country: country || null,
      email: email || null,
      bankName: bankName || null,
      accountNumber: accountNumber ? `****${accountNumber.slice(-4)}` : null,
      routingNumber: routingNumber || null,
    };

    const newPaymentMethod = await prisma.paymentMethod.create({
      data: paymentMethodData
    });

    return NextResponse.json({
      success: true,
      message: `${brand || 'Payment method'} added successfully`,
      paymentMethod: {
        id: newPaymentMethod.id,
        userId: newPaymentMethod.userId,
        brand: newPaymentMethod.brand,
        logo: newPaymentMethod.logo,
        number: newPaymentMethod.number,
        expiry: newPaymentMethod.expiry,
        isDefault: newPaymentMethod.isDefault,
        cardholderName: newPaymentMethod.cardholderName,
        paymentMethod: newPaymentMethod.paymentMethod,
        status: newPaymentMethod.status,
        lastUsed: newPaymentMethod.lastUsed?.toISOString(),
        securityFeatures: newPaymentMethod.securityFeatures,
        stripePaymentMethodId: newPaymentMethod.stripePaymentMethodId,
        zipCode: newPaymentMethod.zipCode,
        country: newPaymentMethod.country,
        email: newPaymentMethod.email,
        bankName: newPaymentMethod.bankName,
        accountNumber: newPaymentMethod.accountNumber,
        routingNumber: newPaymentMethod.routingNumber,
        createdAt: newPaymentMethod.createdAt.toISOString(),
        updatedAt: newPaymentMethod.updatedAt.toISOString(),
      }
    });
  } catch (error) {
    console.error('Error creating payment method:', error);
    return NextResponse.json({ error: 'Failed to create payment method' }, { status: 500 });
  }
}

// Handle credit purchases
async function handlePurchaseCredits(data: {
  accountId: number;
  credits: number;
  applyDiscount?: boolean;
}) {
  console.log('🔧 Purchase Credits API called');
  
  try {
    const { accountId, credits, applyDiscount = false } = data;

    if (!accountId || !credits) {
      console.log('❌ Missing required fields:', { accountId, credits });
      return NextResponse.json(
        { error: 'Account ID and credits are required' },
        { status: 400 }
      );
    }

    console.log('🔍 Looking up account with ID:', accountId);
    // Get the account by its ID
    const account = await db.account.getAccountById(accountId);

    if (!account) {
      console.log('❌ Account not found for ID:', accountId);
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    console.log('✅ Account found:', account.name, 'ID:', account.id);

    // Calculate price using the new pricing system
    let totalPrice = getCreditPackPrice(credits);
    
    // Apply 20% discount if requested (for monthly subscribers)
    if (applyDiscount) {
      totalPrice = totalPrice * 0.8;
    }

    // Get or create Stripe customer if needed
    let stripeCustomerId = account.stripCustomerId;
    
    // Get user account for metadata (we need userId)
    const userAccount = await db.account.getUserAccountForAccount(account.id);
    if (!userAccount?.user) {
      return NextResponse.json(
        { error: 'User not found for account' },
        { status: 400 }
      );
    }
    
    if (!stripeCustomerId) {
      // We need user email to create customer
      const customerResult = await createCustomer({
        email: userAccount.user.email,
        fname: userAccount.user.firstname || '',
        lname: userAccount.user.lastname || '',
        phone: ''
      });

      if ('error_message' in customerResult) {
        return NextResponse.json(
          { error: 'Failed to create Stripe customer', details: customerResult.error_message },
          { status: 500 }
        );
      }

      stripeCustomerId = customerResult.customer_id;
      
      // Update account with Stripe customer ID
      await db.account.updateAccountStripeCustomerId(account.id, stripeCustomerId);
    }

    // Create Stripe Payment Intent for credit purchase
    const paymentResult = await oneTimePayment({
      customer_id: stripeCustomerId,
      amount: totalPrice,
      ddecation: `Purchase ${credits} credits`,
      metadata: {
        type: 'credit_purchase',
        credits: credits.toString(),
        accountId: account.id.toString(),
        userId: userAccount.user.id.toString()
      }
    });

    if ('error_message' in paymentResult) {
      return NextResponse.json(
        { error: 'Failed to create payment intent', details: paymentResult.error_message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      status: 'payment_intent_created',
      data: {
        paymentId: paymentResult.payment_id,
        clientSecret: paymentResult.client_secret,
        pendingCredits: credits,
        totalPrice: totalPrice,
        discountApplied: applyDiscount,
        message: '⏳ Payment Intent created. Credits will be added ONLY after successful payment completion.',
        nextStep: 'Complete payment using the clientSecret to receive credits',
        creditsAddedImmediately: false
      },
    });

  } catch (error: unknown) {
    console.error('Error purchasing credits:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';
    
    console.error('Full error details:', {
      message: errorMessage,
      stack: errorStack,
      error: error
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to purchase credits', 
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// PUT /api/payment - Update payment method (mainly for setting as default)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentMethodId, isDefault, userId } = body;

    if (!paymentMethodId) {
      return NextResponse.json({ error: 'Payment method ID is required' }, { status: 400 });
    }

    // If setting as default, first unset all other default payment methods for this user
    if (isDefault && userId) {
      await prisma.paymentMethod.updateMany({
        where: { userId: parseInt(userId) },
        data: { isDefault: false }
      });
    }

    // Update the payment method
    const updatedPaymentMethod = await prisma.paymentMethod.update({
      where: { id: parseInt(paymentMethodId) },
      data: { 
        isDefault: isDefault || false,
        lastUsed: new Date()
      }
    });

    // If there's a Stripe payment method ID, also update it in Stripe
    if (updatedPaymentMethod.stripePaymentMethodId && isDefault && userId) {
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

        if (user) {
          const primaryAccount = user.accounts[0]?.account;
          if (primaryAccount?.stripCustomerId) {
            await updateCustomerDefaultPaymentMethod(primaryAccount.stripCustomerId, updatedPaymentMethod.stripePaymentMethodId);
          }
        }
      } catch (error) {
        console.error('Error updating default payment method in Stripe:', error);
        // Continue even if Stripe update fails
      }
    }
    
    return NextResponse.json({ 
      message: 'Payment method updated successfully',
      id: updatedPaymentMethod.id,
      isDefault: updatedPaymentMethod.isDefault
    });
  } catch (error) {
    console.error('Error in payment PUT:', error);
    return NextResponse.json({ error: 'Failed to update payment method' }, { status: 500 });
  }
}

// DELETE /api/payment - Delete a payment method from database and optionally Stripe
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentMethodId = searchParams.get('id');

    if (!paymentMethodId) {
      return NextResponse.json({ error: 'Payment method ID is required' }, { status: 400 });
    }

    // Get the payment method before deleting
    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: { id: parseInt(paymentMethodId) }
    });

    if (!paymentMethod) {
      return NextResponse.json({ error: 'Payment method not found' }, { status: 404 });
    }

    // Delete from database
    await prisma.paymentMethod.delete({
      where: { id: parseInt(paymentMethodId) }
    });

    // If there's a Stripe payment method ID, also detach it from Stripe
    if (paymentMethod.stripePaymentMethodId) {
      try {
        await detachPaymentMethod(paymentMethod.stripePaymentMethodId);
      } catch (error) {
        console.error('Error detaching payment method from Stripe:', error);
        // Continue even if Stripe deletion fails
      }
    }
    
    return NextResponse.json({ 
      message: 'Payment method deleted successfully',
      id: paymentMethodId 
    });
  } catch (error) {
    console.error('Error in payment DELETE:', error);
    return NextResponse.json({ error: 'Failed to delete payment method' }, { status: 500 });
  }
}
