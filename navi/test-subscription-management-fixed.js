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
      
      if (subscriptions.length > 0) {
        console.log('📋 Existing subscriptions:');
        subscriptions.forEach((sub, index) => {
          console.log(`  ${index + 1}. Status: ${sub.status}, Account: ${sub.accountId}`);
        });
      }
    } else {
      console.log('❌ Failed to fetch subscriptions');
    }
    
    console.log('\n📋 Step 2: Fetching pricing plans...');
    const plansResponse = await fetch(`${BASE_URL}/api/pricing-plans`);
    if (plansResponse.ok) {
      const plansResult = await plansResponse.json();
      const pricingPlans = plansResult.data || plansResult;
      console.log('✅ Available pricing plans:', pricingPlans.length);
      
      if (pricingPlans.length > 0) {
        console.log('📋 Plans available:');
        pricingPlans.forEach((plan) => {
          console.log(`  - ${plan.title}: $${plan.price}${plan.billing} (${plan.credits} credits)`);
        });
      }
    } else {
      console.log('❌ Failed to fetch pricing plans');
    }
    
    console.log('\n📋 Step 3: Testing subscription creation...');
    
    // Get the first available plan
    const plansResponse2 = await fetch(`${BASE_URL}/api/pricing-plans`);
    const plansResult2 = await plansResponse2.json();
    const plans = plansResult2.data || plansResult2;
    
    if (plans.length > 0) {
      const testPlan = plans[0];
      console.log(`🔍 Creating subscription with plan: ${testPlan.title}`);
      
      const createResponse = await fetch(`${BASE_URL}/api/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: testUserId,
          accountId: testAccountId,
          planId: testPlan.id,
          status: 'ACTIVE'
        })
      });
      
      if (createResponse.ok) {
        const newSubscription = await createResponse.json();
        console.log('✅ Subscription created successfully:', newSubscription.subscription.id);
        
        // Test updating the subscription
        console.log('\n📋 Step 4: Testing subscription update...');
        const updateResponse = await fetch(`${BASE_URL}/api/subscriptions/${newSubscription.subscription.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'ACTIVE',
            cancelAtPeriodEnd: false
          })
        });
        
        if (updateResponse.ok) {
          const updatedSubscription = await updateResponse.json();
          console.log('✅ Subscription updated successfully');
        } else {
          console.log('❌ Failed to update subscription');
        }
        
        // Test canceling the subscription
        console.log('\n📋 Step 5: Testing subscription cancellation...');
        const cancelResponse = await fetch(`${BASE_URL}/api/subscriptions/${newSubscription.subscription.id}/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (cancelResponse.ok) {
          const canceledSubscription = await cancelResponse.json();
          console.log('✅ Subscription canceled successfully');
        } else {
          console.log('❌ Failed to cancel subscription');
        }
        
        // Test reactivating the subscription
        console.log('\n📋 Step 6: Testing subscription reactivation...');
        const reactivateResponse = await fetch(`${BASE_URL}/api/subscriptions/${newSubscription.subscription.id}/reactivate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            planId: testPlan.id
          })
        });
        
        if (reactivateResponse.ok) {
          const reactivatedSubscription = await reactivateResponse.json();
          console.log('✅ Subscription reactivated successfully');
        } else {
          console.log('❌ Failed to reactivate subscription');
        }
        
        // Test plan change
        if (plans.length > 1) {
          console.log('\n📋 Step 7: Testing plan change...');
          const newPlan = plans[1];
          const changeResponse = await fetch(`${BASE_URL}/api/subscriptions/${newSubscription.subscription.id}/change-plan`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              planId: newPlan.id
            })
          });
          
          if (changeResponse.ok) {
            const changedSubscription = await changeResponse.json();
            console.log('✅ Plan changed successfully to:', newPlan.title);
          } else {
            console.log('❌ Failed to change plan');
          }
        }
        
        // Clean up - delete the test subscription
        console.log('\n📋 Step 8: Cleaning up test subscription...');
        const deleteResponse = await fetch(`${BASE_URL}/api/subscriptions/${newSubscription.subscription.id}`, {
          method: 'DELETE'
        });
        
        if (deleteResponse.ok) {
          console.log('✅ Test subscription deleted successfully');
        } else {
          console.log('❌ Failed to delete test subscription');
        }
        
      } else {
        console.log('❌ Failed to create subscription');
      }
    } else {
      console.log('❌ No pricing plans available for testing');
    }
    
    console.log('\n🎉 Subscription management test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testSubscriptionManagement().catch(console.error);
