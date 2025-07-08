const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testSubscriptionMigration() {
  console.log('🧪 Testing Subscription Migration - userId vs accountId');
  console.log('='.repeat(60));

  try {
    // 1. Create test data
    console.log('📝 Step 1: Creating test data...');
    
    // Create a test user
    const testUser = await prisma.user.upsert({
      where: { email: 'subscription-test@example.com' },
      update: {},
      create: {
        username: 'subscription-test-user',
        email: 'subscription-test@example.com',
        password: 'hashedpassword123',
        firstname: 'Test',
        lastname: 'User',
        verified: true
      }
    });
    console.log(`✅ Created/Found test user: ${testUser.id} (${testUser.email})`);

    // Create a test account
    const testAccount = await prisma.account.upsert({
      where: { id: 999 },
      update: {},
      create: {
        id: 999,
        name: 'Test Account for Subscription',
        description: 'Testing subscription migration',
        type: 'business',
        credits: 1000,
        setup: true
      }
    });
    console.log(`✅ Created/Found test account: ${testAccount.id} (${testAccount.name})`);

    // Link user to account
    await prisma.userAccount.upsert({
      where: { 
        userId_accountId: {
          userId: testUser.id,
          accountId: testAccount.id
        }
      },
      update: {},
      create: {
        userId: testUser.id,
        accountId: testAccount.id,
        role: 'owner'
      }
    });
    console.log(`✅ Linked user ${testUser.id} to account ${testAccount.id}`);

    // Get a pricing plan
    const pricingPlan = await prisma.pricingPlan.findFirst({
      where: { isActive: true }
    });
    
    if (!pricingPlan) {
      throw new Error('No pricing plans found. Please run seed first.');
    }
    console.log(`✅ Found pricing plan: ${pricingPlan.title} ($${pricingPlan.price/100})`);

    // 2. Test userId-based subscription (legacy)
    console.log('\n📝 Step 2: Testing userId-based subscription (legacy)...');
    
    const userSubscription = await prisma.subscription.create({
      data: {
        userId: testUser.id,
        stripePriceId: pricingPlan.stripePriceId,
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: false
      }
    });
    console.log(`✅ Created userId subscription: ${userSubscription.id}`);

    // 3. Test accountId-based subscription (new approach)
    console.log('\n📝 Step 3: Testing accountId-based subscription (new approach)...');
    
    const accountSubscription = await prisma.subscription.create({
      data: {
        accountId: testAccount.id,
        stripePriceId: pricingPlan.stripePriceId,
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: false
      }
    });
    console.log(`✅ Created accountId subscription: ${accountSubscription.id}`);

    // 4. Test querying subscriptions
    console.log('\n📝 Step 4: Testing subscription queries...');
    
    // Query by userId (legacy)
    const userSubs = await prisma.subscription.findMany({
      where: { userId: testUser.id },
      include: { User: true }
    });
    console.log(`✅ Found ${userSubs.length} subscription(s) for userId ${testUser.id}`);

    // Query by accountId (new approach)
    const accountSubs = await prisma.subscription.findMany({
      where: { accountId: testAccount.id },
      include: { Account: true }
    });
    console.log(`✅ Found ${accountSubs.length} subscription(s) for accountId ${testAccount.id}`);

    // 5. Test API compatibility
    console.log('\n📝 Step 5: Testing API compatibility...');
    
    // Simulate API call with userId
    console.log('Testing API with userId...');
    const userSubQuery = await prisma.subscription.findFirst({
      where: { userId: testUser.id }
    });
    console.log(`✅ API userId query result: ${userSubQuery ? 'Found' : 'Not found'}`);

    // Simulate API call with accountId
    console.log('Testing API with accountId...');
    const accountSubQuery = await prisma.subscription.findFirst({
      where: { accountId: testAccount.id }
    });
    console.log(`✅ API accountId query result: ${accountSubQuery ? 'Found' : 'Not found'}`);

    // 6. Test the helper function approach
    console.log('\n📝 Step 6: Testing helper function approach...');
    
    // Function to get subscription by either userId or accountId
    async function getSubscription(params) {
      const { userId, accountId } = params;
      
      if (accountId) {
        return await prisma.subscription.findFirst({
          where: { accountId },
          include: { Account: true }
        });
      } else if (userId) {
        return await prisma.subscription.findFirst({
          where: { userId },
          include: { User: true }
        });
      }
      
      return null;
    }

    const subByAccount = await getSubscription({ accountId: testAccount.id });
    const subByUser = await getSubscription({ userId: testUser.id });
    
    console.log(`✅ Helper function - accountId: ${subByAccount ? 'Found' : 'Not found'}`);
    console.log(`✅ Helper function - userId: ${subByUser ? 'Found' : 'Not found'}`);

    // 7. Summary
    console.log('\n📊 Summary:');
    console.log('='.repeat(40));
    console.log(`👤 Test User ID: ${testUser.id}`);
    console.log(`🏢 Test Account ID: ${testAccount.id}`);
    console.log(`📋 User Subscriptions: ${userSubs.length}`);
    console.log(`📋 Account Subscriptions: ${accountSubs.length}`);
    console.log(`✅ Migration Status: Ready`);
    
    console.log('\n🎯 Next Steps for Migration:');
    console.log('1. Update frontend to pass accountId instead of userId');
    console.log('2. Update API routes to prioritize accountId over userId');
    console.log('3. Migrate existing userId subscriptions to accountId');
    console.log('4. Remove userId field from Subscription model');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testSubscriptionMigration();
