// Test script for subscription APIs
const BASE_URL = 'http://localhost:3000';

async function testSubscriptionAPIs() {
  console.log('🧪 Testing Subscription APIs...');
  
  try {
    const testUserId = 1;
    const testAccountId = 1;
    
    // 1. Test GET pricing plans
    console.log('1. Testing GET /api/pricing-plans...');
    const plansResponse = await fetch(`${BASE_URL}/api/pricing-plans`);
    if (plansResponse.ok) {
      const plansResult = await plansResponse.json();
      const plans = plansResult.data || plansResult;
      console.log(`✅ Found ${plans.length} pricing plans`);
    } else {
      console.log('❌ Failed to fetch pricing plans');
    }
    
    // 2. Test GET subscriptions (should be empty initially)
    console.log('2. Testing GET /api/subscriptions...');
    const subsResponse = await fetch(`${BASE_URL}/api/subscriptions?userId=${testUserId}`);
    if (subsResponse.ok) {
      const subscriptions = await subsResponse.json();
      console.log(`✅ Found ${subscriptions.length} existing subscriptions`);
    } else {
      console.log('❌ Failed to fetch subscriptions');
    }
    
    // 3. Test POST subscription creation
    console.log('3. Testing POST /api/subscriptions...');
    const createResponse = await fetch(`${BASE_URL}/api/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: testUserId,
        accountId: testAccountId,
        stripePriceId: 'price_professional_monthly'
      }),
    });
    
    let subscriptionId = null;
    if (createResponse.ok) {
      const createResult = await createResponse.json();
      subscriptionId = createResult.subscription.id;
      console.log(`✅ Created subscription with ID: ${subscriptionId}`);
    } else {
      const error = await createResponse.json();
      console.log(`❌ Failed to create subscription: ${error.error}`);
    }
    
    if (subscriptionId) {
      // 4. Test PUT subscription update
      console.log('4. Testing PUT /api/subscriptions/[id]...');
      const updateResponse = await fetch(`${BASE_URL}/api/subscriptions/${subscriptionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cancelAtPeriodEnd: true
        }),
      });
      
      if (updateResponse.ok) {
        console.log('✅ Updated subscription successfully');
      } else {
        console.log('❌ Failed to update subscription');
      }
      
      // 5. Test GET single subscription
      console.log('5. Testing GET /api/subscriptions/[id]...');
      const getOneResponse = await fetch(`${BASE_URL}/api/subscriptions/${subscriptionId}`);
      if (getOneResponse.ok) {
        const subscription = await getOneResponse.json();
        console.log(`✅ Retrieved subscription: ${subscription.status}, Cancel at period end: ${subscription.cancelAtPeriodEnd}`);
      } else {
        console.log('❌ Failed to get subscription');
      }
      
      // 6. Test DELETE subscription (cancel)
      console.log('6. Testing DELETE /api/subscriptions/[id]...');
      const deleteResponse = await fetch(`${BASE_URL}/api/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
      });
      
      if (deleteResponse.ok) {
        const deleteResult = await deleteResponse.json();
        console.log(`✅ Canceled subscription: ${deleteResult.subscription.status}`);
      } else {
        console.log('❌ Failed to cancel subscription');
      }
    }
    
    console.log('🎉 All subscription API tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testSubscriptionAPIs();
