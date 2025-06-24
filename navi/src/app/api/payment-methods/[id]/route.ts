import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    if (!paymentMethod) {
      return NextResponse.json({ error: 'Payment method not found' }, { status: 404 });
    }

    return NextResponse.json(paymentMethod);
  } catch (error) {
    console.error('Error fetching payment method:', error);
    return NextResponse.json({ error: 'Failed to fetch payment method' }, { status: 500 });
  }
}

// PUT /api/payment-methods/[id] - Update a payment method
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
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

    // Get the current payment method to check if we need to update defaults
    const currentPaymentMethod = await prisma.paymentMethod.findUnique({
      where: { id: parseInt(id) }
    });

    if (!currentPaymentMethod) {
      return NextResponse.json({ error: 'Payment method not found' }, { status: 404 });
    }

    // If this payment method is being set as default, unset all other defaults for this user
    if (isDefault && !currentPaymentMethod.isDefault) {
      await prisma.paymentMethod.updateMany({
        where: {
          userId: currentPaymentMethod.userId,
          isDefault: true,
          id: { not: parseInt(id) }
        },
        data: {
          isDefault: false
        }
      });
    }

    const updatedPaymentMethod = await prisma.paymentMethod.update({
      where: {
        id: parseInt(id)
      },
      data: {
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
        email,
        lastUsed: new Date()
      }
    });

    return NextResponse.json(updatedPaymentMethod);
  } catch (error) {
    console.error('Error updating payment method:', error);
    return NextResponse.json({ error: 'Failed to update payment method' }, { status: 500 });
  }
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: { id: parseInt(id) }
    });

    if (!paymentMethod) {
      return NextResponse.json({ error: 'Payment method not found' }, { status: 404 });
    }

    // If this was the default payment method, set the first available one as default
    if (paymentMethod.isDefault) {
      const nextDefault = await prisma.paymentMethod.findFirst({
        where: {
          userId: paymentMethod.userId,
          id: { not: parseInt(id) },
          isDeleted: false
        },
        orderBy: { createdAt: 'desc' }
      });

      if (nextDefault) {
        await prisma.paymentMethod.update({
          where: { id: nextDefault.id },
          data: { isDefault: true }
        });
      }
    }

    // Soft delete: set isDeleted to true and deletedAt to now
    await prisma.paymentMethod.update({
      where: { id: parseInt(id) },
      data: { isDeleted: true, deletedAt: new Date() }
    });

    return NextResponse.json({ message: 'Payment method soft deleted successfully' });
  } catch (error) {
    console.error('Error soft deleting payment method:', error);
    return NextResponse.json({ error: 'Failed to soft delete payment method' }, { status: 500 });
  }
} 