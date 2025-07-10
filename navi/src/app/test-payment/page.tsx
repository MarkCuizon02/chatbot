"use client";

import React, { useState, useEffect } from 'react';
import { paymentMethodService } from '@/lib/payment-methods';

interface PaymentMethod {
  id: number;
  brand: string;
  number: string;
  expiry?: string;
  cardholderName?: string;
  isDefault: boolean;
  paymentMethod: string;
  status: string;
}

interface User {
  id: number;
  credits: number;
  username: string;
  email: string;
}

export default function PaymentTestPage() {
  const [user, setUser] = useState<User | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const testUserId = 1;
  const testAccountId = 1;

  // Load user data and payment methods
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load user data
      const userResponse = await fetch(`/api/users/${testUserId}`);
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
      }
      
      // Load payment methods
      const methods = await paymentMethodService.getUserPaymentMethods(testUserId);
      setPaymentMethods(methods);
      
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  // Add a test payment method
  const addTestPaymentMethod = async () => {
    try {
      setLoading(true);
      await paymentMethodService.createPaymentMethod({
        userId: testUserId,
        brand: 'Visa',
        cardNumber: '4111111111111111',
        cardholderName: 'Test User',
        expiry: '12/25',
        isDefault: paymentMethods.length === 0,
        paymentMethod: 'card',
        zipCode: '12345',
        country: 'US'
      });
      
      setMessage('Payment method added successfully!');
      await loadData();
    } catch (error) {
      console.error('Error adding payment method:', error);
      setMessage('Error adding payment method');
    } finally {
      setLoading(false);
    }
  };

  // Purchase credits
  const purchaseCredits = async (credits: number) => {
    try {
      setLoading(true);
      const result = await paymentMethodService.purchaseCredits(testAccountId, credits, false);
      
      if (result.success) {
        setMessage(`Payment intent created: ${result.data.paymentId}`);
        
        // Simulate successful payment by adding credits directly
        const creditResponse = await fetch('/api/credits/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: testUserId,
            credits: credits,
            reason: `Test credit purchase: ${result.data.paymentId}`
          })
        });
        
        if (creditResponse.ok) {
          const creditResult = await creditResponse.json();
          setMessage(`Credits added successfully! New balance: ${creditResult.newBalance}`);
          await loadData();
        }
      }
    } catch (error) {
      console.error('Error purchasing credits:', error);
      setMessage('Error purchasing credits');
    } finally {
      setLoading(false);
    }
  };

  // Delete payment method
  const deletePaymentMethod = async (id: number) => {
    try {
      setLoading(true);
      await paymentMethodService.deletePaymentMethod(id);
      setMessage('Payment method deleted successfully!');
      await loadData();
    } catch (error) {
      console.error('Error deleting payment method:', error);
      setMessage('Error deleting payment method');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Payment Integration Test</h1>
        
        {/* User Info */}
        {user && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
              <div>
                <p><strong>Credits:</strong> <span className="text-green-600 text-xl font-bold">{user.credits}</span></p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={addTestPaymentMethod}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Add Test Payment Method
            </button>
            <button
              onClick={() => purchaseCredits(50)}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Purchase 50 Credits ($10)
            </button>
            <button
              onClick={() => purchaseCredits(100)}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Purchase 100 Credits ($20)
            </button>
            <button
              onClick={loadData}
              disabled={loading}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Refresh Data
            </button>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Payment Methods ({paymentMethods.length})</h2>
          {paymentMethods.length === 0 ? (
            <p className="text-gray-500">No payment methods found. Add one to get started.</p>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{method.brand}</span>
                      <span className="text-gray-600">{method.number}</span>
                      {method.isDefault && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Default</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {method.cardholderName} • Expires: {method.expiry}
                    </p>
                  </div>
                  <button
                    onClick={() => deletePaymentMethod(method.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Messages */}
        {message && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">{message}</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </div>
  );
}
