export const databaseConfig = {
  // Supabase connection string format:
  // postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
  
  // Environment variables you need to set in your .env file:
  requiredEnvVars: [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'STRIPE_SECRET_KEY',
    'STRIPE_PUBLISHABLE_KEY'
  ],
  
  // Supabase setup steps:
  setupSteps: [
    '1. Go to https://supabase.com and create a free account',
    '2. Create a new project',
    '3. Go to Settings > Database to get your connection string',
    '4. Create a .env file in your project root',
    '5. Add your DATABASE_URL from Supabase to the .env file',
    '6. Run: npx prisma db push',
    '7. Run: npx prisma generate',
    '8. Run: npm run seed'
  ],
  
  // Supabase advantages:
  advantages: [
    'Free tier with generous limits',
    'Built-in authentication',
    'Real-time subscriptions',
    'Auto-generated APIs',
    'Database backups',
    'No local setup required',
    'Scalable and production-ready'
  ]
}; 