#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Supabase Setup Helper');
console.log('========================\n');

console.log('📋 Steps to set up Supabase:');
console.log('1. Go to https://supabase.com and create a free account');
console.log('2. Create a new project called "navi-app"');
console.log('3. Wait for the project to be ready (1-2 minutes)');
console.log('4. Go to Settings → Database');
console.log('5. Copy the connection string (URI format)');
console.log('6. Copy the anon key from Settings → API\n');

console.log('🔧 Environment Variables to add to your .env file:');
console.log('DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"');
console.log('NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"');
console.log('NEXTAUTH_SECRET="your-secret-key"');
console.log('NEXTAUTH_URL="http://localhost:3000"');
console.log('STRIPE_SECRET_KEY="your-stripe-key"');
console.log('STRIPE_PUBLISHABLE_KEY="your-stripe-key"\n');

console.log('⚡ After setting up your .env file, run:');
console.log('npm run db:push');
console.log('npm run db:generate');
console.log('npm run seed\n');

console.log('🎉 You\'re all set! Your database will be ready to use.');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.log('\n📝 Creating .env.example file...');
  const envExample = `# Database (Supabase)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
`;

  fs.writeFileSync(path.join(process.cwd(), '.env.example'), envExample);
  console.log('✅ Created .env.example file');
  console.log('📝 Copy .env.example to .env and fill in your values\n');
} 