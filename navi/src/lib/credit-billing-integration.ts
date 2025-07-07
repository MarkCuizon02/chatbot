/**
 * Credit and Billing Integration Service
 * This module handles the integration between dashboard credit tracking and billing plans
 */

import { DashboardStats } from './dashboard-data';
import { SubscriptionState, AdditionalCredits } from '../context/SubscriptionContext';

export type { AdditionalCredits };

export interface IntegratedCreditData {
  // Subscription Plan Credits
  planCredits: {
    monthly: number;          // Monthly credit allowance from plan
    used: number;             // Credits used from monthly allowance
    remaining: number;        // Credits remaining from monthly allowance
    resetDate: string;        // When monthly credits reset
  };
  
  // Additional Credits (purchased separately)
  additionalCredits: {
    total: number;            // Total additional credits purchased
    used: number;             // Additional credits used
    remaining: number;        // Additional credits remaining
    expiring: AdditionalCredits[]; // Credits expiring soon
  };
  
  // Total Credits (combined)
  totalCredits: {
    available: number;        // Total credits available (plan + additional)
    used: number;             // Total credits used this period
    remaining: number;        // Total credits remaining
    usagePercentage: number;  // Usage as percentage
  };
  
  // Billing Integration
  billing: {
    currentPeriodStart: string;
    currentPeriodEnd: string;
    costPerCredit: number;
    estimatedCost: number;    // Cost of credits used this period
    overage: {
      credits: number;        // Credits used beyond plan allowance
      cost: number;           // Cost of overage credits
    };
  };
}

/**
 * Calculate integrated credit data from dashboard stats and subscription
 */
