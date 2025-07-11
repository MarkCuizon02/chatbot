import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
  console.log('🔍 Checking database data...');
  
  // Check users
  const users = await prisma.user.findMany({
    include: {
      accounts: {
        include: {
          account: true
        }
      }
    }
  });
  console.log('👥 Users found:', users.length);
  users.forEach(user => {
    console.log(`  - User ID: ${user.id}, Email: ${user.email}, Accounts: ${user.accounts.length}`);
    user.accounts.forEach(account => {
      console.log(`    - Account ID: ${account.account.id}, Name: ${account.account.name}`);
    });
  });

  // Check accounts
  const accounts = await prisma.account.findMany();
  console.log('🏢 Accounts found:', accounts.length);
  accounts.forEach(account => {
    console.log(`  - Account ID: ${account.id}, Name: ${account.name}`);
  });

  await prisma.$disconnect();
}

checkData().catch(console.error);
