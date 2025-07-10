const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestAccount() {
  console.log('🧪 Creating Test Account for Payment Integration...');
  
  try {
    // Find the test user we created earlier
    const testUser = await prisma.user.findFirst({
      where: { email: 'test@example.com' }
    });
    
    if (!testUser) {
      console.log('❌ Test user not found. Please run the payment method integration test first.');
      return;
    }
    
    console.log('✅ Found test user:', testUser.id);
    
    // Create a test account
    const testAccount = await prisma.account.create({
      data: {
        name: 'Test Account',
        description: 'Test account for payment integration',
        type: 'personal',
        setup: true
      }
    });
    
    console.log('✅ Created test account:', testAccount.id);
    
    // Link the user to the account
    const userAccount = await prisma.userAccount.create({
      data: {
        userId: testUser.id,
        accountId: testAccount.id,
        role: 'owner'
      }
    });
    
    console.log('✅ Linked user to account:', userAccount.id);
    
    console.log('🎉 Test account setup complete!');
    console.log('   User ID:', testUser.id);
    console.log('   Account ID:', testAccount.id);
    
  } catch (error) {
    console.error('❌ Failed to create test account:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
createTestAccount();
