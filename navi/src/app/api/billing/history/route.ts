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
      accountId,
      description,
      amount,
      type = 'credits',
      stripeInvoiceId,
    } = body;

    if (!accountId || !description || !amount) {
      return NextResponse.json(
        { error: 'Account ID, description, and amount are required' },
        { status: 400 }
      );
    }

    // Create new invoice
    const invoice = await prisma.invoice.create({
      data: {
        accountId: parseInt(accountId),
        subscriptionId: stripeInvoiceId,
        stripeInvoiceId,
        amountDue: amount, // Amount should already be in correct format
        amountPaid: 0, // Initially unpaid
        status: 'pending',
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: invoice.stripeInvoiceId,
        plan: description,
        date: invoice.createdAt.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        status: invoice.status,
        amount: invoice.amountDue.toFixed(2),
        type: type.toLowerCase() === 'subscription' ? 'plan' : 'credits',
        stripeInvoiceId: invoice.stripeInvoiceId,
        accountId: invoice.accountId,
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