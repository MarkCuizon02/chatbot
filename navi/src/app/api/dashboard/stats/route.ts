// API Route: /api/dashboard/stats
// GET /api/dashboard/stats?accountId=1

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = parseInt(searchParams.get('accountId') || '0');

    if (!accountId) {
      return NextResponse.json({ error: 'Account ID required' }, { status: 400 });
    }

    // TODO: Add authentication check
    // const user = await getCurrentUser(request);
    // if (!user || !hasAccessToAccount(user, accountId)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Get account credits
    const account = await prisma.account.findUnique({
      where: { id: accountId },
      select: { credits: true }
    });

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

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

    // TODO: Calculate actual percentage changes
    const stats = {
      totalCredits: account.credits,
      creditsUsed,
      totalActiveSessions: activeSessions,
      creditsUsedChange: "+5% from last week", // Calculate this
      sessionsChange: "+5% from last week"     // Calculate this
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
