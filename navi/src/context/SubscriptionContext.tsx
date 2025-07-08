"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Plan {
  name: string;
  description: string;
  price: number;
  color: string;
  button: string;
  buttonColor: string;
  border: string;
  additionalCredits?: string;
  isCurrent: boolean;
  features: string[];
  category: 'Personal' | 'Business';
}

export interface AdditionalCredits {
  id: string;
  amount: number;
  price: number;
  purchaseDate: string;
  status: 'active' | 'used';
}

export interface SubscriptionState {
  currentPlan: Plan | null;
  billingHistory: Array<{
    id: string;
    plan: string;
    date: string;
    status: 'Paid' | 'Failed' | 'Pending';
    amount: number;
    type: 'plan' | 'credits';
  }>;
  paymentMethod: {
    type: string;
    last4: string;
    expiry: string;
  };
  nextBillingDate: string;
  creditsUsed: number;
  creditsRemaining: number;
  additionalCredits: AdditionalCredits[];
  totalAdditionalCredits: number;
  usedAdditionalCredits: number;
}

interface SubscriptionContextType {
  subscription: SubscriptionState;
  updatePlan: (newPlan: Plan) => void;
  addBillingRecord: (record: SubscriptionState['billingHistory'][0]) => void;
  updatePaymentMethod: (method: SubscriptionState['paymentMethod']) => void;
  updateCredits: (used: number, remaining: number) => void;
  purchaseAdditionalCredits: (amount: number, price: number) => void;
  useCredits: (amount: number) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

const defaultSubscription: SubscriptionState = {
  currentPlan: {
    name: "Family Plus",
    description: "A solid starting point for businesses with scalable credits.",
    price: 99,
    color: "text-blue-500",
    button: "Current Plan",
    buttonColor: "bg-white text-blue-500 border border-blue-500 cursor-default",
    border: "border-blue-400",
    isCurrent: true,
    features: ["1500 credits per month", "Users: 6"],
    category: 'Personal'
  },
  billingHistory: [
    { id: "#10003", plan: "Family Plus", date: "March 5, 2025", status: "Failed", amount: 99, type: "plan" },
    { id: "#10002", plan: "Family Plus", date: "February 5, 2025", status: "Paid", amount: 99, type: "plan" },
    { id: "#10001", plan: "Family Plus", date: "January 5, 2025", status: "Paid", amount: 99, type: "plan" },
  ],
  paymentMethod: {
    type: "Visa",
    last4: "1234",
    expiry: "12/25"
  },
  nextBillingDate: "April 5, 2025",
  creditsUsed: 450,
  creditsRemaining: 1050,
  additionalCredits: [
    {
      id: "add-001",
      amount: 500,
      price: 50,
      purchaseDate: "March 1, 2025",
      status: "active"
    },
    {
      id: "add-002",
      amount: 200,
      price: 20,
      purchaseDate: "February 15, 2025",
      status: "used"
    }
  ],
  totalAdditionalCredits: 700,
  usedAdditionalCredits: 200
};

// Helper function to get monthly credits for a plan
function getCreditsForPlan(planName: string) {
  switch (planName) {
    case 'Personal': return 200;
    case 'Family': return 500;
    case 'Family Plus': return 1500;
    case 'Launch': return 1500;
    case 'Growth': return 5000;
    case 'Pro': return 15000;
    case "Human Digital Manager": return 50000;
    case "Founder's Club": return 0; // or set as needed
    default: return 0;
  }
}

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscription, setSubscription] = useState<SubscriptionState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('subscription');
      return saved ? JSON.parse(saved) : defaultSubscription;
    }
    return defaultSubscription;
  });

  useEffect(() => {
    localStorage.setItem('subscription', JSON.stringify(subscription));
  }, [subscription]);

  const updatePlan = (newPlan: Plan) => {
    setSubscription(prev => ({
      ...prev,
      currentPlan: { ...newPlan, isCurrent: true },
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      creditsRemaining: getCreditsForPlan(newPlan.name),
      creditsUsed: 0,
      usedAdditionalCredits: 0,
      // Preserve additionalCredits and totalAdditionalCredits
      additionalCredits: prev.additionalCredits,
      totalAdditionalCredits: prev.totalAdditionalCredits,
    }));
  };

  const addBillingRecord = (record: SubscriptionState['billingHistory'][0]) => {
    setSubscription(prev => ({
      ...prev,
      billingHistory: [record, ...(prev.billingHistory || [])]
    }));
  };

  const updatePaymentMethod = (method: SubscriptionState['paymentMethod']) => {
    setSubscription(prev => ({
      ...prev,
      paymentMethod: method
    }));
  };

  const updateCredits = (used: number, remaining: number) => {
    setSubscription(prev => ({
      ...prev,
      creditsUsed: used,
      creditsRemaining: remaining
    }));
  };

  const purchaseAdditionalCredits = (amount: number, price: number) => {
    const newCreditPackage: AdditionalCredits = {
      id: `add-${Date.now()}`,
      amount,
      price,
      purchaseDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      status: 'active'
    };

    const newBillingRecord = {
      id: `#${Math.floor(Math.random() * 90000) + 10000}`,
      plan: `${amount} Additional Credits`,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      status: 'Paid' as const,
      amount: price,
      type: 'credits' as const
    };

    setSubscription(prev => ({
      ...prev,
      additionalCredits: [newCreditPackage, ...(prev.additionalCredits || [])],
      totalAdditionalCredits: (prev.totalAdditionalCredits || 0) + amount,
      billingHistory: [newBillingRecord, ...(prev.billingHistory || [])]
    }));
  };

  const useCredits = (amount: number) => {
    setSubscription(prev => {
      let remainingToUse = amount;
      let newUsedAdditionalCredits = prev.usedAdditionalCredits || 0;
      let newCreditsRemaining = prev.creditsRemaining || 0;
      let newCreditsUsed = prev.creditsUsed || 0;

      // First use additional credits
      const updatedAdditionalCredits = (prev.additionalCredits || []).map(credit => {
        if (remainingToUse > 0 && credit.status === 'active') {
          const availableInThisPackage = credit.amount - (credit.amount * (newUsedAdditionalCredits / (prev.totalAdditionalCredits || 1)));
          const toUseFromThisPackage = Math.min(remainingToUse, availableInThisPackage);
          
          if (toUseFromThisPackage > 0) {
            remainingToUse -= toUseFromThisPackage;
            newUsedAdditionalCredits += toUseFromThisPackage;
            
            if (credit.amount <= newUsedAdditionalCredits) {
              return { ...credit, status: 'used' as const };
            }
          }
        }
        return credit;
      });

      // Then use regular credits
      if (remainingToUse > 0) {
        newCreditsRemaining = Math.max(0, (prev.creditsRemaining || 0) - remainingToUse);
        newCreditsUsed = (prev.creditsUsed || 0) + remainingToUse;
      }

      return {
        ...prev,
        additionalCredits: updatedAdditionalCredits,
        totalAdditionalCredits: prev.totalAdditionalCredits || 0,
        usedAdditionalCredits: newUsedAdditionalCredits,
        creditsRemaining: newCreditsRemaining,
        creditsUsed: newCreditsUsed
      };
    });
  };

  return (
    <SubscriptionContext.Provider value={{
      subscription,
      updatePlan,
      addBillingRecord,
      updatePaymentMethod,
      updateCredits,
      purchaseAdditionalCredits,
      useCredits
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}; 