// Test script for subscription management
const BASE_URL = 'http://localhost:3000';

async function testSubscriptionManagement() {
  console.log('🚀 Starting subscription management test...\n');
  
  const testUserId = 1;
  const testAccountId = 1;
  
  try {
    console.log('📋 Step 1: Fetching current subscriptions...');
    const subsResponse = await fetch(`${BASE_URL}/api/subscriptions?userId=${testUserId}`);
    if (subsResponse.ok) {
      const subscriptions = await subsResponse.json();
      console.log('✅ Current subscriptions:', subscriptions.length);
    } else {
      console.log('❌ Failed to fetch subscriptions');
    }
    
    console.log('\n📋 Step 2: Fetching pricing plans...');
    const plansResponse = await fetch(`${BASE_URL}/api/pricing-plans`);
    if (plansResponse.ok) {
      const plansResult = await plansResponse.json();
      const pricingPlans = plansResult.data || plansResult;
      console.log('✅ Available pricing plans:', pricingPlans.length);
    } else {
      console.log('❌ Failed to fetch pricing plans');
    }
      pricingPlans.forEach(plan => {
        console.log(`  - ${plan.title}: $${plan.price}${plan.billing} (${plan.credits} credits)`);
      });
    }
    
    console.log('\n📋 Step 3: Testing subscription API endpoints...');
    
    // Test GET /api/subscriptions
    console.log('🔍 Testing GET /api/subscriptions...');
    const response = await fetch(`http://localhost:3000/api/subscriptions?userId=${testUserId}`);
    if (response.ok) {
      const subscriptions = await response.json();
      console.log('✅ GET /api/subscriptions successful:', subscriptions.length, 'subscriptions');
    } else {
      console.log('❌ GET /api/subscriptions failed:', response.status);
    }
    
    // Test GET /api/pricing-plans
    console.log('🔍 Testing GET /api/pricing-plans...');
    const plansResponse = await fetch('http://localhost:3000/api/pricing-plans');
    if (plansResponse.ok) {
      const plans = await plansResponse.json();
      console.log('✅ GET /api/pricing-plans successful:', plans.data?.length || plans.length, 'plans');
    } else {
      console.log('❌ GET /api/pricing-plans failed:', plansResponse.status);
    }
    
    // Test subscription creation if we have plans
    if (pricingPlans.length > 0) {
      const testPlan = pricingPlans[0];
      console.log(`\n🔍 Testing subscription creation for plan: ${testPlan.title}...`);
      
      const createResponse = await fetch('http://localhost:3000/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: testUserId,
          accountId: testAccountId,
          planId: testPlan.id,
          stripePriceId: testPlan.stripePriceId
        }),
      });
      
      if (createResponse.ok) {
        const newSubscription = await createResponse.json();
        console.log('✅ Subscription created successfully:', newSubscription.id);
        
        // Test subscription update
        console.log('🔍 Testing subscription update...');
        const updateResponse = await fetch(`http://localhost:3000/api/subscriptions/${newSubscription.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'ACTIVE'
          }),
        });
        
        if (updateResponse.ok) {
          console.log('✅ Subscription updated successfully');
        } else {
          console.log('❌ Subscription update failed:', updateResponse.status);
        }
        
        // Test subscription cancellation
        console.log('🔍 Testing subscription cancellation...');
        const cancelResponse = await fetch(`http://localhost:3000/api/subscriptions/${newSubscription.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reason: 'Testing',
            cancelAtPeriodEnd: false
          }),
        });
        
        if (cancelResponse.ok) {
          console.log('✅ Subscription canceled successfully');
          
          // Test subscription reactivation
          console.log('🔍 Testing subscription reactivation...');
          const reactivateResponse = await fetch(`http://localhost:3000/api/subscriptions/${newSubscription.id}/reactivate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              planId: testPlan.id
            }),
          });
          
          if (reactivateResponse.ok) {
            console.log('✅ Subscription reactivated successfully');
          } else {
            console.log('❌ Subscription reactivation failed:', reactivateResponse.status);
          }
        } else {
          console.log('❌ Subscription cancellation failed:', cancelResponse.status);
        }
      } else {
        console.log('❌ Subscription creation failed:', createResponse.status);
        const error = await createResponse.json();
        console.log('Error details:', error);
      }
    }
    
    console.log('\n🎉 Subscription management test completed!');
    console.log('\n📊 Summary:');
    console.log('- Pricing plans loaded:', pricingPlans.length);
    console.log('- Initial subscriptions:', initialSubscriptions.length);
    console.log('- API endpoints tested: 4+');
    console.log('\n🌐 You can now visit: http://localhost:3000/billing/plan');
    console.log('   to see the new subscription management interface!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testSubscriptionManagement();
