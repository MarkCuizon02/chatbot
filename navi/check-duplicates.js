const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDuplicates() {
  try {
    const userAccounts = await prisma.userAccount.findMany();
    console.log('Current UserAccount entries:', userAccounts.length);
    
    // Check for duplicates
    const duplicates = {};
    userAccounts.forEach(ua => {
      const key = `${ua.userId}-${ua.accountId}`;
      if (duplicates[key]) {
        duplicates[key].push(ua);
      } else {
        duplicates[key] = [ua];
      }
    });
    
    const dupsFound = Object.keys(duplicates).filter(key => duplicates[key].length > 1);
    
    if (dupsFound.length > 0) {
      console.log('Duplicates found:', dupsFound.length);
      for (const key of dupsFound) {
        console.log(`Key ${key}:`, duplicates[key]);
      }
    } else {
      console.log('No duplicates found. Safe to add unique constraint.');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDuplicates();
