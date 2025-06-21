import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
      imageUrl: '/images/Navi.png'
    },
    {
      name: 'Pixie',
      slug: 'pixie',
      description: 'Conversational AI',
      displayOrder: 2,
      status: 'active',
      releaseDate: new Date('2024-01-01'),
      imageUrl: '/images/Pixie.png'
    },
    {
      name: 'Paige',
      slug: 'paige',
      description: 'Image Generation',
      displayOrder: 3,
      status: 'active',
      releaseDate: new Date('2024-01-01'),
      imageUrl: '/images/Paige.png'
    },
    {
      name: 'Audra',
      slug: 'audra',
      description: 'Video Generation',
      displayOrder: 4,
      status: 'coming_soon',
      releaseDate: new Date('2024-06-01'),
      imageUrl: '/images/Audra.png'
    },
    {
      name: 'Flicka',
      slug: 'flicka',
      description: 'Audio Generation',
      displayOrder: 5,
      status: 'coming_soon',
      releaseDate: new Date('2024-07-01'),
      imageUrl: '/images/flicka.png'
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
      description: 'Great for steady personal use with rollover and solid credit limits.',
      buttonText: 'Upgrade Plan',
      href: '/billing/plan/personal',
      billing: '/month',
      popular: false,
      isActive: true,
      stripeProductId: 'prod_personal',
      stripePriceId: 'price_personal_monthly'
    },
    {
      id: 'family',
      title: 'Family',
      price: 3900, // $39.00
      description: 'Flexible plan for families or small teams with shared credits.',
      buttonText: 'Upgrade Plan',
      href: '/billing/plan/family',
      billing: '/month',
      popular: false,
      isActive: true,
      stripeProductId: 'prod_family',
      stripePriceId: 'price_family_monthly'
    },
    {
      id: 'family-plus',
      title: 'Family Plus',
      price: 9900, // $99.00
      description: 'A solid starting point for businesses with scalable credits.',
      buttonText: 'Current Plan',
      href: '/billing/plan/family-plus',
      billing: '/month',
      popular: true,
      isActive: true,
      stripeProductId: 'prod_family_plus',
      stripePriceId: 'price_family_plus_monthly'
    },
    {
      id: 'launch',
      title: 'Launch',
      price: 9900, // $99.00
      description: 'Ideal for starting your teams needing more credits, storage and BYOK.',
      buttonText: 'Upgrade Plan',
      href: '/billing/plan/launch',
      billing: '/month',
      popular: false,
      isActive: true,
      stripeProductId: 'prod_launch',
      stripePriceId: 'price_launch_monthly'
    },
    {
      id: 'growth',
      title: 'Growth',
      price: 29900, // $299.00
      description: 'Ideal for growing teams needing more credits, storage and BYOK.',
      buttonText: 'Upgrade Plan',
      href: '/billing/plan/growth',
      billing: '/month',
      popular: false,
      isActive: true,
      stripeProductId: 'prod_growth',
      stripePriceId: 'price_growth_monthly'
    },
    {
      id: 'pro',
      title: 'Pro',
      price: 69900, // $699.00
      description: 'Full-featured plan for pro teams with max credits, storage and BYOK.',
      buttonText: 'Upgrade Plan',
      href: '/billing/plan/pro',
      billing: '/month',
      popular: false,
      isActive: true,
      stripeProductId: 'prod_pro',
      stripePriceId: 'price_pro_monthly'
    },
    {
      id: 'human-digital-manager',
      title: 'Human Digital Manager',
      price: 250000, // $2500.00
      description: 'Full-featured plan for pro teams with max credits, storage and BYOK.',
      buttonText: 'Upgrade Plan',
      href: '/billing/plan/human-digital-manager',
      billing: '/month',
      popular: false,
      isActive: true,
      stripeProductId: 'prod_human_digital_manager',
      stripePriceId: 'price_human_digital_manager_monthly'
    },
    {
      id: 'founders-club',
      title: "Founder's Club",
      price: 250000, // $2500.00
      description: 'Exclusive plan for local small business owners.',
      buttonText: 'Upgrade Plan',
      href: '/billing/plan/founders-club',
      billing: '/month',
      popular: false,
      isActive: true,
      stripeProductId: 'prod_founders_club',
      stripePriceId: 'price_founders_club_monthly'
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
      name: 'Navi Agent',
      description: 'Access to Navi, your smart assistant',
      included: true,
      pricingPlanId: 'personal'
    },
    {
      name: 'Pixie Agent',
      description: 'Conversational AI capabilities',
      included: true,
      pricingPlanId: 'personal'
    },
    {
      name: '200 Credits',
      description: 'Monthly credit allocation',
      included: true,
      pricingPlanId: 'personal'
    },
    {
      name: 'Basic Support',
      description: 'Email support during business hours',
      included: true,
      pricingPlanId: 'personal'
    },
    // Family Plan Features
    {
      name: 'Navi Agent',
      description: 'Access to Navi, your smart assistant',
      included: true,
      pricingPlanId: 'family'
    },
    {
      name: 'Pixie Agent',
      description: 'Conversational AI capabilities',
      included: true,
      pricingPlanId: 'family'
    },
    {
      name: '500 Credits',
      description: 'Monthly credit allocation',
      included: true,
      pricingPlanId: 'family'
    },
    {
      name: '4 Users',
      description: 'Team member access',
      included: true,
      pricingPlanId: 'family'
    },
    // Family Plus Plan Features
    {
      name: 'Navi Agent',
      description: 'Access to Navi, your smart assistant',
      included: true,
      pricingPlanId: 'family-plus'
    },
    {
      name: 'Pixie Agent',
      description: 'Conversational AI capabilities',
      included: true,
      pricingPlanId: 'family-plus'
    },
    {
      name: '1500 Credits',
      description: 'Monthly credit allocation',
      included: true,
      pricingPlanId: 'family-plus'
    },
    {
      name: '6 Users',
      description: 'Team member access',
      included: true,
      pricingPlanId: 'family-plus'
    },
    // Launch Plan Features
    {
      name: 'All AI Agents',
      description: 'Access to all available AI agents',
      included: true,
      pricingPlanId: 'launch'
    },
    {
      name: '1500 Credits',
      description: 'Monthly credit allocation',
      included: true,
      pricingPlanId: 'launch'
    },
    {
      name: '6 Users',
      description: 'Team member access',
      included: true,
      pricingPlanId: 'launch'
    },
    {
      name: 'Priority Support',
      description: 'Priority email and chat support',
      included: true,
      pricingPlanId: 'launch'
    },
    // Growth Plan Features
    {
      name: 'All AI Agents',
      description: 'Access to all available AI agents',
      included: true,
      pricingPlanId: 'growth'
    },
    {
      name: '5000 Credits',
      description: 'Monthly credit allocation',
      included: true,
      pricingPlanId: 'growth'
    },
    {
      name: 'Unlimited Users',
      description: 'Unlimited team member access',
      included: true,
      pricingPlanId: 'growth'
    },
    {
      name: 'Priority Support',
      description: 'Priority email and chat support',
      included: true,
      pricingPlanId: 'growth'
    },
    // Pro Plan Features
    {
      name: 'All AI Agents',
      description: 'Access to all available AI agents',
      included: true,
      pricingPlanId: 'pro'
    },
    {
      name: '15000 Credits',
      description: 'Monthly credit allocation',
      included: true,
      pricingPlanId: 'pro'
    },
    {
      name: 'Unlimited Users',
      description: 'Unlimited team member access',
      included: true,
      pricingPlanId: 'pro'
    },
    {
      name: 'Priority Support',
      description: 'Priority email and chat support',
      included: true,
      pricingPlanId: 'pro'
    },
    // Human Digital Manager Plan Features
    {
      name: 'All AI Agents',
      description: 'Access to all available AI agents',
      included: true,
      pricingPlanId: 'human-digital-manager'
    },
    {
      name: '50000 Credits',
      description: 'Monthly credit allocation',
      included: true,
      pricingPlanId: 'human-digital-manager'
    },
    {
      name: 'Unlimited Users',
      description: 'Unlimited team member access',
      included: true,
      pricingPlanId: 'human-digital-manager'
    },
    {
      name: 'Dedicated Support',
      description: 'Dedicated account manager',
      included: true,
      pricingPlanId: 'human-digital-manager'
    },
    // Founder's Club Plan Features
    {
      name: '+20% Bonus Credits',
      description: 'Lifetime bonus credits',
      included: true,
      pricingPlanId: 'founders-club'
    },
    {
      name: 'Community Access',
      description: 'Access to exclusive community',
      included: true,
      pricingPlanId: 'founders-club'
    },
    {
      name: 'Early Feature Access',
      description: 'Early access to new features',
      included: true,
      pricingPlanId: 'founders-club'
    },
    {
      name: 'Locked Pricing',
      description: 'No future price increases',
      included: true,
      pricingPlanId: 'founders-club'
    }
  ];

  for (const feature of planFeatures) {
    await prisma.planFeature.upsert({
      where: { 
        id: `${feature.pricingPlanId}_${feature.name.toLowerCase().replace(/\s+/g, '_')}` 
      },
      update: feature,
      create: {
        ...feature,
        id: `${feature.pricingPlanId}_${feature.name.toLowerCase().replace(/\s+/g, '_')}`
      }
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