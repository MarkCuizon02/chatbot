import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/payment-methods - Get all payment methods for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const paymentMethods = await prisma.paymentMethod.findMany({
      where: {
        userId: parseInt(userId),
        isDeleted: false
      },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(paymentMethods);
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return NextResponse.json({ error: 'Failed to fetch payment methods' }, { status: 500 });
  }
}

// POST /api/payment-methods - Create a new payment method
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      brand,
      logo,
      number,
      expiry,
      cardholderName,
      cvv,
      zipCode,
      country,
      isDefault,
      paymentMethod,
      securityFeatures,
      bankName,
      accountNumber,
      routingNumber,
      email
    } = body;

    if (!userId || !brand || !number || !paymentMethod) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // If this payment method is being set as default, unset all other defaults for this user
    if (isDefault) {
      await prisma.paymentMethod.updateMany({
        where: {
          userId: parseInt(userId),
          isDefault: true
        },
        data: {
          isDefault: false
        }
      });
    }

    const newPaymentMethod = await prisma.paymentMethod.create({
      data: {
        userId: parseInt(userId),
        brand,
        logo,
        number,
        expiry,
        cardholderName,
        cvv,
        zipCode,
        country: country || "United States",
        isDefault,
        paymentMethod,
        securityFeatures: securityFeatures || [],
        bankName,
        accountNumber,
        routingNumber,
        email,
        lastUsed: new Date()
      }
    });

    return NextResponse.json(newPaymentMethod, { status: 201 });
  } catch (error) {
    console.error('Error creating payment method:', error);
    return NextResponse.json({ error: 'Failed to create payment method' }, { status: 500 });
  }
} 