# Dashboard Database Integration Guide

This guide explains how to integrate the dashboard with the actual database using Prisma and your existing schema.

## Overview

The dashboard has been prepared for database integration with:
- ✅ TypeScript interfaces for all data structures
- ✅ Separate data fetching functions ready for database calls
- ✅ Mock data that can be easily replaced
- ✅ Proper state management with loading states

## Files Structure

```
src/
├── app/page.tsx              # Main dashboard component
├── lib/dashboard-data.ts     # Database functions to implement
└── lib/db.ts                # Your existing Prisma client
```

## Database Tables Used

Based on your Prisma schema, the dashboard uses these tables:

### Core Tables:
- `Account` - Account credits, settings
- `User` - User information  
- `Transaction` - Credit usage, agent activities
- `Agent` - Agent information and status
- `UserAccount` - User-account relationships
- `ChatThread` - Active sessions tracking

## Implementation Steps

### 1. Replace Mock Functions in `src/lib/dashboard-data.ts`

Each function has TODO comments with example Prisma queries. Replace the mock data with actual database calls.

#### Example: Dashboard Stats
```typescript
export const fetchDashboardStats = async (accountId: number): Promise<DashboardStats> => {
  // Get account credits
  const account = await prisma.account.findUnique({
    where: { id: accountId },
    select: { credits: true }
  });

  // Calculate credits used this month
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const transactions = await prisma.transaction.findMany({
    where: { 
      accountId: accountId,
      transactionDate: { gte: startOfMonth },
      credits: { lt: 0 } // Negative credits = usage
    }
  });
  
  const creditsUsed = transactions.reduce((sum, t) => sum + Math.abs(t.credits), 0);

  // Count active sessions (last 24 hours)
  const activeSessions = await prisma.chatThread.count({
    where: {
      accountId: accountId,
      updatedAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    }
  });

  return {
    totalCredits: account?.credits || 0,
    creditsUsed,
    totalActiveSessions: activeSessions,
    creditsUsedChange: "+5% from last week", // Calculate this
    sessionsChange: "+5% from last week"     // Calculate this
  };
};
```

#### Example: Agent Statuses
```typescript
export const fetchAgentStatuses = async (accountId: number): Promise<AgentStatus[]> => {
  const agents = await prisma.agent.findMany({
    include: {
      transactions: {
        where: {
          accountId: accountId,
          transactionDate: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      }
    }
  });

  return agents.map(agent => ({
    id: agent.id,
    name: agent.name,
    description: agent.description,
    image: agent.imageUrl || '/default-agent.png',
    status: agent.status === 'active' ? 'ACTIVE' : 'INACTIVE',
    recentActivity: agent.transactions.length,
    performance: calculatePerformance(agent.transactions) // Implement this helper
  }));
};
```

### 2. Update Dashboard Component (`src/app/page.tsx`)

The dashboard component is already set up to use these functions. Just update the accountId:

```typescript
// In useEffect, replace hardcoded accountId
const accountId = getCurrentUserAccountId(); // Implement this based on your auth
```

### 3. Add Error Handling

```typescript
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const accountId = getCurrentUserAccountId();
      // ... fetch data
      
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
```

### 4. Add Loading States

```typescript
// In JSX, show loading state
{loading ? (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
  </div>
) : (
  <div>{dashboardStats?.totalCredits.toLocaleString() || '---'}</div>
)}
```

## Helper Functions to Implement

These functions will be useful across multiple dashboard functions:

```typescript
// Get current user's account ID from session/context
const getCurrentUserAccountId = (): number => {
  // Implement based on your auth system
};

// Calculate performance metrics
const calculatePerformance = (transactions: Transaction[]): number => {
  // Calculate based on success rate, response time, etc.
};

// Format time for activity display
const formatActivityTime = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Generate human-readable activity titles
const generateActivityTitle = (transaction: Transaction, agent: Agent): string => {
  const actions = {
    'image': 'Generated images',
    'text': 'Processed text',
    'video': 'Created video',
    'audio': 'Generated audio'
  };
  
  return `${actions[transaction.itemType] || 'Completed task'} - ${transaction.itemCount} items`;
};
```

## Performance Considerations

1. **Add database indexes** for frequently queried fields:
   ```sql
   CREATE INDEX idx_transaction_account_date ON "Transaction"("accountId", "transactionDate");
   CREATE INDEX idx_chatthread_account_updated ON "ChatThread"("accountId", "updatedAt");
   ```

2. **Use pagination** for large datasets:
   ```typescript
   const fetchTeamUsage = async (accountId: number, limit = 50) => {
     // Add limit and offset to queries
   };
   ```

3. **Cache frequently accessed data**:
   ```typescript
   // Use React Query or SWR for caching
   import { useQuery } from 'react-query';
   
   const { data: dashboardStats } = useQuery(
     ['dashboard-stats', accountId],
     () => fetchDashboardStats(accountId),
     { staleTime: 5 * 60 * 1000 } // 5 minutes
   );
   ```

## Testing

1. **Test with different account IDs**
2. **Test with empty data** (new accounts)
3. **Test error scenarios** (database down, etc.)
4. **Test performance** with large datasets

## Migration from Mock Data

1. Start with one function at a time
2. Test thoroughly before moving to the next
3. Keep mock data as fallback during development
4. Add console logs to verify data flow

## Ready for Database Integration ✅

The dashboard is now fully prepared for database integration. Your seniors just need to:
1. Replace the mock functions in `dashboard-data.ts`
2. Add proper error handling
3. Implement user session management
4. Test with real data

All the UI components and state management are ready to work with live database data!
