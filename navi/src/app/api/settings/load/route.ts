import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // TODO: Get actual user ID from session/auth
    // For now, we'll use a hardcoded user ID for testing
    const userId = 1; // This should come from your authentication system

    // Get user and their settings
    const [user, userSettings] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstname: true,
          lastname: true,
          username: true
        }
      }),
      prisma.userSettings.findUnique({
        where: { userId }
      })
    ]);

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Return formatted settings data
    const settings = {
      profile: {
        fullName: userSettings?.fullName || `${user.firstname || ''} ${user.lastname || ''}`.trim() || user.username,
        preferredName: userSettings?.preferredName || user.firstname || user.username
      },
      personalInfo: {
        email: user.email,
        phone: userSettings?.phone || '',
        contactMethod: userSettings?.contactMethod || 'Email'
      },
      twoFA: {
        enabled: userSettings?.twoFAEnabled || false,
        phone: userSettings?.twoFAPhone || '',
        country: userSettings?.twoFACountry || ''
      },
      appearance: userSettings?.appearance || 'system'
    };

    return NextResponse.json({
      message: 'Settings loaded successfully',
      data: settings
    });

  } catch (error) {
    console.error('Error loading settings:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 