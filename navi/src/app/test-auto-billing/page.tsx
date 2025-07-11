"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface PaymentMethodStatus {
  hasPaymentMethod: boolean;
  paymentMethod?: {
    id: string;
    type: string;
    last4?: string;
    brand?: string;
  } | null;
  requiresSetup: boolean;
}

interface PurchaseResult {
  success: boolean;
  status: string;
  data?: {
    paymentId: string;
    creditsAdded: number;
    totalPrice: number;
    newCreditBalance: number;
    message: string;
    amountCharged: number;
  };
  error?: string;
  requiresPaymentMethodSetup?: boolean;
}

export default function AutoCreditPurchaseTest() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethodStatus, setPaymentMethodStatus] = useState<PaymentMethodStatus | null>(null);
  const [purchaseResult, setPurchaseResult] = useState<PurchaseResult | null>(null);
  const [selectedCredits, setSelectedCredits] = useState(10);
  
  // Mock account ID - in real app, this would come from context/auth
  const mockAccountId = 1;

  // Check payment method status on component mount
  useEffect(() => {
    checkPaymentMethodStatus();
  }, []);

  const checkPaymentMethodStatus = async () => {
    try {
      const response = await fetch(`/api/billing/purchase-credits-auto?accountId=${mockAccountId}`);
      const data = await response.json();
      setPaymentMethodStatus(data);
    } catch (error) {
      console.error('Error checking payment method status:', error);
    }
  };

  const purchaseCreditsAutomatically = async () => {
    setLoading(true);
    setPurchaseResult(null);

    try {
      const response = await fetch('/api/billing/purchase-credits-auto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId: mockAccountId,
          credits: selectedCredits,
          applyDiscount: false, // Set to true for subscription users
        }),
      });

      const result = await response.json();
      setPurchaseResult(result);

      if (result.success) {
        // Refresh payment method status to show updated info
        checkPaymentMethodStatus();
      }
    } catch (error) {
      console.error('Error purchasing credits:', error);
      setPurchaseResult({
        success: false,
        status: 'error',
        error: 'Failed to purchase credits. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const creditPackOptions = [
    { credits: 10, price: 1.99 },
    { credits: 25, price: 4.99 },
    { credits: 50, price: 9.99 },
    { credits: 100, price: 19.99 },
    { credits: 250, price: 49.99 },
    { credits: 500, price: 99.99 },
  ];

  const selectedPack = creditPackOptions.find(pack => pack.credits === selectedCredits);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🚀 Automatic Credit Purchase Test
          </h1>

          {/* Payment Method Status */}
          <div className="mb-6 p-4 rounded-lg border">
            <h2 className="text-lg font-semibold mb-2">Payment Method Status</h2>
            {paymentMethodStatus ? (
              <div>
                {paymentMethodStatus.hasPaymentMethod ? (
                  <div className="text-green-600">
                    ✅ Payment method available
                    {paymentMethodStatus.paymentMethod && (
                      <div className="text-sm text-gray-600 mt-1">
                        {paymentMethodStatus.paymentMethod.brand?.toUpperCase()} 
                        ending in {paymentMethodStatus.paymentMethod.last4}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="text-red-600 mb-2">
                      ❌ No payment method found
                    </div>
                    <button
                      onClick={() => router.push('/billing/cards')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      Set up payment method
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-500">Loading...</div>
            )}
          </div>

          {/* Credit Pack Selection */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Select Credit Pack</h2>
            <div className="grid grid-cols-2 gap-3">
              {creditPackOptions.map((pack) => (
                <button
                  key={pack.credits}
                  onClick={() => setSelectedCredits(pack.credits)}
                  className={`p-3 rounded-lg border-2 text-center transition-colors ${
                    selectedCredits === pack.credits
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="font-bold">{pack.credits} Credits</div>
                  <div className="text-sm">${pack.price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Pack Info */}
          {selectedPack && (
            <div className="mb-6 p-3 bg-blue-50 rounded-lg">
              <div className="text-center">
                <div className="font-semibold">Selected: {selectedPack.credits} Credits</div>
                <div className="text-lg font-bold text-blue-600">${selectedPack.price}</div>
              </div>
            </div>
          )}

          {/* Purchase Button */}
          <button
            onClick={purchaseCreditsAutomatically}
            disabled={loading || !paymentMethodStatus?.hasPaymentMethod}
            className={`w-full py-3 px-4 rounded-md font-semibold text-white transition-colors ${
              loading || !paymentMethodStatus?.hasPaymentMethod
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              `💳 Purchase ${selectedCredits} Credits for $${selectedPack?.price}`
            )}
          </button>

          {!paymentMethodStatus?.hasPaymentMethod && (
            <p className="text-sm text-red-600 mt-2 text-center">
              Please set up a payment method first
            </p>
          )}

          {/* Purchase Result */}
          {purchaseResult && (
            <div className={`mt-6 p-4 rounded-lg ${
              purchaseResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <h3 className="font-semibold mb-2">
                {purchaseResult.success ? '✅ Purchase Successful!' : '❌ Purchase Failed'}
              </h3>
              
              {purchaseResult.success && purchaseResult.data ? (
                <div className="space-y-1 text-sm">
                  <div>Credits Added: <strong>{purchaseResult.data.creditsAdded}</strong></div>
                  <div>Amount Charged: <strong>${purchaseResult.data.amountCharged}</strong></div>
                  <div>New Balance: <strong>{purchaseResult.data.newCreditBalance} credits</strong></div>
                  <div>Payment ID: <span className="font-mono text-xs">{purchaseResult.data.paymentId}</span></div>
                  <div className="text-green-600 mt-2">{purchaseResult.data.message}</div>
                </div>
              ) : (
                <div className="text-red-600 text-sm">
                  {purchaseResult.error}
                  {purchaseResult.requiresPaymentMethodSetup && (
                    <div className="mt-2">
                      <button
                        onClick={() => router.push('/billing/cards')}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                      >
                        Add Payment Method
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-6 flex justify-between text-sm">
            <button
              onClick={() => router.push('/billing/cards')}
              className="text-blue-600 hover:text-blue-800"
            >
              Manage Payment Methods
            </button>
            <button
              onClick={() => router.push('/billing')}
              className="text-blue-600 hover:text-blue-800"
            >
              View Billing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
