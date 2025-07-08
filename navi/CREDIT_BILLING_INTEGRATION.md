# Credit and Billing Integration Guide

## Overview

This guide explains how to integrate dashboard credit tracking with your billing/subscription system to provide a unified view of credit usage, billing, and cost management.

## Credit System Design

### Credit Types

1. **Subscription Credits** - Monthly allowance that resets each billing period
2. **Additional Credits** - Permanent credits purchased separately that never expire

### Usage Priority

Credits are consumed in this order:
1. **Subscription credits first** - Use monthly plan allowance
2. **Additional credits second** - Use permanent purchased credits only after plan credits are exhausted

### Key Benefits

- **No Credit Expiration** - Additional purchased credits never expire
- **Fair Usage** - Plan credits are used before additional credits
- **Transparent Billing** - Clear separation between plan and additional credit costs

## Key Components

### 1. Credit-Billing Integration Service (`src/lib/credit-billing-integration.ts`)

This service combines data from multiple sources:
- Dashboard credit usage statistics
- Subscription plan details
- Additional credit purchases (permanent)
- Billing period information

### 2. Integrated Credit Data Structure

```typescript
interface IntegratedCreditData {
  // Subscription Plan Credits (reset monthly)
  planCredits: {
    monthly: number;          // Monthly credit allowance from plan
    used: number;             // Credits used from monthly allowance
    remaining: number;        // Credits remaining from monthly allowance
    resetDate: string;        // When monthly credits reset
  };
  
  // Additional Credits (permanent until used)
  additionalCredits: {
    total: number;            // Total additional credits purchased (lifetime)
    used: number;             // Additional credits used (lifetime)
    remaining: number;        // Additional credits remaining (permanent balance)
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
```

## Implementation Steps

### Step 1: Dashboard Integration

Update your dashboard to use the integrated credit system:

```typescript
// In your Dashboard component
import { calculateIntegratedCredits, getCreditAlerts } from '../lib/credit-billing-integration';

const [integratedCredits, setIntegratedCredits] = useState<IntegratedCreditData | null>(null);

useEffect(() => {
  const fetchData = async () => {
    const stats = await fetchDashboardStats(accountId);
    
    if (stats) {
      const integrated = calculateIntegratedCredits(stats, subscription, accountId);
      setIntegratedCredits(integrated);
    }
  };

  fetchData();
}, [subscription]);
```

### Step 2: Update Credit Display Cards

Replace simple credit counters with integrated information:

```typescript
// Total Credits Available Card
<div className="text-3xl font-extrabold">
  {integratedCredits ? formatCredits(integratedCredits.totalCredits.available) : '---'}
</div>
<div className="text-sm">
  Plan: {formatCredits(planCredits)} + Additional: {formatCredits(additionalCredits)}
</div>

// Credits Used Card  
<div className="text-3xl font-extrabold">
  {integratedCredits ? formatCredits(integratedCredits.totalCredits.used) : '---'}
</div>
<div className="text-sm">
  {usagePercentage}% of available
</div>

// Estimated Cost Card
<div className="text-3xl font-extrabold">
  {integratedCredits ? formatCurrency(integratedCredits.billing.estimatedCost) : '---'}
</div>
<div className="text-sm">
  Base: {formatCurrency(baseCost)} + Overage: {formatCurrency(overageCost)}
</div>
```

### Step 3: Add Credit Alerts

Implement intelligent alerts for credit usage:

```typescript
const creditAlerts = integratedCredits ? getCreditAlerts(integratedCredits) : [];

// Display alerts
{creditAlerts.map((alert, index) => (
  <div key={index} className={`alert alert-${alert.type}`}>
    {alert.message}
  </div>
))}
```

### Step 4: Credit Details Modal

Add a detailed view showing complete credit breakdown:

```typescript
// Import the modal component
import CreditDetailsModal from './components/CreditDetailsModal';

// In your component
<CreditDetailsModal
  isOpen={isCreditDetailsModalOpen}
  onClose={() => setIsCreditDetailsModalOpen(false)}
  integratedCredits={integratedCredits}
  isDarkMode={isDarkMode}
/>
```

## Plan Configuration

### Monthly Credit Allowances

Configure plan-specific credit allowances in the integration service:

```typescript
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
```

### Overage Pricing

Set up overage pricing per plan:

```typescript
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
```

