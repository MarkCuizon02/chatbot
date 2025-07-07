// API Route: /api/dashboard/agents
// GET /api/dashboard/agents?accountId=1

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

    // Get agents with recent activity
    const agents = await prisma.agent.findMany({
      include: {
        Transaction: {
          where: {
            accountId: accountId,
            transactionDate: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
            }
          }
        }
      }
    });

    const agentStatuses = agents.map(agent => {
      const recentActivity = agent.Transaction.length;
      const performance = calculatePerformance(agent.Transaction);
      
      return {
        id: agent.id,
        name: agent.name,
        description: agent.description,
        image: agent.imageUrl || '/default-agent.png',
        status: agent.status === 'active' ? 'ACTIVE' : 'INACTIVE',
        recentActivity,
        performance
      };
    });

    return NextResponse.json(agentStatuses);

  } catch (error) {
    console.error('Agent statuses error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// Helper function to calculate performance
function calculatePerformance(transactions: { credits: number }[]): number {
  if (transactions.length === 0) return 0;
  
  // Simple performance calculation based on transaction count
  // TODO: Implement more sophisticated performance metrics
  const maxTransactions = 100; // Adjust based on your needs
  return Math.min((transactions.length / maxTransactions) * 100, 100);
}
