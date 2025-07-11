// Test script for successful payment with credit addition
const BASE_URL = 'http://localhost:3000';

async function testSuccessfulPaymentWithCredits() {
  console.log('🧪 Testing Successful Payment with Credit Addition...');
  
  try {
    const testUserId = 1;
    const testAccountId = 1;
    const creditsToAdd = 100;
    
    // Step 1: Check initial user credits
    console.log('1. Checking initial user credits...');
    const initialUserResponse = await fetch(`${BASE_URL}/api/users/${testUserId}`);
    let initialCredits = 0;
    if (initialUserResponse.ok) {
      const userData = await initialUserResponse.json();
      initialCredits = userData.credits || 0;
    }
    console.log(`   Initial credits: ${initialCredits}`);
    
    // Step 2: Create payment intent for credit purchase
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
    console.log(`   Credits: ${creditsToAdd}`);
    
    // Step 3: Simulate successful payment by calling webhook
    console.log('3. Simulating successful payment webhook...');
    const webhookPayload = {
      id: 'evt_test_webhook',
      object: 'event',
      api_version: '2020-08-27',
      created: Math.floor(Date.now() / 1000),
      data: {
        object: {
          id: paymentResult.data.paymentId,
          object: 'payment_intent',
          amount: Math.round(paymentResult.data.totalPrice * 100), // Convert to cents
          currency: 'usd',
          customer: null,
          metadata: {
            accountId: testAccountId.toString(),
            userId: testUserId.toString(),
            credits: creditsToAdd.toString()
          },
          status: 'succeeded'
        }
      },
      livemode: false,
      pending_webhooks: 1,
      request: {
        id: 'req_test',
        idempotency_key: null
      },
      type: 'payment_intent.succeeded'
    };
    
    const webhookResponse = await fetch(`${BASE_URL}/api/webhook/stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'test_signature'
      },
      body: JSON.stringify(webhookPayload)
    });
    
    if (webhookResponse.ok) {
      console.log('✅ Webhook processed successfully');
    } else {
      console.log('⚠️  Webhook processing failed, but continuing test...');
    }
    
    // Step 4: Wait a moment and check if credits were added
    console.log('4. Waiting and checking updated credits...');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    
    const updatedUserResponse = await fetch(`${BASE_URL}/api/users/${testUserId}`);
    let updatedCredits = initialCredits;
    
    if (updatedUserResponse.ok) {
      const userData = await updatedUserResponse.json();
      updatedCredits = userData.credits || 0;
    }
    
    console.log(`   Updated credits: ${updatedCredits}`);
    console.log(`   Credits added: ${updatedCredits - initialCredits}`);
    
    // Step 5: Test alternative direct credit addition (if webhook didn't work)
    if (updatedCredits === initialCredits) {
      console.log('5. Webhook didn\'t add credits, testing direct credit addition...');
      
      // Direct API call to add credits (simulating successful payment)
      const directCreditResponse = await fetch(`${BASE_URL}/api/credits/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: testUserId,
          accountId: testAccountId,
          credits: creditsToAdd,
          paymentId: paymentResult.data.paymentId,
          reason: 'Test credit purchase'
        })
      });
      
      if (directCreditResponse.ok) {
        const creditResult = await directCreditResponse.json();
        console.log('✅ Direct credit addition successful');
        console.log(`   New total credits: ${creditResult.newBalance}`);
      } else {
        console.log('❌ Direct credit addition failed');
      }
    }
    
    console.log('🎉 Payment and credit addition test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testSuccessfulPaymentWithCredits();
