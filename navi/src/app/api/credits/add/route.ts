import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Simple endpoint to add credits for testing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, credits, reason } = body;

    if (!userId || !credits) {
      return NextResponse.json({ error: 'User ID and credits are required' }, { status: 400 });
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Add credits to user
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        credits: {
          increment: parseFloat(credits)
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: `Added ${credits} credits to user ${userId}`,
      newBalance: updatedUser.credits,
      reason: reason || 'Manual credit addition'
    });

  } catch (error) {
    console.error('Error adding credits:', error);
    return NextResponse.json({ error: 'Failed to add credits' }, { status: 500 });
  }
}
