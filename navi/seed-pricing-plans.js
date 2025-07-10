const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedPricingPlans() {
  console.log('🌱 Seeding pricing plans...');
  
  try {
    // Delete existing plans first
    await prisma.planFeature.deleteMany();
    await prisma.pricingPlan.deleteMany();
    
    // Create basic pricing plans
    const plans = [
      {
        id: 'starter',
        title: 'Starter',
        price: 9,
        credits: 1000,
        description: 'Perfect for individuals getting started',
        billing: '/month',
        popular: false,
        category: 'personal',
        isActive: true,
        stripePriceId: 'price_starter_monthly',
        features: [
          { name: '1,000 credits per month', included: true },
          { name: 'Basic AI agents', included: true },
          { name: 'Email support', included: true },
          { name: 'API access', included: false }
        ]
      },
      {
        id: 'professional',
        title: 'Professional',
        price: 29,
        credits: 5000,
        description: 'Great for professionals and small teams',
        billing: '/month',
        popular: true,
        category: 'business',
        isActive: true,
        stripePriceId: 'price_professional_monthly',
        features: [
          { name: '5,000 credits per month', included: true },
          { name: 'All AI agents', included: true },
          { name: 'Priority support', included: true },
          { name: 'API access', included: true },
          { name: 'Custom integrations', included: false }
        ]
      },
      {
        id: 'enterprise',
        title: 'Enterprise',
        price: 99,
        credits: 20000,
        description: 'For large teams and organizations',
        billing: '/month',
        popular: false,
        category: 'enterprise',
        isActive: true,
        stripePriceId: 'price_enterprise_monthly',
        features: [
          { name: '20,000 credits per month', included: true },
          { name: 'All AI agents', included: true },
          { name: '24/7 dedicated support', included: true },
          { name: 'Full API access', included: true },
          { name: 'Custom integrations', included: true },
          { name: 'White-label options', included: true }
        ]
      }
    ];
    
    for (const plan of plans) {
      const { features, ...planData } = plan;
      
      const createdPlan = await prisma.pricingPlan.create({
        data: planData
      });
      
      // Create features for this plan
      for (const feature of features) {
        await prisma.planFeature.create({
          data: {
            ...feature,
            pricingPlanId: createdPlan.id
          }
        });
      }
      
      console.log(`✅ Created plan: ${plan.title} ($${plan.price}/month)`);
    }
    
    console.log('🎉 Pricing plans seeded successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding pricing plans:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
seedPricingPlans();
