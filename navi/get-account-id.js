const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getAccountId() {
  try {
    const account = await prisma.account.findFirst();
    console.log('Account ID:', account?.id);
    console.log('Account Name:', account?.name);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getAccountId(); 