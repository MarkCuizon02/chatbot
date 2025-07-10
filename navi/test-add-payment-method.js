// Test adding a payment method
async function testAddPaymentMethod() {
  try {
    const response = await fetch('http://localhost:3000/api/payment-methods', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 1,
        cardholderName: 'Test User',
        isDefault: true
      })
    });

    const data = await response.json();
    console.log('Add payment method response:', data);

    // Then fetch payment methods to see if it was added
    const getResponse = await fetch('http://localhost:3000/api/payment-methods?userId=1');
    const paymentMethods = await getResponse.json();
    console.log('Payment methods after adding:', paymentMethods);
  } catch (error) {
    console.error('Test error:', error);
  }
}

testAddPaymentMethod();
