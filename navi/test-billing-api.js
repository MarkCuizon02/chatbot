// Test the billing history API
async function testBillingHistory() {
  try {
    // First, let's get a test account ID
    const response = await fetch('/api/billing/history?accountId=1');
    console.log('Response status:', response.status);
    
    const data = await response.text();
    console.log('Response data:', data);
    
    if (response.ok) {
      const jsonData = JSON.parse(data);
      console.log('Parsed data:', jsonData);
    }
  } catch (error) {
    console.error('Test error:', error);
  }
}

testBillingHistory();
