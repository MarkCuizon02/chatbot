import { NextResponse } from 'next/server';
import { Database } from '@/lib/model/database';

const db = new Database();

export async function GET() {
  try {
    const pricingPlans = await db.pricingPlan.getPricingPlans();
    
    return NextResponse.json({
      success: true,
      data: pricingPlans
    });
  } catch (error) {
    console.error('Error fetching pricing plans:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch pricing plans'
      },
      { status: 500 }
    );
  }
} 