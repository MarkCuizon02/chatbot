// Mock Stripe configuration for development
export const mockStripeConfig = {
  // Mock product IDs for your pricing plans
  products: {
    starter: {
      id: 'prod_starter_mock',
      name: 'Starter Plan',
      description: 'Perfect for individuals and small teams'
    },
    professional: {
      id: 'prod_professional_mock',
      name: 'Professional Plan',
      description: 'Ideal for growing businesses'
    },
    enterprise: {
      id: 'prod_enterprise_mock',
      name: 'Enterprise Plan',
      description: 'For large organizations with advanced needs'
    }
  },

  // Mock price IDs
  prices: {
    starter: {
      id: 'price_starter_monthly_mock',
      unit_amount: 1900, // $19.00
      currency: 'usd',
      recurring: { interval: 'month' }
    },
    professional: {
      id: 'price_professional_monthly_mock',
      unit_amount: 4900, // $49.00
      currency: 'usd',
      recurring: { interval: 'month' }
    },
    enterprise: {
      id: 'price_enterprise_monthly_mock',
      unit_amount: 9900, // $99.00
      currency: 'usd',
      recurring: { interval: 'month' }
    }
  },

  // Mock checkout session
  createCheckoutSession: async (planId: string) => {
    console.log(`🔗 Mock Stripe: Creating checkout session for plan: ${planId}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: `cs_mock_${Date.now()}`,
      url: `/billing/success?plan=${planId}`,
      status: 'open'
    };
  },

  // Mock subscription
  createSubscription: async (customerId: string, priceId: string) => {
    console.log(`💳 Mock Stripe: Creating subscription for customer: ${customerId}, price: ${priceId}`);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      id: `sub_mock_${Date.now()}`,
      status: 'active',
      current_period_start: Math.floor(Date.now() / 1000),
      current_period_end: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
      cancel_at_period_end: false
    };
  },

  // Mock customer
  createCustomer: async (email: string, name?: string) => {
    console.log(`👤 Mock Stripe: Creating customer: ${email}`);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      id: `cus_mock_${Date.now()}`,
      email,
      name,
      created: Math.floor(Date.now() / 1000)
    };
  }
};

// Mock Stripe client
export const mockStripe = {
  checkout: {
    sessions: {
      create: mockStripeConfig.createCheckoutSession
    }
  },
  customers: {
    create: mockStripeConfig.createCustomer
  },
  subscriptions: {
    create: mockStripeConfig.createSubscription
  }
}; 