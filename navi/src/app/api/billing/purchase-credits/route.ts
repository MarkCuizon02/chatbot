import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getCreditPackPrice } from '@/lib/creditPricing';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accountId, credits, applyDiscount = false } = body;

    if (!accountId || !credits) {
      return NextResponse.json(
        { error: 'Account ID and credits are required' },
        { status: 400 }
      );
    }

    // Calculate price using the new pricing system
    let totalPrice = getCreditPackPrice(credits);
    
    // Apply 20% discount if requested (for monthly subscribers)
    if (applyDiscount) {
      totalPrice = totalPrice * 0.8;
    }

    // Generate invoice number
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Get count of invoices for this year/month to generate sequential number
    const invoiceCount = await prisma.invoice.count({
      where: {
        accountId: parseInt(accountId),
        createdAt: {
          gte: new Date(year, date.getMonth(), 1),
          lt: new Date(year, date.getMonth() + 1, 1),
        },
      },
    });
    
    const invoiceNumber = `INV-${year}-${month}-${String(invoiceCount + 1).padStart(3, '0')}`;

    // Create invoice for credits purchase
    const invoice = await prisma.invoice.create({
      data: {
        accountId: parseInt(accountId),
        subscriptionId: null, // This is a credits purchase, not a subscription
        stripeInvoiceId: `credits_${Date.now()}`, // Generate a unique ID for credits
        amountDue: totalPrice,
        amountPaid: 0, // Will be updated when payment is processed
        currency: 'usd',
        status: 'pending',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        paidAt: null,
      },
    });

    // Here you would typically integrate with Stripe to process the payment
    // For now, we'll simulate a successful payment
    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        amountPaid: totalPrice,
        status: 'paid',
        paidAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        invoiceId: invoice.id,
        invoiceNumber: invoiceNumber,
        credits: credits,
        totalPrice: totalPrice,
        status: 'paid',
        discountApplied: applyDiscount,
        message: 'Credits purchased successfully!',
      },
    });

  } catch (error) {
    console.error('Error purchasing credits:', error);
    return NextResponse.json(
      { error: 'Failed to purchase credits', details: error.message },
      { status: 500 }
    );
  }
} 