import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Helper functions for common database operations
export const db = {
  // Pricing Plans
  async getPricingPlans() {
    return await prisma.pricingPlan.findMany({
      where: { isActive: true },
      include: {
        features: {
          orderBy: { name: 'asc' }
        }
      },
      orderBy: { price: 'asc' }
    });
  },

  async getPricingPlanById(id: string) {
    return await prisma.pricingPlan.findUnique({
      where: { id },
      include: {
        features: {
          orderBy: { name: 'asc' }
        }
      }
    });
  },

  // Agents
  async getAgents() {
    return await prisma.agent.findMany({
      orderBy: { displayOrder: 'asc' }
    });
  },

  async getActiveAgents() {
    return await prisma.agent.findMany({
      where: { status: 'active' },
      orderBy: { displayOrder: 'asc' }
    });
  },

  // AI Engines
  async getAIEngines() {
    return await prisma.aIEngine.findMany({
      orderBy: { name: 'asc' }
    });
  },

  // Users and Accounts
  async getUserWithAccounts(userId: number) {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: {
          include: {
            account: true
          }
        }
      }
    });
  },

  async getAccountWithUsers(accountId: number) {
    return await prisma.account.findUnique({
      where: { id: accountId },
      include: {
        users: {
          include: {
            user: true
          }
        }
      }
    });
  },

  // Subscriptions
  async getUserSubscription(userId: number) {
    return await prisma.subscription.findFirst({
      where: { 
        userId,
        status: { in: ['ACTIVE', 'TRIALING'] }
      },
      include: {
        user: true
      }
    });
  }
}; 