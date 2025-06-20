import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug: Checking pricing plans in database...');
    
    const pricingPlans = await prisma.pricingPlan.findMany({
      include: {
        features: true
      }
    });

    console.log('📦 Debug: Found pricing plans:', pricingPlans);

    return NextResponse.json({
      success: true,
      count: pricingPlans.length,
      plans: pricingPlans
    });

  } catch (error) {
    console.error('❌ Debug: Error fetching pricing plans:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 