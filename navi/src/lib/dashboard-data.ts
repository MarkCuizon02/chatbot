// Database queries for dashboard data
// Replace these functions with actual database calls using Prisma

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Types for database operations
export interface DashboardStats {
  totalCredits: number;
  creditsUsed: number;
  totalActiveSessions: number;
  creditsUsedChange: string;
  sessionsChange: string;
}

export interface AgentStatus {
  id: number;
  name: string;
  description: string;
  image: string;
  status: 'ACTIVE' | 'INACTIVE';
  recentActivity: number;
  performance: number;
}

export interface ChartDataPoint {
  name: string;
  Navi: number;
  Pixie: number;
  Paige: number;
  Audra: number;
  Flicka: number;
}

export interface TeamUser {
  id: number;
  name: string;
  usage: number;
  credits: number;
  avatar?: string;
}

export interface AgentActivity {
  id: number;
  agentName: string;
  agentImage: string;
  title: string;
  time: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

// Dashboard Statistics
export const fetchDashboardStats = async (accountId: number): Promise<DashboardStats> => {
  try {
    // Option 1: Use API route (recommended for client-side)
    const response = await fetch(`/api/dashboard/stats?accountId=${accountId}`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return await response.json();
    
    // Option 2: Direct Prisma query (for server-side rendering)
    // const account = await prisma.account.findUnique({
    //   where: { id: accountId },
    //   select: { credits: true }
    // });

    // const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    // const transactions = await prisma.transaction.findMany({
    //   where: { 
    //     accountId: accountId,
    //     transactionDate: { gte: startOfMonth },
    //     credits: { lt: 0 }
    //   }
    // });
    
    // const creditsUsed = transactions.reduce((sum, t) => sum + Math.abs(t.credits), 0);

    // const activeSessions = await prisma.chatThread.count({
    //   where: {
    //     accountId: accountId,
    //     updatedAt: {
    //       gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
    //     }
    //   }
    // });

    // return {
    //   totalCredits: account?.credits || 0,
    //   creditsUsed,
    //   totalActiveSessions: activeSessions,
    //   creditsUsedChange: "+5% from last week",
    //   sessionsChange: "+5% from last week"
    // };

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    
    // Fallback to mock data during development
    return {
      totalCredits: 15700,
      creditsUsed: 1500,
      totalActiveSessions: 1250,
      creditsUsedChange: "+5% from last week",
      sessionsChange: "+5% from last week"
    };
  }
};

// Agent Status Data
export const fetchAgentStatuses = async (accountId: number): Promise<AgentStatus[]> => {
  try {
    // TODO: Replace with actual Prisma queries
    // Example query:
    
    // const agents = await prisma.agent.findMany({
    //   include: {
    //     transactions: {
    //       where: {
    //         accountId: accountId,
    //         transactionDate: {
    //           gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
    //         }
    //       }
    //     }
    //   }
    // });

    // const agentStatuses = agents.map(agent => ({
    //   id: agent.id,
    //   name: agent.name,
    //   description: agent.description,
    //   image: agent.imageUrl || '/default-agent.png',
    //   status: agent.status === 'active' ? 'ACTIVE' : 'INACTIVE',
    //   recentActivity: agent.transactions.length,
    //   performance: calculatePerformance(agent.transactions)
    // }));

    // Mock data for now
    return [
      {
        id: 1,
        name: 'Navi',
        description: 'Your smart, friendly assistant',
        image: '/images/Navi.png',
        status: 'ACTIVE',
        recentActivity: 120,
        performance: 70
      },
      {
        id: 2,
        name: 'Pixie',
        description: 'Conversational AI',
        image: '/images/Pixie.png',
        status: 'ACTIVE',
        recentActivity: 350,
        performance: 20
      },
      {
        id: 3,
        name: 'Paige',
        description: 'Image Generation',
        image: '/images/Paige.png',
        status: 'ACTIVE',
        recentActivity: 500,
        performance: 40
      },
      {
        id: 4,
        name: 'Audra',
        description: 'Video Generation',
        image: '/images/Audra.png',
        status: 'ACTIVE',
        recentActivity: 500,
        performance: 10
      },
      {
        id: 5,
        name: 'Flicka',
        description: 'Audio Generation',
        image: '/images/flicka.png',
        status: 'INACTIVE',
        recentActivity: 500,
        performance: 5
      }
    ];
  } catch (error) {
    console.error('Error fetching agent statuses:', error);
    throw error;
  }
};

// Chart Data for Performance Visualization
export const fetchChartData = async (accountId: number, days: number = 5): Promise<ChartDataPoint[]> => {
  try {
    // TODO: Replace with actual Prisma queries
    // Example query:
    
    // const endDate = new Date();
    // const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

    // const transactions = await prisma.transaction.findMany({
    //   where: {
    //     accountId: accountId,
    //     transactionDate: {
    //       gte: startDate,
    //       lte: endDate
    //     }
    //   },
    //   include: {
    //     agent: true
    //   },
    //   orderBy: {
    //     transactionDate: 'asc'
    //   }
    // });

    // Group by date and agent, then format for chart
    // const chartData = groupTransactionsByDateAndAgent(transactions);

    // Mock data for now
    return [
      { name: 'Jun 05', Navi: 60, Pixie: 40, Paige: 50, Audra: 20, Flicka: 15 },
      { name: 'Jun 06', Navi: 80, Pixie: 45, Paige: 55, Audra: 25, Flicka: 18 },
      { name: 'Jun 07', Navi: 90, Pixie: 60, Paige: 60, Audra: 35, Flicka: 20 },
      { name: 'Jun 08', Navi: 110, Pixie: 80, Paige: 65, Audra: 30, Flicka: 25 },
      { name: 'Jun 09', Navi: 100, Pixie: 70, Paige: 58, Audra: 22, Flicka: 28 },
    ];
  } catch (error) {
    console.error('Error fetching chart data:', error);
    throw error;
  }
};

// Team Usage Data
export const fetchTeamUsage = async (accountId: number): Promise<TeamUser[]> => {
  try {
    // TODO: Replace with actual Prisma queries
    // Example query:
    
    // const teamUsers = await prisma.userAccount.findMany({
    //   where: { accountId: accountId },
    //   include: {
    //     user: {
    //       select: {
    //         id: true,
    //         firstname: true,
    //         lastname: true,
    //         transactions: {
    //           where: {
    //             accountId: accountId,
    //             transactionDate: {
    //               gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    // });

    // const teamUsage = teamUsers.map(userAccount => ({
    //   id: userAccount.user.id,
    //   name: `${userAccount.user.firstname} ${userAccount.user.lastname}`,
    //   usage: userAccount.user.transactions.length,
    //   credits: userAccount.user.transactions.reduce((sum, t) => sum + Math.abs(t.credits), 0)
    // }));

    // Mock data for now
    return [
      { id: 1, name: 'Skylar Westervelt', usage: 321, credits: 545 },
      { id: 2, name: 'Jordyn Bergson', usage: 645, credits: 76 },
      { id: 3, name: 'Gustavo Dias', usage: 123, credits: 785 },
      { id: 4, name: 'Jaylon Torff', usage: 653, credits: 2235 },
      { id: 5, name: 'Maria Workman', usage: 251, credits: 3784 },
      { id: 6, name: 'Ahmad Geidt', usage: 987, credits: 241 },
      { id: 7, name: 'Alex Johnson', usage: 456, credits: 1890 },
      { id: 8, name: 'Sarah Chen', usage: 789, credits: 892 },
      { id: 9, name: 'Mike Rodriguez', usage: 234, credits: 1567 },
      { id: 10, name: 'Emily Davis', usage: 567, credits: 432 },
    ];
  } catch (error) {
    console.error('Error fetching team usage:', error);
    throw error;
  }
};

// Agent Activities
export const fetchAgentActivities = async (accountId: number, limit: number = 10): Promise<AgentActivity[]> => {
  try {
    // TODO: Replace with actual Prisma queries
    // Example query:
    
    // const recentTransactions = await prisma.transaction.findMany({
    //   where: { accountId: accountId },
    //   include: {
    //     agent: true,
    //     user: true
    //   },
    //   orderBy: {
    //     transactionDate: 'desc'
    //   },
    //   take: limit
    // });

    // const activities = recentTransactions.map((transaction, index) => ({
    //   id: transaction.id,
    //   agentName: transaction.agent.name,
    //   agentImage: transaction.agent.imageUrl || '/default-agent.png',
    //   title: generateActivityTitle(transaction),
    //   time: formatActivityTime(transaction.transactionDate),
    //   status: determineActivityStatus(transaction)
    // }));

    // Mock data for now
    return [
      {
        id: 1,
        agentName: 'Pixie',
        agentImage: '/images/Pixie.png',
        title: 'Generated 10 new images for project "Alpha"',
        time: '12:09 AM - Jun 10, 2025',
        status: 'success'
      },
      {
        id: 2,
        agentName: 'Chattie',
        agentImage: '/images/Chattie.png',
        title: 'Handled 50 user queries with 98% satisfaction.',
        time: '12:09 AM - Jun 10, 2025',
        status: 'warning'
      },
      {
        id: 3,
        agentName: 'Navi',
        agentImage: '/images/Navi.png',
        title: 'Knowledge base updated with new documents.',
        time: '12:09 AM - Jun 10, 2025',
        status: 'info'
      },
      {
        id: 4,
        agentName: 'Flicka',
        agentImage: '/images/flicka.png',
        title: 'Video rendering "Beta" failed. Retrying.',
        time: '12:09 AM - Jun 10, 2025',
        status: 'success'
      },
      {
        id: 5,
        agentName: 'Audra',
        agentImage: '/images/Audra.png',
        title: 'Generated voiceover for tutorial video.',
        time: '12:09 AM - Jun 10, 2025',
        status: 'success'
      }
    ];
  } catch (error) {
    console.error('Error fetching agent activities:', error);
    throw error;
  }
};

// Helper functions that your seniors will need to implement
// const calculatePerformance = (transactions: any[]) => {
//   // Calculate performance based on transaction success rate, speed, etc.
// };

// const groupTransactionsByDateAndAgent = (transactions: any[]) => {
//   // Group transactions by date and agent for chart visualization
// };

// const generateActivityTitle = (transaction: any) => {
//   // Generate human-readable activity title from transaction data
// };

// const formatActivityTime = (date: Date) => {
//   // Format date for activity display
// };

// const determineActivityStatus = (transaction: any) => {
//   // Determine activity status based on transaction data
// };
