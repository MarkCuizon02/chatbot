const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testBillingHistory() {
  try {
    console.log('=== Testing Billing History ===\n');
    
    // 1. Check available accounts
    console.log('1. Checking available accounts...');
    const accounts = await prisma.account.findMany();
    console.log('Available accounts:');
    accounts.forEach(account => {
      console.log(`- ID: ${account.id}, Name: ${account.name}, Credits: ${account.credits}`);
    });
    console.log('');
    
    if (accounts.length === 0) {
      console.log('No accounts found. Please run the seed script first.');
      return;
    }
    
    const testAccount = accounts[0]; // Use the first available account
    
    // 2. Check existing invoices for this account
    console.log(`2. Checking existing invoices for account ${testAccount.id}...`);
    const invoices = await prisma.invoice.findMany({
      where: { accountId: testAccount.id },
      orderBy: { createdAt: 'desc' }
    });
    
    if (invoices.length === 0) {
      console.log('No invoices found for this account. Creating a test invoice...');
      
      // Create a test invoice
      const testInvoice = await prisma.invoice.create({
        data: {
          accountId: testAccount.id,
          stripeInvoiceId: `test_inv_${Date.now()}`,
          amountDue: 2000, // $20.00
          amountPaid: 2000,
          status: 'paid',
        }
      });
      console.log(`Created test invoice: ID ${testInvoice.id}, Amount: $${testInvoice.amountDue / 100}`);
    } else {
      console.log(`Found ${invoices.length} invoices for account ${testAccount.id}:`);
      invoices.forEach(invoice => {
        console.log(`- ID: ${invoice.id}, Amount: $${invoice.amountDue / 100}, Status: ${invoice.status}`);
      });
    }
    console.log('');
    
    // 3. Test API call for the account
    console.log(`3. Testing billing history API for account ${testAccount.id}...`);
    try {
      const response = await fetch(`http://localhost:3002/api/billing/history?accountId=${testAccount.id}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ API call successful!');
        console.log(`Found ${data.count} billing records:`);
        data.data.forEach(record => {
          console.log(`- ${record.description}: $${record.amount / 100} (${record.status}) - ${new Date(record.date).toLocaleDateString()}`);
        });
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.log('❌ API call failed:');
        console.log(`Status: ${response.status}`);
        console.log(`Error: ${errorData.error}`);
      }
    } catch (apiError) {
      console.log('❌ API call failed with network error:');
      console.log(apiError.message);
      console.log('Make sure the dev server is running on localhost:3002');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testBillingHistory();
