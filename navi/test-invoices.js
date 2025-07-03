const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testInvoices() {
  try {
    console.log('Testing invoice data...');
    
    // Get all accounts
    const accounts = await prisma.account.findMany();
    console.log('Accounts found:', accounts.length);
    accounts.forEach(acc => console.log(`- Account ID: ${acc.id}, Name: ${acc.name}`));
    
    // Get all invoices
    const invoices = await prisma.invoice.findMany();
    console.log('Invoices found:', invoices.length);
    invoices.forEach(inv => console.log(`- Invoice: ${inv.stripeInvoiceId}, Amount: $${inv.amountDue}, Status: ${inv.status}`));
    
    // Test specific account
    if (accounts.length > 0) {
      const accountId = accounts[0].id;
      console.log(`\nTesting invoices for account ${accountId}:`);
      
      const accountInvoices = await prisma.invoice.findMany({
        where: { accountId: accountId },
        include: { account: true }
      });
      
      console.log(`Found ${accountInvoices.length} invoices for account ${accountId}`);
      accountInvoices.forEach(inv => {
        console.log(`- ${inv.stripeInvoiceId}: $${inv.amountDue} (${inv.status}) - ${inv.account?.name}`);
      });
    }
    
  } catch (error) {
    console.error('Error testing invoices:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testInvoices(); 