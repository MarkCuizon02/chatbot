import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log('🔧 Account Diagnostic: Checking accounts...');
    
    // Get all accounts
    const accounts = await prisma.account.findMany({
      include: {
        users: {
          include: {
            user: true
          }
        }
      }
    });

    // Get all users
    const users = await prisma.user.findMany({
      include: {
        accounts: {
          include: {
            account: true
          }
        }
      }
    });

    console.log('📋 Found accounts:', accounts.length);
    console.log('📋 Found users:', users.length);

    return NextResponse.json({
      success: true,
      data: {
        accounts: accounts,
        users: users,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error in account diagnostic:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'Account diagnostic failed', 
        details: errorMessage 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
