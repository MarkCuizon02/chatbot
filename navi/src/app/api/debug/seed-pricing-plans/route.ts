import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
  try {
    console.log('🌱 Seeding pricing plans via API...');

    const plans = [
      {
        id: 'personal',
        title: 'Personal',
        price: 19,
        credits: 200,
        description: 'Great for steady personal use with rollover and solid credit limits.',
        buttonText: 'Upgrade Plan',
        billing: '/month',
        popular: false,
        category: 'personal',
        isActive: true
      },
      {
        id: 'family',
        title: 'Family',
        price: 39,
        credits: 500,
        description: 'Flexible plan for families or small teams with shared credits.',
        buttonText: 'Upgrade Plan',
        billing: '/month',
        popular: false,
        category: 'personal',
        isActive: true
      },
      {
        id: 'family-plus',
        title: 'Family Plus',
        price: 99,
        credits: 1500,
        description: 'A solid starting point for businesses with scalable credits.',
        buttonText: 'Current Plan',
        billing: '/month',
        popular: true,
        category: 'personal',
        isActive: true
      }
    ];

    const results = [];
    
    for (const plan of plans) {
      try {
        const createdPlan = await prisma.pricingPlan.create({
          data: plan
        });
        
        console.log(`✅ Created plan: ${plan.title}`);
        results.push({ success: true, plan: plan.title, id: createdPlan.id });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`❌ Error creating plan ${plan.title}:`, errorMessage);
        results.push({ success: false, plan: plan.title, error: errorMessage });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Pricing plans seeding completed',
      results
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error seeding pricing plans:', error);
    return NextResponse.json(
      { 
        error: 'Failed to seed pricing plans', 
        details: errorMessage 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
