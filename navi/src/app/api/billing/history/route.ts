import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get account ID from query params
    const searchParams = request.nextUrl.searchParams;
    const accountId = searchParams.get('accountId');

    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }

    // Fetch invoices from the database
    const invoices = await prisma.invoice.findMany({
      where: {
        accountId: parseInt(accountId),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the data to match the expected format
    const billingHistory = invoices.map((invoice) => {
      // Determine type based on subscriptionId
      const isPlan = !!invoice.subscriptionId;
      const type = isPlan ? 'plan' : 'credits';
      
      // Generate description based on type and amount
      const description = isPlan 
        ? `Subscription Plan` 
        : `${invoice.amountDue} Credits Purchase`;

      return {
        id: invoice.stripeInvoiceId,
        amount: invoice.amountDue,
        status: invoice.status,
        date: invoice.createdAt.toISOString(),
        accountId: invoice.accountId,
        invoiceId: invoice.id,
        type,
        description,
      };
    });

    return NextResponse.json({
      success: true,
      count: invoices.length,
      data: billingHistory,
    });

  } catch (error) {
    console.error('Error fetching billing history:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch billing history', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      description,
      amount,
      type = 'SUBSCRIPTION',
      planName,
      creditsAmount,
      paymentMethodId,
      stripeInvoiceId,
      notes,
    } = body;

    if (!userId || !description || !amount) {
      return NextResponse.json(
        { error: 'User ID, description, and amount are required' },
        { status: 400 }
      );
    }

    // Generate invoice number
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Get count of invoices for this year/month to generate sequential number
    const invoiceCount = await prisma.invoice.count({
      where: {
        userId: parseInt(userId),
        billingDate: {
          gte: new Date(year, date.getMonth(), 1),
          lt: new Date(year, date.getMonth() + 1, 1),
        },
      },
    });
    
    const invoiceNumber = `INV-${year}-${month}-${String(invoiceCount + 1).padStart(3, '0')}`;

    // Create new invoice
    const invoice = await prisma.invoice.create({
      data: {
        userId: parseInt(userId),
        invoiceNumber,
        stripeInvoiceId,
        description,
        amount: Math.round(amount * 100), // Convert dollars to cents
        type: type as any,
        planName,
        creditsAmount,
        paymentMethodId: paymentMethodId ? parseInt(paymentMethodId) : null,
        notes,
        billingDate: new Date(),
        status: 'PENDING',
      },
      include: {
        paymentMethod: {
          select: {
            brand: true,
            number: true,
            last4: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: invoice.invoiceNumber,
        plan: invoice.description,
        date: invoice.billingDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        status: 'Pending',
        amount: (invoice.amount / 100).toFixed(2),
        type: invoice.type === 'SUBSCRIPTION' ? 'plan' : 'credits',
        stripeInvoiceId: invoice.stripeInvoiceId,
        creditsAmount: invoice.creditsAmount,
        paymentMethod: invoice.paymentMethod ? {
          brand: invoice.paymentMethod.brand,
          last4: invoice.paymentMethod.last4 || '****',
        } : null,
      },
    });

  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
} 