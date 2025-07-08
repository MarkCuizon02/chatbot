const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAccounts() {
  try {
    const accounts = await prisma.account.findMany();
    console.log('Available accounts:');
    accounts.forEach(account => {
      console.log(`- ID: ${account.id}, Name: ${account.name}, Credits: ${account.credits}`);
    });
    
    if (accounts.length === 0) {
      console.log('No accounts found. Creating a default account...');
      
      const newAccount = await prisma.account.create({
        data: {
          name: 'Default Account',
          description: 'Default account for testing',
          type: 'personal',
          credits: 1000,
          setup: true
        }
      });
      
      console.log(`Created account: ID ${newAccount.id}, Name: ${newAccount.name}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAccounts();
