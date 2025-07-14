import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to generate a consistent hash
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (optional - be careful in production!)
  console.log('🧹 Clearing existing data...');
  await prisma.planFeature.deleteMany();
  await prisma.pricingPlan.deleteMany();
  await prisma.agent.deleteMany();
  await prisma.aIEngine.deleteMany();

  // Seed AI Engines
  console.log('🤖 Seeding AI Engines...');
  const aiEngines = [
    {
      name: 'GPT-4',
      type: 'Chat',
      snapshot: 'gpt-4-1106-preview',
      description: 'Advanced language model for chat and text generation',
      cost: 0.03
    },
    {
      name: 'GPT-3.5 Turbo',
      type: 'Chat',
      snapshot: 'gpt-3.5-turbo-1106',
      description: 'Fast and efficient chat model',
      cost: 0.002
    },
    {
      name: 'DALL-E 3',
      type: 'Image Generation',
      snapshot: 'dall-e-3',
      description: 'Advanced image generation model',
      cost: 0.04
    },
    {
      name: 'Whisper',
      type: 'Audio Generation',
      snapshot: 'whisper-1',
      description: 'Speech-to-text transcription model',
      cost: 0.006
    },
    {
      name: 'Sora',
      type: 'Video Generation',
      snapshot: 'sora-1',
      description: 'Text-to-video generation model',
      cost: 0.05
    }
  ];

  for (const engine of aiEngines) {
    await prisma.aIEngine.upsert({
      where: { name: engine.name },
      update: engine,
      create: engine
    });
  }

  // Seed Agents
  console.log('👥 Seeding Agents...');
  const agents = [
    {
      name: 'Navi',
      slug: 'navi',
      description: 'Your smart, friendly assistant',
      displayOrder: 1,
      status: 'active',
      releaseDate: new Date('2024-01-01'),
      imageUrl: '/images/Navi.png',
      category: 'assistant',
      tagline: 'Your Smart Assistant',
      tagname: 'smart-assistant'
    },
    {
      name: 'Pixie',
      slug: 'pixie',
      description: 'Conversational AI',
      displayOrder: 2,
      status: 'active',
      releaseDate: new Date('2024-01-01'),
      imageUrl: '/images/Pixie.png',
      category: 'conversation',
      tagline: 'Conversational AI',
      tagname: 'conversation-ai'
    },
    {
      name: 'Paige',
      slug: 'paige',
      description: 'Image Generation',
      displayOrder: 3,
      status: 'active',
      releaseDate: new Date('2024-01-01'),
      imageUrl: '/images/Paige.png',
      category: 'image',
      tagline: 'Image Creator',
      tagname: 'image-generation'
    },
    {
      name: 'Audra',
      slug: 'audra',
      description: 'Video Generation',
      displayOrder: 4,
      status: 'coming_soon',
      releaseDate: new Date('2024-06-01'),
      imageUrl: '/images/Audra.png',
      category: 'video',
      tagline: 'Video Creator',
      tagname: 'video-generation'
    },
    {
      name: 'Flicka',
      slug: 'flicka',
      description: 'Audio Generation',
      displayOrder: 5,
      status: 'coming_soon',
      releaseDate: new Date('2024-07-01'),
      imageUrl: '/images/flicka.png',
      category: 'audio',
      tagline: 'Audio Creator',
      tagname: 'audio-generation'
    }
  ];

  for (const agent of agents) {
    await prisma.agent.upsert({
      where: { slug: agent.slug },
      update: agent,
      create: agent
    });
  }

  // Seed Pricing Plans
  console.log('💰 Seeding Pricing Plans...');
  const pricingPlans = [
    {
      id: 'personal',
      title: 'Personal',
      price: 1900, // $19.00
      credits: 20000,
      description: 'Great for steady personal use with rollover and solid credit limits.',
      buttonText: 'Downgrade Plan',
      href: '/billing/plan',
      billing: '/month',
      popular: false,
      category: 'personal',
      isActive: true,
      stripeProductId: 'prod_personal',
      stripePriceId: 'price_personal_monthly'
    },
    {
      id: 'family',
      title: 'Family',
      price: 3900, // $39.00
      credits: 50000,
      description: 'Flexible plan for families or small teams with shared credits.',
      buttonText: 'Downgrade Plan',
      href: '/billing/plan',
      billing: '/month',
      popular: false,
      category: 'personal',
      isActive: true,
      stripeProductId: 'prod_family',
      stripePriceId: 'price_family_monthly'
    },
    {
      id: 'family-plus',
      title: 'Family Plus',
      price: 9900, // $99.00
      credits: 150000,
      description: 'A solid starting point for businesses with scalable credits.',
      buttonText: 'Current Plan',
      href: '/billing/plan',
      billing: '/month',
      popular: true,
      category: 'personal',
      isActive: true,
      stripeProductId: 'prod_family_plus',
      stripePriceId: 'price_family_plus_monthly'
    },
    {
      id: 'launch',
      title: 'Launch',
      price: 9900, // $99.00
      credits: 150000,
      description: 'Ideal for starting your teams needing more credits, storage and BYOK.',
      buttonText: 'Upgrade Plan',
      href: '/billing/plan',
      billing: '/month',
      popular: false,
      category: 'business',
      isActive: true,
      stripeProductId: 'prod_launch',
      stripePriceId: 'price_launch_monthly'
    },
    {
      id: 'growth',
      title: 'Growth',
      price: 29900, // $299.00
      credits: 500000,
      description: 'Ideal for growing teams needing more credits, storage and BYOK.',
      buttonText: 'Upgrade Plan',
      href: '/billing/plan',
      billing: '/month',
      popular: false,
      category: 'business',
      isActive: true,
      stripeProductId: 'prod_growth',
      stripePriceId: 'price_growth_monthly'
    },
    {
      id: 'pro',
      title: 'Pro',
      price: 69900, // $699.00
      credits: 1500000,
      description: 'Full-featured plan for pro teams with max credits, storage and BYOK.',
      buttonText: 'Upgrade Plan',
      href: '/billing/plan',
      billing: '/month',
      popular: false,
      category: 'business',
      isActive: true,
      stripeProductId: 'prod_pro',
      stripePriceId: 'price_pro_monthly'
    }
  ];

  for (const plan of pricingPlans) {
    await prisma.pricingPlan.upsert({
      where: { id: plan.id },
      update: plan,
      create: plan
    });
  }

  // Seed Plan Features
  console.log('✨ Seeding Plan Features...');
  const planFeatures = [
    // Personal Plan Features
    {
      name: '20,000 credits per month',
      description: '',
      included: true,
      pricingPlanId: 'personal'
    },
    // Family Plan Features
    {
      name: '50,000 credits per month',
      description: '',
      included: true,
      pricingPlanId: 'family'
    },
    {
      name: '4 users',
      description: '',
      included: true,
      pricingPlanId: 'family'
    },
    // Family Plus Plan Features
    {
      name: '150,000 credits per month',
      description: '',
      included: true,
      pricingPlanId: 'family-plus'
    },
    {
      name: '6 users',
      description: '',
      included: true,
      pricingPlanId: 'family-plus'
    },
    // Launch Plan Features
    {
      name: '150,000 credits per month',
      description: '',
      included: true,
      pricingPlanId: 'launch'
    },
    {
      name: '6 users',
      description: '',
      included: true,
      pricingPlanId: 'launch'
    },
    // Growth Plan Features
    {
      name: '500,000 credits per month',
      description: '',
      included: true,
      pricingPlanId: 'growth'
    },
    {
      name: 'Unlimited users',
      description: '',
      included: true,
      pricingPlanId: 'growth'
    },
    // Pro Plan Features
    {
      name: '1,500,000 credits per month',
      description: '',
      included: true,
      pricingPlanId: 'pro'
    },
    {
      name: 'Unlimited users',
      description: '',
      included: true,
      pricingPlanId: 'pro'
    }
  ];

  for (const feature of planFeatures) {
    await prisma.planFeature.upsert({
      where: { 
        id: Math.abs(hashCode(`${feature.pricingPlanId}_${feature.name}`))
      },
      update: feature,
      create: feature
    });
  }

  // Seed a test user for development
  console.log('👤 Seeding test user...');
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword123', // In real app, this would be properly hashed
      firstname: 'Test',
      lastname: 'User',
      verified: true
    }
  });

  console.log('✅ Database seeding completed successfully!');
  console.log(`📊 Created ${aiEngines.length} AI engines`);
  console.log(`📊 Created ${agents.length} agents`);
  console.log(`📊 Created ${pricingPlans.length} pricing plans`);
  console.log(`📊 Created ${planFeatures.length} plan features`);
  console.log(`📊 Created test user: ${testUser.email}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 