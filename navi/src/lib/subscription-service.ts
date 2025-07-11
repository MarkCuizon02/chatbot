import { SubscriptionStatus } from '@prisma/client';

export interface SubscriptionData {
  id: number;
  userId: number;
  accountId: number;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  stripePriceId?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  status: SubscriptionStatus;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    email: string;
    firstname?: string;
    lastname?: string;
  };
  account?: {
    id: number;
    name: string;
    type: string;
  };
}

export interface PricingPlanData {
  id: string;
  title: string;
  price: number;
  credits: number;
  description: string;
  buttonText: string;
  href: string;
  billing: string;
  popular: boolean;
  category: string;
  isActive: boolean;
  stripeProductId?: string;
  stripePriceId?: string;
  features: Array<{
    name: string;
    description?: string;
    included: boolean;
  }>;
}

export interface CreateSubscriptionRequest {
  userId: number;
  accountId: number;
  planId: string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  stripePriceId?: string;
}

export interface UpdateSubscriptionRequest {
  planId?: string;
  status?: SubscriptionStatus;
  cancelAtPeriodEnd?: boolean;
  stripePriceId?: string;
}

export interface CancelSubscriptionRequest {
  reason?: string;
  feedback?: string;
  cancelAtPeriodEnd?: boolean;
}

class SubscriptionService {
  private baseUrl = '/api';

  // Get all subscriptions for a user
  async getSubscriptions(userId: number): Promise<SubscriptionData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/subscription?userId=${userId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch subscriptions: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      throw error;
    }
  }

  // Get subscriptions for an account
  async getAccountSubscriptions(accountId: number): Promise<SubscriptionData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/subscription?accountId=${accountId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch account subscriptions: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching account subscriptions:', error);
      throw error;
    }
  }

  // Get a specific subscription
  async getSubscription(subscriptionId: number): Promise<SubscriptionData> {
    try {
      const response = await fetch(`${this.baseUrl}/subscription/${subscriptionId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch subscription: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching subscription:', error);
      throw error;
    }
  }

  // Create a new subscription
  async createSubscription(data: CreateSubscriptionRequest): Promise<SubscriptionData> {
    try {
      const response = await fetch(`${this.baseUrl}/subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  // Update a subscription
  async updateSubscription(subscriptionId: number, data: UpdateSubscriptionRequest): Promise<SubscriptionData> {
    try {
      const response = await fetch(`${this.baseUrl}/subscription/${subscriptionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  // Cancel a subscription
  async cancelSubscription(subscriptionId: number, data: CancelSubscriptionRequest = {}): Promise<SubscriptionData> {
    try {
      const response = await fetch(`${this.baseUrl}/subscription/${subscriptionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to cancel subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  // Get all pricing plans
  async getPricingPlans(): Promise<PricingPlanData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/pricing-plans`);
      if (!response.ok) {
        throw new Error(`Failed to fetch pricing plans: ${response.statusText}`);
      }
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Error fetching pricing plans:', error);
      throw error;
    }
  }

  // Get a specific pricing plan
  async getPricingPlan(planId: string): Promise<PricingPlanData> {
    try {
      const response = await fetch(`${this.baseUrl}/pricing-plans/${planId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch pricing plan: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching pricing plan:', error);
      throw error;
    }
  }

  // Reactivate a cancelled subscription
  async reactivateSubscription(subscriptionId: number, planId?: string): Promise<SubscriptionData> {
    try {
      const response = await fetch(`${this.baseUrl}/subscription/${subscriptionId}/reactivate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to reactivate subscription');
      }

      const result = await response.json();
      return result.subscription;
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      throw error;
    }
  }

  // Change subscription plan
  async changePlan(subscriptionId: number, newPlanId: string): Promise<SubscriptionData> {
    try {
      const response = await fetch(`${this.baseUrl}/subscription/${subscriptionId}/update-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          planId: newPlanId 
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to change plan');
      }

      const result = await response.json();
      return result.subscription;
    } catch (error) {
      console.error('Error changing plan:', error);
      throw error;
    }
  }
}

// Helper functions for subscription management
export const subscriptionHelpers = {
  // Format subscription status for display
  formatStatus(status: SubscriptionStatus): string {
    switch (status) {
      case 'ACTIVE':
        return 'Active';
      case 'CANCELED':
        return 'Canceled';
      case 'PAST_DUE':
        return 'Past Due';
      case 'UNPAID':
        return 'Unpaid';
      case 'TRIALING':
        return 'Trial';
      default:
        return status;
    }
  },

  // Get status color for UI
  getStatusColor(status: SubscriptionStatus): string {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-600';
      case 'CANCELED':
        return 'text-red-600';
      case 'PAST_DUE':
        return 'text-yellow-600';
      case 'UNPAID':
        return 'text-red-600';
      case 'TRIALING':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  },

  // Get status background color
  getStatusBgColor(status: SubscriptionStatus): string {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100';
      case 'CANCELED':
        return 'bg-red-100';
      case 'PAST_DUE':
        return 'bg-yellow-100';
      case 'UNPAID':
        return 'bg-red-100';
      case 'TRIALING':
        return 'bg-blue-100';
      default:
        return 'bg-gray-100';
    }
  },

  // Check if subscription is active
  isActive(subscription: SubscriptionData): boolean {
    return subscription.status === 'ACTIVE' || subscription.status === 'TRIALING';
  },

  // Check if subscription is canceled
  isCanceled(subscription: SubscriptionData): boolean {
    return subscription.status === 'CANCELED';
  },

  // Check if subscription needs payment
  needsPayment(subscription: SubscriptionData): boolean {
    return subscription.status === 'PAST_DUE' || subscription.status === 'UNPAID';
  },

  // Format dates for display
  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return dateString;
    }
  },

  // Format pricing plan for display
  formatPlanPrice(plan: PricingPlanData): string {
    return `$${plan.price}${plan.billing}`;
  },

  // Get plan category color
  getPlanCategoryColor(category: string): string {
    switch (category.toLowerCase()) {
      case 'personal':
        return 'text-blue-600';
      case 'business':
        return 'text-purple-600';
      case 'enterprise':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  },

  // Get plan category background
  getPlanCategoryBgColor(category: string): string {
    switch (category.toLowerCase()) {
      case 'personal':
        return 'bg-blue-50';
      case 'business':
        return 'bg-purple-50';
      case 'enterprise':
        return 'bg-green-50';
      default:
        return 'bg-gray-50';
    }
  },
};

// Export the service instance
export const subscriptionService = new SubscriptionService();
