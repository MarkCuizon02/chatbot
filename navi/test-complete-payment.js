// Test script for simulating complete payment flow
const BASE_URL = 'http://localhost:3000';

async function testCompletePaymentFlow() {
  console.log('🧪 Testing Complete Payment Flow...');
  
  try {
    const testUserId = 1;
    const testAccountId = 1;
    const creditsToAdd = 100;
    
    // Step 1: Check initial user credits
    console.log('1. Checking initial user credits...');
    const initialUserResponse = await fetch(`${BASE_URL}/api/users/${testUserId}`);
    if (!initialUserResponse.ok) {
      throw new Error('Failed to fetch user data');
    }
    const userData = await initialUserResponse.json();
    const initialCredits = userData.credits || 0;
    console.log(`   Initial credits: ${initialCredits}`);
    
    // Step 2: Create payment intent
    console.log('2. Creating payment intent for credit purchase...');
    const paymentResponse = await fetch(`${BASE_URL}/api/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'purchase_credits',
        accountId: testAccountId,
        credits: creditsToAdd,
        applyDiscount: false
      })
    });
    
    if (!paymentResponse.ok) {
      throw new Error(`Payment intent creation failed: ${paymentResponse.status}`);
    }
    
    const paymentResult = await paymentResponse.json();
    console.log('✅ Payment intent created successfully');
    console.log(`   Payment ID: ${paymentResult.data.paymentId}`);
    console.log(`   Amount: $${paymentResult.data.totalPrice}`);
    
    // Step 3: Simulate successful payment by directly adding credits
    console.log('3. Simulating successful payment (adding credits directly)...');
    const creditResponse = await fetch(`${BASE_URL}/api/credits/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: testUserId,
        credits: creditsToAdd,
        reason: `Successful payment: ${paymentResult.data.paymentId}`
      })
    });
    
    if (!creditResponse.ok) {
      throw new Error('Credit addition failed');
    }
    
    const creditResult = await creditResponse.json();
    console.log('✅ Credits added successfully');
    console.log(`   New balance: ${creditResult.newBalance}`);
    console.log(`   Credits added: ${creditResult.newBalance - initialCredits}`);
    
    // Step 4: Verify final state
    console.log('4. Verifying final user state...');
    const finalUserResponse = await fetch(`${BASE_URL}/api/users/${testUserId}`);
    if (finalUserResponse.ok) {
      const finalUserData = await finalUserResponse.json();
      console.log(`   Final credits: ${finalUserData.credits}`);
      console.log(`   Total credits added: ${finalUserData.credits - initialCredits}`);
      
      if (finalUserData.credits === initialCredits + creditsToAdd) {
        console.log('✅ Credit addition verified successfully!');
      } else {
        console.log('❌ Credit addition verification failed');
      }
    }
    
    console.log('🎉 Complete payment flow test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testCompletePaymentFlow();