## Database Integration

To fully integrate with your database, you'll need to:

### 1. Track Credit Usage

```sql
-- Credit usage tracking table
CREATE TABLE credit_usage (
  id SERIAL PRIMARY KEY,
  account_id INTEGER NOT NULL,
  agent_id VARCHAR(50),
  credits_used INTEGER NOT NULL,
  action_type VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for performance
CREATE INDEX idx_credit_usage_account_period 
ON credit_usage(account_id, created_at);
```

### 2. Store Additional Credits

```sql
-- Additional credits purchased
CREATE TABLE additional_credits (
  id SERIAL PRIMARY KEY,
  account_id INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  purchase_date TIMESTAMP DEFAULT NOW(),
  expiry_date TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active',
  stripe_payment_intent_id VARCHAR(255)
);
```

### 3. Calculate Monthly Usage

```typescript
// Example query function
export async function fetchMonthlyCreditsUsed(accountId: number): Promise<number> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const result = await prisma.creditUsage.aggregate({
    where: {
      accountId: accountId,
      createdAt: {
        gte: startOfMonth
      }
    },
    _sum: {
      creditsUsed: true
    }
  });

  return result._sum.creditsUsed || 0;
}
```

## Billing Period Management

### Monthly Reset Logic

```typescript
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
```

### Usage Tracking

```typescript
// Track credit usage when actions are performed
export async function trackCreditUsage(
  accountId: number, 
  agentId: string, 
  creditsUsed: number, 
  actionType: string
) {
  await prisma.creditUsage.create({
    data: {
      accountId,
      agentId,
      creditsUsed,
      actionType,
      createdAt: new Date()
    }
  });

  // Update dashboard stats
  await updateDashboardStats(accountId);
}
```

## API Integration

### Billing API Routes

Create API routes to handle billing operations:

```typescript
// /api/billing/usage
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const accountId = searchParams.get('accountId');
  
  const usage = await fetchMonthlyCreditsUsed(parseInt(accountId));
  const subscription = await fetchSubscription(parseInt(accountId));
  const additionalCredits = await fetchAdditionalCredits(parseInt(accountId));
  
  const integrated = calculateIntegratedCredits(
    { creditsUsed: usage }, 
    subscription, 
    parseInt(accountId)
  );
  
  return Response.json({ success: true, data: integrated });
}
```

## Real-time Updates

### WebSocket Integration

For real-time credit updates:

```typescript
// WebSocket event handling
socket.on('credit-usage', (data) => {
  // Update dashboard stats in real-time
  setIntegratedCredits(prevCredits => {
    if (!prevCredits) return null;
    
    return {
      ...prevCredits,
      totalCredits: {
        ...prevCredits.totalCredits,
        used: prevCredits.totalCredits.used + data.creditsUsed,
        remaining: prevCredits.totalCredits.remaining - data.creditsUsed
      }
    };
  });
});
```

## Testing

### Unit Tests

```typescript
import { calculateIntegratedCredits } from '../credit-billing-integration';

test('calculates overage correctly', () => {
  const mockStats = { creditsUsed: 2000 };
  const mockSubscription = { 
    currentPlan: { name: 'Family Plus', price: 99 }
  };
  
  const result = calculateIntegratedCredits(mockStats, mockSubscription, 1);
  
  expect(result.billing.overage.credits).toBe(500); // 2000 - 1500 plan allowance
  expect(result.billing.overage.cost).toBe(40); // 500 * $0.08
});
```

## Troubleshooting

### Common Issues

1. **Credit counts don't match**: Ensure all credit usage is being tracked consistently
2. **Billing period confusion**: Verify timezone handling for billing period calculations  
3. **Performance issues**: Add database indexes for large credit usage tables
4. **Overage calculations wrong**: Check plan configuration and pricing tiers

### Debug Queries

```sql
-- Check total credits used this month
SELECT SUM(credits_used) 
FROM credit_usage 
WHERE account_id = ? 
AND created_at >= DATE_TRUNC('month', NOW());

-- Check additional credits status
SELECT * FROM additional_credits 
WHERE account_id = ? 
AND status = 'active' 
AND (expiry_date IS NULL OR expiry_date > NOW());
```

This integration provides a comprehensive view of credit usage that matches billing plans, enables proactive cost management, and provides transparency for users about their usage and costs.
