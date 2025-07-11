import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestAccount() {
  console.log('🏢 Creating test account...');
  
  // Create an account
  const account = await prisma.account.create({
    data: {
      name: 'Test Account',
      description: 'Test account for development',
      type: 'personal',
      setup: true
    }
  });

  console.log(`✅ Created account: ${account.name} (ID: ${account.id})`);

  // Link the test user to this account
  const userAccount = await prisma.userAccount.create({
    data: {
      userId: 1, // The test user ID
      accountId: account.id,
      role: 'owner'
    }
  });

  console.log(`🔗 Linked user 1 to account ${account.id} with role: ${userAccount.role}`);

  await prisma.$disconnect();
}

createTestAccount().catch(console.error);
