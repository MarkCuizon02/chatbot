/**
 * Debug page for testing Stripe billing integration
 * Navigate to /debug-billing to test the integration
 */

'use client';

import { useState } from 'react';

export default function DebugBillingPage() {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setTestResult('Testing API...');

    try {
      const response = await fetch('/api/billing/purchase-credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId: 1, // Test with account ID 1
          credits: 100,
          applyDiscount: false,
        }),
      });

      const responseText = await response.text();
      
      setTestResult(`
Status: ${response.status}
Response: ${responseText}
      `);

    } catch (error) {
      setTestResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testStripeKeys = async () => {
    setLoading(true);
    setTestResult('Testing Stripe configuration...');

    try {
      const response = await fetch('/api/debug/stripe-config', {
        method: 'GET',
      });

      const result = await response.text();
      setTestResult(result);

    } catch (error) {
      setTestResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Debug Billing Integration</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-4">Test Stripe Configuration</h2>
          <button
            onClick={testStripeKeys}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Stripe Config'}
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Test Purchase Credits API</h2>
          <button
            onClick={testAPI}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test API'}
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Test with Stripe Test Card</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p><strong>Card Number:</strong> 4242424242424242</p>
            <p><strong>Expiry:</strong> Any future date (e.g., 12/25)</p>
            <p><strong>CVC:</strong> Any 3 digits (e.g., 123)</p>
          </div>
        </div>

        {testResult && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Test Result:</h3>
            <pre className="bg-gray-800 text-white p-4 rounded overflow-auto">
              {testResult}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
