import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    console.log('Testing billing API...');
    
    // Get all invoices
    const invoices = await prisma.invoice.findMany({
      take: 5, // Limit to 5 for testing
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`Found ${invoices.length} invoices`);

    // Transform to simple format
    const billingHistory = invoices.map((invoice) => ({
      id: invoice.stripeInvoiceId,
      amount: invoice.amountDue,
      status: invoice.status,
      date: invoice.createdAt.toISOString(),
      accountId: invoice.accountId,
    }));

    return NextResponse.json({
      success: true,
      count: invoices.length,
      data: billingHistory,
    });

  } catch (error) {
    console.error('Error in test API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices', details: error.message },
      { status: 500 }
    );
  }
} 