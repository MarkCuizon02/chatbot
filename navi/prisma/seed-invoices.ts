import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedInvoices() {
  console.log('💰 Seeding sample invoices...');

  try {
    // First, let's check if we have any accounts
    const accounts = await prisma.account.findMany();
    
    if (accounts.length === 0) {
      console.log('No accounts found. Creating a sample account first...');
      const account = await prisma.account.create({
        data: {
          name: 'Sample Account',
          description: 'Sample account for testing',
          type: 'personal',
          credits: 1000,
          setup: true,
        },
      });
      console.log('Created account:', account.id);
    }

    // Get the first account (or create one if none exists)
    let account = accounts[0];
    if (!account) {
      account = await prisma.account.findFirst();
    }

    if (!account) {
      console.log('No account available for seeding invoices');
      return;
    }

    // Create sample invoices
    const sampleInvoices = [
      {
        accountId: account.id,
        subscriptionId: 'sub_sample_001',
        stripeInvoiceId: 'in_sample_001',
        amountDue: 99.00,
        amountPaid: 99.00,
        currency: 'usd',
        status: 'paid',
        dueDate: new Date('2025-01-05'),
        paidAt: new Date('2025-01-05'),
      },
      {
        accountId: account.id,
        subscriptionId: 'sub_sample_002',
        stripeInvoiceId: 'in_sample_002',
        amountDue: 99.00,
        amountPaid: 99.00,
        currency: 'usd',
        status: 'paid',
        dueDate: new Date('2025-02-05'),
        paidAt: new Date('2025-02-05'),
      },
      {
        accountId: account.id,
        subscriptionId: 'sub_sample_003',
        stripeInvoiceId: 'in_sample_003',
        amountDue: 99.00,
        amountPaid: 0.00,
        currency: 'usd',
        status: 'pending',
        dueDate: new Date('2025-03-05'),
        paidAt: null,
      },
      {
        accountId: account.id,
        subscriptionId: null,
        stripeInvoiceId: 'in_credits_001',
        amountDue: 50.00,
        amountPaid: 50.00,
        currency: 'usd',
        status: 'paid',
        dueDate: new Date('2025-01-15'),
        paidAt: new Date('2025-01-15'),
      },
      {
        accountId: account.id,
        subscriptionId: null,
        stripeInvoiceId: 'in_credits_002',
        amountDue: 25.00,
        amountPaid: 0.00,
        currency: 'usd',
        status: 'failed',
        dueDate: new Date('2025-02-20'),
        paidAt: null,
      },
    ];

    for (const invoiceData of sampleInvoices) {
      const invoice = await prisma.invoice.upsert({
        where: { stripeInvoiceId: invoiceData.stripeInvoiceId },
        update: invoiceData,
        create: invoiceData,
      });
      console.log(`Created/Updated invoice: ${invoice.stripeInvoiceId} - $${invoice.amountDue}`);
    }

    console.log('✅ Sample invoices seeded successfully!');
    
    // Show summary
    const totalInvoices = await prisma.invoice.count();
    console.log(`Total invoices in database: ${totalInvoices}`);

  } catch (error) {
    console.error('❌ Error seeding invoices:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedInvoices(); 