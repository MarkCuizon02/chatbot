"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface User {
  id: number;
  username: string;
  email: string;
  firstname?: string;
  lastname?: string;
  credits: number;
  createdAt: string;
  updatedAt: string;
}

interface Subscription {
  id: number;
  userId: number;
  accountId: number;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  stripePriceId?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  status: string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface PricingPlan {
  id: string;
  title: string;
  price: number;
  credits: number;
  description: string;
  billing: string;
  popular: boolean;
  category: string;
  isActive: boolean;
  stripeProductId?: string;
  stripePriceId?: string;
  features: Array<{
    name: string;
    included: boolean;
  }>;
}

export default function TestSubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const testUserId = 1;
  const testAccountId = 1;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load user data
      const userResponse = await fetch(`/api/users/${testUserId}`);
      if (userResponse.ok) {
        setUser(await userResponse.json());
      }
      
      // Load subscriptions
      const subsResponse = await fetch(`/api/subscriptions?userId=${testUserId}`);
      if (subsResponse.ok) {
        setSubscriptions(await subsResponse.json());
      }
      
      // Load pricing plans
      const plansResponse = await fetch('/api/pricing-plans');
      if (plansResponse.ok) {
        setPricingPlans(await plansResponse.json());
      }
      
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSubscription = async (planId: string) => {
    try {
      setLoading(true);
      setMessage('Creating subscription...');
      
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: testUserId,
          accountId: testAccountId,
          planId: planId
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        setMessage(`Subscription created successfully! ID: ${result.subscription?.id}`);
        await loadData();
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      setMessage('Error creating subscription');
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async (subscriptionId: number) => {
    try {
      setLoading(true);
      setMessage('Canceling subscription...');
      
      const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setMessage('Subscription canceled successfully!');
        await loadData();
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      setMessage('Error canceling subscription');
    } finally {
      setLoading(false);
    }
  };

  const updateSubscription = async (subscriptionId: number, updates: Partial<Subscription>) => {
    try {
      setLoading(true);
      setMessage('Updating subscription...');
      
      const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (response.ok) {
        setMessage('Subscription updated successfully!');
        await loadData();
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
      setMessage('Error updating subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Subscription Test Page
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Test subscription functionality and billing integration
          </p>
        </div>

        {/* User Info */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              User Information
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">User ID</p>
                <p className="font-medium text-gray-900 dark:text-white">{user.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Credits</p>
                <p className="font-medium text-green-600 dark:text-green-400">{user.credits}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Subscriptions</p>
                <p className="font-medium text-blue-600 dark:text-blue-400">{subscriptions.length}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6"
          >
            <p className="text-blue-800 dark:text-blue-200">{message}</p>
          </motion.div>
        )}

        {/* Current Subscriptions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Current Subscriptions ({subscriptions.length})
          </h2>
          
          {subscriptions.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No active subscriptions</p>
          ) : (
            <div className="space-y-4">
              {subscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">ID</p>
                          <p className="font-medium text-gray-900 dark:text-white">{subscription.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            subscription.status === 'ACTIVE' 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                              : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            {subscription.status}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Stripe ID</p>
                          <p className="font-mono text-xs text-gray-600 dark:text-gray-400">
                            {subscription.stripeSubscriptionId || 'None'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Cancel at Period End</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {subscription.cancelAtPeriodEnd ? 'Yes' : 'No'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => updateSubscription(subscription.id, { 
                          cancelAtPeriodEnd: !subscription.cancelAtPeriodEnd 
                        })}
                        disabled={loading}
                        className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 text-sm"
                      >
                        Toggle Cancel
                      </button>
                      <button
                        onClick={() => cancelSubscription(subscription.id)}
                        disabled={loading}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Available Plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Available Plans ({pricingPlans.length})
          </h2>
          
          {pricingPlans.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No pricing plans available</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`border rounded-lg p-6 ${
                    plan.popular 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {plan.title}
                    </h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        ${plan.price}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {plan.billing}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      {plan.credits} credits included
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {plan.description}
                    </p>
                    {plan.features.length > 0 && (
                      <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                        {plan.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-center">
                            <svg className="w-3 h-3 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {feature.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  <button
                    onClick={() => createSubscription(plan.id)}
                    disabled={loading || !plan.isActive}
                    className={`w-full py-2 px-4 rounded font-medium ${
                      plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-600 text-white hover:bg-gray-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {loading ? 'Creating...' : 'Subscribe'}
                  </button>
                  
                  {plan.stripePriceId && (
                    <p className="text-xs text-gray-400 mt-2 text-center font-mono">
                      {plan.stripePriceId}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex justify-center space-x-4"
        >
          <button
            onClick={loadData}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh Data'}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