export function calculateIntegratedCredits(
  dashboardStats: DashboardStats,
  subscription: SubscriptionState,
  accountId: number
): IntegratedCreditData {
  // Get plan monthly credits
  const planMonthlyCredits = getPlanMonthlyCredits(subscription.currentPlan?.name || '');
  
  // Calculate additional credits
  const activeAdditionalCredits = subscription.additionalCredits.filter(
    credit => credit.status === 'active'
  );
  const totalAdditionalCredits = activeAdditionalCredits.reduce(
    (sum, credit) => sum + credit.amount, 0
  );
  const usedAdditionalCredits = subscription.usedAdditionalCredits || 0;
  const remainingAdditionalCredits = totalAdditionalCredits - usedAdditionalCredits;
  
  // Calculate totals
  const totalAvailable = planMonthlyCredits + totalAdditionalCredits;
  const totalUsed = dashboardStats.creditsUsed;
  const totalRemaining = totalAvailable - totalUsed;
  const usagePercentage = totalAvailable > 0 ? (totalUsed / totalAvailable) * 100 : 0;
  
  // Calculate plan vs additional usage
  const planCreditsUsed = Math.min(totalUsed, planMonthlyCredits);
  const additionalCreditsUsed = Math.max(0, totalUsed - planMonthlyCredits);
  const planCreditsRemaining = planMonthlyCredits - planCreditsUsed;
  
  // Calculate billing info
  const costPerCredit = getCostPerCredit(subscription.currentPlan?.name || '');
  const overage = Math.max(0, totalUsed - planMonthlyCredits);
  const overageCost = overage * costPerCredit;
  const estimatedCost = calculateEstimatedCost(subscription.currentPlan?.price || 0, overageCost);
  
  // Get billing period dates
  const { periodStart, periodEnd, resetDate } = getBillingPeriod();
  
  // Find expiring credits (within 30 days)
  const expiringCredits = activeAdditionalCredits.filter(credit => {
    const expiryDate = new Date(credit.expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiryDate <= thirtyDaysFromNow;
  });
  
  return {
    planCredits: {
      monthly: planMonthlyCredits,
      used: planCreditsUsed,
      remaining: planCreditsRemaining,
      resetDate: resetDate
    },
    additionalCredits: {
      total: totalAdditionalCredits,
      used: additionalCreditsUsed,
      remaining: remainingAdditionalCredits,
      expiring: expiringCredits
    },
    totalCredits: {
      available: totalAvailable,
      used: totalUsed,
      remaining: totalRemaining,
      usagePercentage: Math.round(usagePercentage * 100) / 100
    },
    billing: {
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      costPerCredit: costPerCredit,
      estimatedCost: estimatedCost,
      overage: {
        credits: overage,
        cost: overageCost
      }
    }
  };
}

/**
 * Get monthly credit allowance for a plan
 */
function getPlanMonthlyCredits(planName: string): number {
  const planCredits: { [key: string]: number } = {
    'Family Plus': 1500,
    'Business': 3000,
    'Enterprise': 10000,
    'Pro': 5000,
    'Starter': 500,
    'No Active Plan': 0
  };
  
  return planCredits[planName] || 0;
}

/**
 * Get cost per credit for overage billing
 */
function getCostPerCredit(planName: string): number {
  const overagePricing: { [key: string]: number } = {
    'Family Plus': 0.08,    // $0.08 per credit
    'Business': 0.06,       // $0.06 per credit
    'Enterprise': 0.04,     // $0.04 per credit
    'Pro': 0.05,           // $0.05 per credit
    'Starter': 0.10,       // $0.10 per credit
    'No Active Plan': 0.15  // $0.15 per credit (pay-as-you-go)
  };
  
  return overagePricing[planName] || 0.15;
}

/**
 * Calculate estimated cost including base plan + overage
 */
function calculateEstimatedCost(basePlanCost: number, overageCost: number): number {
  return basePlanCost + overageCost;
}

/**
 * Get current billing period dates
 */
function getBillingPeriod(): { periodStart: string, periodEnd: string, resetDate: string } {
  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  
  return {
    periodStart: periodStart.toISOString().split('T')[0],
    periodEnd: periodEnd.toISOString().split('T')[0],
    resetDate: resetDate.toISOString().split('T')[0]
  };
}

/**
 * Check if user is approaching credit limits
 */
export function getCreditAlerts(integratedData: IntegratedCreditData): {
  type: 'info' | 'warning' | 'error';
  message: string;
}[] {
  const alerts: { type: 'info' | 'warning' | 'error'; message: string }[] = [];
  
  // Check plan credit usage
  const planUsagePercentage = integratedData.planCredits.monthly > 0 
    ? (integratedData.planCredits.used / integratedData.planCredits.monthly) * 100 
    : 0;
  
  if (planUsagePercentage >= 90) {
    alerts.push({
      type: 'error',
      message: `You've used ${planUsagePercentage.toFixed(0)}% of your monthly plan credits. Consider upgrading or purchasing additional credits.`
    });
  } else if (planUsagePercentage >= 75) {
    alerts.push({
      type: 'warning',
      message: `You've used ${planUsagePercentage.toFixed(0)}% of your monthly plan credits.`
    });
  }
  
  // Check overage
  if (integratedData.billing.overage.credits > 0) {
    alerts.push({
      type: 'warning',
      message: `You've used ${integratedData.billing.overage.credits} credits beyond your plan allowance. Overage cost: $${integratedData.billing.overage.cost.toFixed(2)}`
    });
  }
  
  // Check expiring additional credits
  if (integratedData.additionalCredits.expiring.length > 0) {
    const expiringTotal = integratedData.additionalCredits.expiring.reduce(
      (sum, credit) => sum + (credit.amount - (credit.status === 'active' ? 0 : credit.amount)), 0
    );
    alerts.push({
      type: 'info',
      message: `${expiringTotal} additional credits will expire within 30 days.`
    });
  }
  
  return alerts;
}

/**
 * Format credit display with proper separators
 */
export function formatCredits(credits: number): string {
  return credits.toLocaleString();
}

/**
 * Format currency display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}
