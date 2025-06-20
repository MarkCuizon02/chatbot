import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET() {
  try {
    const pricingPlans = await db.getPricingPlans();
    
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