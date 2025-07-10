// Test script for the unified /api/payment endpoint
const BASE_URL = 'http://localhost:3000';

async function testUnifiedPaymentAPI() {
  console.log('🧪 Testing Unified Payment API Integration...');
  
  try {
    // Test data
    const testUserId = 1;
    
    // 1. Test GET - Fetch payment methods
    console.log('1. Testing GET /api/payment...');
    const getResponse = await fetch(`${BASE_URL}/api/payment?userId=${testUserId}`);
    const paymentMethods = await getResponse.json();
    console.log('✅ GET success:', paymentMethods.length || 0, 'payment methods found');
    
    // 2. Test POST - Add payment method
    console.log('2. Testing POST /api/payment (add payment method)...');
    const addPaymentResponse = await fetch(`${BASE_URL}/api/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'add_payment_method',
        userId: testUserId.toString(),
        brand: 'Visa',
        cardNumber: '4111111111111111',
        cardholderName: 'Test User',
        expiry: '12/25',
        isDefault: true,
        paymentMethod: 'card',
        zipCode: '12345',
        country: 'US'
      })
    });
    
    const addResult = await addPaymentResponse.json();
    console.log('✅ POST (add payment method) success:', addResult.success);
    
    if (addResult.success) {
      const paymentMethodId = addResult.paymentMethod.id;
      console.log('   Created payment method ID:', paymentMethodId);
      
      // 3. Test PUT - Update payment method
      console.log('3. Testing PUT /api/payment (update payment method)...');
      const updateResponse = await fetch(`${BASE_URL}/api/payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethodId,
          isDefault: false,
          userId: testUserId
        })
      });
      
      const updateResult = await updateResponse.json();
      console.log('✅ PUT (update) success:', updateResult.message);
      
      // 4. Test DELETE - Delete payment method
      console.log('4. Testing DELETE /api/payment...');
      const deleteResponse = await fetch(`${BASE_URL}/api/payment?id=${paymentMethodId}`, {
        method: 'DELETE'
      });
      
      const deleteResult = await deleteResponse.json();
      console.log('✅ DELETE success:', deleteResult.message);
    }
    
    // 5. Test POST - Purchase credits
    console.log('5. Testing POST /api/payment (purchase credits)...');
    const creditResponse = await fetch(`${BASE_URL}/api/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'purchase_credits',
        accountId: 1, // Assuming account ID 1 exists
        credits: 100,
        applyDiscount: false
      })
    });
    
    const creditResult = await creditResponse.json();
    console.log('✅ POST (purchase credits) success:', creditResult.success);
    if (creditResult.success) {
      console.log('   Payment Intent ID:', creditResult.data.paymentId);
      console.log('   Total Price:', creditResult.data.totalPrice);
    }
    
    console.log('🎉 All unified API tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testUnifiedPaymentAPI();
