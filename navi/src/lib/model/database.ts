import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class Database {
  private dbType: 'prisma' | 'firebase' | 'mysql';

  constructor(type: 'prisma' | 'firebase' | 'mysql' = 'prisma') {
    this.dbType = type;
  }

  account = {
    getAccountWithEmail: async (email: string) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            accounts: {
              include: {
                account: true
              }
            }
          }
        });

        if (!user || !user.accounts.length) {
          return null;
        }

        return user.accounts[0].account;
      } catch (error) {
        console.error('Error getting account with email:', error);
        return null;
      }
    },

    getAccountByStripeCustomerId: async (stripeCustomerId: string) => {
      try {
        const account = await prisma.account.findFirst({
          where: { stripCustomerId: stripeCustomerId }
        });
        return account;
      } catch (error) {
        console.error('Error getting account by stripe customer ID:', error);
        return null;
      }
    },

    updateAccountCredits: async (accountId: number, credits: number) => {
      try {
        const account = await prisma.account.update({
          where: { id: accountId },
          data: {
            credits: {
              increment: credits
            }
          }
        });
        return account;
      } catch (error) {
        console.error('Error updating account credits:', error);
        throw error;
      }
    },

    updateAccountStripeCustomerId: async (accountId: number, stripeCustomerId: string) => {
      try {
        const account = await prisma.account.update({
          where: { id: accountId },
          data: { stripCustomerId: stripeCustomerId }
        });
        return account;
      } catch (error) {
        console.error('Error updating account stripe customer ID:', error);
        throw error;
      }
    },

    getUserAccountForAccount: async (accountId: number) => {
      try {
        const userAccount = await prisma.userAccount.findFirst({
          where: { accountId },
          include: {
            user: true
          }
        });
        return userAccount;
      } catch (error) {
        console.error('Error getting user account for account:', error);
        return null;
      }
    },

    getAccountById: async (accountId: number) => {
      try {
        const account = await prisma.account.findUnique({
          where: { id: accountId }
        });
        return account;
      } catch (error) {
        console.error('Error getting account by ID:', error);
        return null;
      }
    }
  };

  subscription = {
    createSubscription: async (data: {
      accountId?: number | null;
      userId?: number | null;
      stripeSubscriptionId: string;
      stripeCustomerId: string;
      currentPeriodStart?: Date;
      currentPeriodEnd?: Date;
      stripePriceId: string;
      status?: 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'UNPAID' | 'TRIALING';
    }) => {
      try {
        if (!data.accountId && !data.userId) {
          throw new Error('Either Account ID or User ID is required');
        }

        const subscription = await prisma.subscription.create({
          data: {
            accountId: data.accountId,
            userId: data.userId,
            stripeSubscriptionId: data.stripeSubscriptionId,
            stripeCustomerId: data.stripeCustomerId,
            stripePriceId: data.stripePriceId,
            currentPeriodStart: data.currentPeriodStart,
            currentPeriodEnd: data.currentPeriodEnd,
            status: data.status || 'ACTIVE'
          }
        });
        return subscription;
      } catch (error) {
        console.error('Error creating subscription:', error);
        throw error;
      }
    },

    getSubscriptionByStripeId: async (stripeSubscriptionId: string) => {
      try {
        const subscription = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId }
        });
        return subscription;
      } catch (error) {
        console.error('Error getting subscription by stripe ID:', error);
        return null;
      }
    },

    upsertSubscription: async (stripeSubscriptionId: string, data: {
      userId: number;
      accountId: number;
      stripeCustomerId: string;
      stripePriceId?: string;
      status: 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'UNPAID' | 'TRIALING';
      currentPeriodStart: Date;
      currentPeriodEnd: Date;
      cancelAtPeriodEnd: boolean;
      canceledAt?: Date;
    }) => {
      try {
        const subscription = await prisma.subscription.upsert({
          where: { stripeSubscriptionId },
          update: {
            status: data.status,
            stripePriceId: data.stripePriceId,
            currentPeriodStart: data.currentPeriodStart,
            currentPeriodEnd: data.currentPeriodEnd,
            cancelAtPeriodEnd: data.cancelAtPeriodEnd,
            canceledAt: data.canceledAt,
          },
          create: {
            userId: data.userId,        // ⭐ USER-BASED subscription
            accountId: data.accountId,  // ⭐ ACCOUNT handles billing
            stripeSubscriptionId,
            stripeCustomerId: data.stripeCustomerId,
            stripePriceId: data.stripePriceId,
            status: data.status,
            currentPeriodStart: data.currentPeriodStart,
            currentPeriodEnd: data.currentPeriodEnd,
            cancelAtPeriodEnd: data.cancelAtPeriodEnd,
            canceledAt: data.canceledAt,
          }
        });
        return subscription;
      } catch (error) {
        console.error('Error upserting subscription:', error);
        throw error;
      }
    },

    getSubscriptionByAccountId: async (accountId: number) => {
      try {
        const subscription = await prisma.subscription.findFirst({
          where: { accountId }
        });
        return subscription;
      } catch (error) {
        console.error('Error getting subscription by account ID:', error);
        return null;
      }
    },

    getSubscriptionByUserId: async (userId: number) => {
      try {
        const subscription = await prisma.subscription.findFirst({
          where: { userId }
        });
        return subscription;
      } catch (error) {
        console.error('Error getting subscription by user ID:', error);
        return null;
      }
    },

    updateSubscriptionByStripeId: async (stripeSubscriptionId: string, data: {
      status?: 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'UNPAID' | 'TRIALING';
      stripePriceId?: string;
      currentPeriodStart?: Date;
      currentPeriodEnd?: Date;
      cancelAtPeriodEnd?: boolean;
      canceledAt?: Date;
    }) => {
      try {
        const subscription = await prisma.subscription.update({
          where: { stripeSubscriptionId },
          data
        });
        return subscription;
      } catch (error) {
        console.error('Error updating subscription by stripe ID:', error);
        throw error;
      }
    },

    updateSubscription: async (subscriptionId: number, data: {
      status?: 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'UNPAID' | 'TRIALING';
      cancelAtPeriodEnd?: boolean;
      canceledAt?: Date;
      currentPeriodStart?: Date;
      currentPeriodEnd?: Date;
    }) => {
      try {
        const subscription = await prisma.subscription.update({
          where: { id: subscriptionId },
          data
        });
        return subscription;
      } catch (error) {
        console.error('Error updating subscription:', error);
        throw error;
      }
    },

    updateSubscriptionStatus: async (subscriptionId: number, status: 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'UNPAID' | 'TRIALING') => {
      try {
        const subscription = await prisma.subscription.update({
          where: { id: subscriptionId },
          data: { 
            status,
            canceledAt: status === 'CANCELED' ? new Date() : undefined
          }
        });
        return subscription;
      } catch (error) {
        console.error('Error updating subscription status:', error);
        throw error;
      }
    },

    updateSubscriptionWithStripeData: async (subscriptionId: number, data: {
      stripeSubscriptionId?: string;
      stripePriceId?: string;
      status?: 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'UNPAID' | 'TRIALING';
      cancelAtPeriodEnd?: boolean;
      canceledAt?: Date;
      currentPeriodStart?: Date;
      currentPeriodEnd?: Date;
    }) => {
      try {
        const subscription = await prisma.subscription.update({
          where: { id: subscriptionId },
          data
        });
        return subscription;
      } catch (error) {
        console.error('Error updating subscription with Stripe data:', error);
        throw error;
      }
    },

    getUserSubscriptions: async (userId: number) => {
      try {
        const subscriptions = await prisma.subscription.findMany({
          where: { userId },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstname: true,
                lastname: true
              }
            },
            account: {
              select: {
                id: true,
                name: true,
                type: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
        return subscriptions;
      } catch (error) {
        console.error('Error getting user subscriptions:', error);
        return [];
      }
    },
  };

  invoice = {
    getInvoiceByStripeId: async (stripeInvoiceId: string) => {
      try {
        const invoice = await prisma.invoice.findUnique({
          where: { stripeInvoiceId }
        });
        return invoice;
      } catch (error) {
        console.error('Error getting invoice by stripe ID:', error);
        return null;
      }
    },

    createInvoice: async (data: {
      accountId: number;
      subscriptionId?: string;
      stripeInvoiceId: string;
      amountDue: number;
      amountPaid: number;
      currency: string;
      status: string;
      dueDate?: Date;
      paidAt?: Date;
    }) => {
      try {
        // Check if invoice already exists to prevent duplicates
        const existingInvoice = await prisma.invoice.findUnique({
          where: { stripeInvoiceId: data.stripeInvoiceId }
        });

        if (existingInvoice) {
          console.log('Invoice already exists:', data.stripeInvoiceId);
          return existingInvoice;
        }

        const invoice = await prisma.invoice.create({
          data: {
            accountId: data.accountId,
            subscriptionId: data.subscriptionId || null,
            stripeInvoiceId: data.stripeInvoiceId,
            amountDue: data.amountDue,
            amountPaid: data.amountPaid,
            currency: data.currency,
            status: data.status,
            dueDate: data.dueDate,
            paidAt: data.paidAt
          }
        });

        return invoice;
      } catch (error) {
        console.error('Error creating invoice:', error);
        throw error;
      }
    },

    updateInvoiceStatus: async (stripeInvoiceId: string, status: string) => {
      try {
        const invoice = await prisma.invoice.update({
          where: { stripeInvoiceId },
          data: { status, amountPaid: status === 'payment_failed' ? 0 : undefined }
        });
        return invoice;
      } catch (error) {
        console.error('Error updating invoice status:', error);
        throw error;
      }
    },

    // ⭐ NEW: Update invoice with userId for credit purchases
    updateInvoiceUserId: async (invoiceId: number, userId: number) => {
      try {
        const invoice = await prisma.invoice.update({
          where: { id: invoiceId },
          data: { userId }
        });
        return invoice;
      } catch (error) {
        console.error('Error updating invoice userId:', error);
        throw error;
      }
    }
  };

  pricingPlan = {
    getPricingPlans: async () => {
      try {
        const plans = await prisma.pricingPlan.findMany({
          where: { isActive: true },
          include: {
            features: {
              orderBy: { name: 'asc' }
            }
          },
          orderBy: { price: 'asc' }
        });
        return plans;
      } catch (error) {
        console.error('Error getting pricing plans:', error);
        throw error;
      }
    },

    getPricingPlanById: async (id: string) => {
      try {
        const plan = await prisma.pricingPlan.findUnique({
          where: { id },
          include: {
            features: {
              orderBy: { name: 'asc' }
            }
          }
        });
        return plan;
      } catch (error) {
        console.error('Error getting pricing plan by ID:', error);
        return null;
      }
    },

    getPricingPlanByTitle: async (title: string) => {
      try {
        const plan = await prisma.pricingPlan.findFirst({
          where: { 
            title,
            isActive: true
          },
          include: {
            features: {
              orderBy: { name: 'asc' }
            }
          }
        });
        return plan;
      } catch (error) {
        console.error('Error getting pricing plan by title:', error);
        return null;
      }
    },

    updatePricingPlan: async (id: string, data: {
      title?: string;
      price?: number;
      credits?: number;
      description?: string;
      stripeProductId?: string;
      stripePriceId?: string;
    }) => {
      try {
        const plan = await prisma.pricingPlan.update({
          where: { id },
          data,
          include: {
            features: true
          }
        });
        return plan;
      } catch (error) {
        console.error('Error updating pricing plan:', error);
        throw error;
      }
    }
  };

  user = {
    getUserById: async (userId: number) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId }
        });
        return user;
      } catch (error) {
        console.error('Error getting user by ID:', error);
        return null;
      }
    },

    getAccountIdForUser: async (userId: number) => {
      try {
        const userAccount = await prisma.userAccount.findFirst({
          where: { userId },
          include: {
            account: true
          }
        });
        return userAccount?.accountId || null;
      } catch (error) {
        console.error('Error getting account ID for user:', error);
        return null;
      }
    },

    // ⭐ NEW: Update user credits (not account credits)
    updateUserCredits: async (userId: number, creditsToAdd: number) => {
      try {
        // Get current user first
        const currentUser = await prisma.user.findUnique({
          where: { id: userId },
          select: { credits: true }
        });
        
        if (!currentUser) {
          throw new Error(`User ${userId} not found`);
        }

        const user = await prisma.user.update({
          where: { id: userId },
          data: {
            credits: currentUser.credits + creditsToAdd
          }
        });
        return user;
      } catch (error) {
        console.error('Error updating user credits:', error);
        throw error;
      }
    }
  };
}
