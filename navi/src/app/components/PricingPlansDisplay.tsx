'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface PlanFeature {
  id: string;
  name: string;
  description: string | null;
  included: boolean;
}

interface PricingPlan {
  id: string;
  title: string;
  price: number;
  description: string;
  buttonText: string;
  href: string;
  billing: string;
  popular: boolean;
  isActive: boolean;
  features: PlanFeature[];
}

export default function PricingPlansDisplay() {
  const { isDarkMode } = useTheme();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/pricing-plans');
        const result = await response.json();
        
        if (result.success) {
          setPlans(result.data);
        } else {
          setError(result.error || 'Failed to fetch plans');
        }
      } catch (err) {
        setError('Failed to fetch pricing plans');
        console.error('Error fetching plans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const formatPrice = (price: number) => {
    return (price / 100).toFixed(2);
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center py-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        <span className="ml-3">Loading pricing plans...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-12 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
        <p>Error: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className={`mt-4 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto p-6">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`relative rounded-2xl p-8 ${
            plan.popular
              ? `${isDarkMode ? 'bg-gradient-to-br from-teal-600 to-teal-700' : 'bg-gradient-to-br from-teal-500 to-teal-600'} text-white`
              : `${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`
          } shadow-lg transition-transform duration-200 hover:scale-105`}
        >
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </span>
            </div>
          )}

          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
            <p className={`text-sm ${plan.popular ? 'text-teal-100' : isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {plan.description}
            </p>
          </div>

          <div className="text-center mb-8">
            <div className="flex items-baseline justify-center">
              <span className="text-4xl font-bold">${formatPrice(plan.price)}</span>
              <span className={`ml-2 ${plan.popular ? 'text-teal-100' : isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {plan.billing}
              </span>
            </div>
          </div>

          <ul className="space-y-4 mb-8">
            {plan.features.map((feature) => (
              <li key={feature.id} className="flex items-start">
                <span className={`mr-3 mt-1 ${feature.included ? 'text-green-500' : 'text-gray-400'}`}>
                  {feature.included ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </span>
                <span className={`text-sm ${feature.included ? '' : 'line-through opacity-60'}`}>
                  {feature.name}
                  {feature.description && (
                    <span className={`block text-xs mt-1 ${plan.popular ? 'text-teal-100' : isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {feature.description}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>

          <button
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
              plan.popular
                ? 'bg-white text-teal-600 hover:bg-gray-100'
                : `${isDarkMode ? 'bg-teal-600 hover:bg-teal-700' : 'bg-teal-500 hover:bg-teal-600'} text-white`
            }`}
          >
            {plan.buttonText}
          </button>
        </div>
      ))}
    </div>
  );
} 