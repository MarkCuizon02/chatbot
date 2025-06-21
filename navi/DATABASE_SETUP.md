# Database Setup Guide - Supabase

This guide will help you set up Supabase with Prisma for the Navi application.

## Prerequisites

1. **Supabase Account**
   - Go to [supabase.com](https://supabase.com) and create a free account
   - No local PostgreSQL installation required!

2. **Node.js and npm** (already installed)

## Step 1: Create Supabase Project

1. **Sign up/Login to Supabase:**
   - Visit [supabase.com](https://supabase.com)
   - Click "Start your project" or "Sign In"

2. **Create a new project:**
   - Click "New Project"
   - Choose your organization
   - Enter project name: `navi-app`
   - Enter a secure database password (save this!)
   - Choose a region close to your users
   - Click "Create new project"

3. **Wait for setup to complete** (usually 1-2 minutes)

## Step 2: Get Database Connection String

1. **Go to Project Settings:**
   - In your Supabase dashboard, click on your project
   - Go to Settings → Database

2. **Copy the connection string:**
   - Find "Connection string" section
   - Select "URI" format
   - Copy the connection string that looks like:
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
     ```

## Step 3: Environment Configuration

1. **Create a `.env` file in your project root:**
   ```env
   # Database (Supabase)
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   
   # NextAuth
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Stripe
   STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
   STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
   STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
   
   # Supabase (optional - for future auth integration)
   NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   ```

2. **Generate a secure NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

## Step 4: Database Setup

1. **Push the schema to your Supabase database:**
   ```bash
   npm run db:push
   ```

2. **Generate Prisma Client:**
   ```bash
   npm run db:generate
   ```

3. **Seed the database with initial data:**
   ```bash
   npm run seed
   ```

## Step 5: Verify Setup

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open Prisma Studio to view your data:**
   ```bash
   npm run db:studio
   ```

3. **Check Supabase Dashboard:**
   - Go to your Supabase project dashboard
   - Click "Table Editor" to see your tables
   - You should see all the tables created by Prisma

## Available Scripts

- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Create and apply migrations
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:seed` - Seed database with initial data
- `npm run seed` - Alias for db:seed

## Database Schema Overview

The database includes the following main models:

### Core Models
- **User** - User accounts and authentication
- **Account** - Business/organization accounts
- **UserAccount** - Many-to-many relationship between users and accounts

### Billing & Plans
- **PricingPlan** - Subscription plans (Starter, Professional, Enterprise)
- **PlanFeature** - Features included in each plan
- **Subscription** - User subscriptions with Stripe integration

### AI & Agents
- **Agent** - AI agents (Navi, Pixie, Paige, etc.)
- **AIEngine** - AI models and their costs
- **ChatThread** - Chat conversations
- **Chat** - Individual chat messages

### Other Models
- **ChattieCoach** - Custom AI coaches
- **KnowledgeBaseQuestion/Response** - Knowledge base system
- **VerificationToken** - Email verification tokens

## Supabase Advantages

✅ **Free Tier Benefits:**
- 500MB database
- 2GB bandwidth
- 50,000 monthly active users
- Real-time subscriptions
- Built-in authentication
- Auto-generated APIs

✅ **No Local Setup:**
- No PostgreSQL installation
- No local database management
- Automatic backups
- Built-in security

✅ **Production Ready:**
- Scalable infrastructure
- Global CDN
- SSL certificates
- Monitoring and logging

## Troubleshooting

### Common Issues

1. **Connection refused:**
   - Check if your DATABASE_URL is correct
   - Verify the password in the connection string
   - Ensure your IP is not blocked (check Supabase dashboard)

2. **Permission denied:**
   - Make sure you're using the correct connection string
   - Check if the project is active in Supabase

3. **Schema not found:**
   - Run `npm run db:push` to create the schema
   - Check if the DATABASE_URL includes the correct database name

### Useful Commands

```bash
# Test database connection
npx prisma db pull

# Reset database (careful - deletes all data)
npx prisma db push --force-reset

# View database in browser
npx prisma studio
```

## Production Deployment

For production, consider:

1. **Environment Variables:**
   - Use production Supabase project
   - Set proper NEXTAUTH_SECRET
   - Configure Stripe production keys

2. **Database Migrations:**
   - Use `npm run db:migrate` for production schema changes
   - Always backup before migrations (Supabase does this automatically)

3. **Security:**
   - Enable Row Level Security (RLS) in Supabase
   - Use environment variables for all secrets
   - Configure proper CORS settings

## Next Steps

After setting up the database:

1. Update your billing pages to use real data from the database
2. Implement user authentication with NextAuth.js or Supabase Auth
3. Set up Stripe integration for payments
4. Create API routes for data management
5. Consider using Supabase Auth for authentication

## Support

If you encounter issues:
1. Check the Supabase documentation: https://supabase.com/docs
2. Check the Prisma documentation: https://www.prisma.io/docs
3. Verify your connection string in the Supabase dashboard
4. Check the console for error messages
5. Ensure all environment variables are set correctly 