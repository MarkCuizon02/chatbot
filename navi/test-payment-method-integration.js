const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testPaymentMethodIntegration() {
  console.log('🧪 Testing Payment Method Integration...');
  
  try {
    // 1. Check if we can create a test payment method
    console.log('1. Creating test payment method...');
    
    // First, ensure we have a test user
    const testUser = await prisma.user.findFirst({
      where: { email: 'test@example.com' }
    });
    
    if (!testUser) {
      console.log('❌ No test user found. Creating one...');
      const newUser = await prisma.user.create({
        data: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          firstname: 'Test',
          lastname: 'User',
          verified: true
        }
      });
      console.log('✅ Created test user:', newUser.id);
    }
    
    const user = testUser || await prisma.user.findFirst({
      where: { email: 'test@example.com' }
    });
    
    // 2. Create a test payment method
    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        userId: user.id,
        brand: 'Visa',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png',
        number: '****1234',
        expiry: '12/25',
        cardholderName: 'Test User',
        isDefault: true,
        paymentMethod: 'card',
        status: 'active',
        lastUsed: new Date(),
        securityFeatures: ['3D Secure', 'Fraud Protection'],
        zipCode: '12345',
        country: 'US'
      }
    });
    
    console.log('✅ Created payment method:', paymentMethod.id);
    
    // 3. Fetch all payment methods for user
    console.log('2. Fetching payment methods...');
    const paymentMethods = await prisma.paymentMethod.findMany({
      where: { userId: user.id }
    });
    
    console.log('✅ Found', paymentMethods.length, 'payment methods');
    
    // 4. Update payment method
    console.log('3. Updating payment method...');
    const updatedPaymentMethod = await prisma.paymentMethod.update({
      where: { id: paymentMethod.id },
      data: { 
        lastUsed: new Date(),
        status: 'active'
      }
    });
    
    console.log('✅ Updated payment method:', updatedPaymentMethod.id);
    
    // 5. Delete payment method
    console.log('4. Deleting payment method...');
    await prisma.paymentMethod.delete({
      where: { id: paymentMethod.id }
    });
    
    console.log('✅ Deleted payment method:', paymentMethod.id);
    
    console.log('🎉 All tests passed! Payment method integration is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testPaymentMethodIntegration();
