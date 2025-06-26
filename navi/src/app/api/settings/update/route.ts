import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { profile, personalInfo, password, twoFA, appearance } = body;

    // TODO: Get actual user ID from session/auth
    // For now, we'll use a hardcoded user ID for testing
    const userId = 1; // This should come from your authentication system

    // Get user to verify current password and check if exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Validate required fields
    if (!profile || !personalInfo) {
      return NextResponse.json(
        { message: 'Profile and personal information are required' },
        { status: 400 }
      );
    }

    // Validate profile data
    if (!profile.fullName || !profile.preferredName) {
      return NextResponse.json(
        { message: 'Full name and preferred name are required' },
        { status: 400 }
      );
    }

    // Validate personal info
    if (!personalInfo.email || !personalInfo.phone || !personalInfo.contactMethod) {
      return NextResponse.json(
        { message: 'Email, phone, and contact method are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(personalInfo.email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password if provided
    if (password) {
      if (!password.currentPassword || !password.newPassword) {
        return NextResponse.json(
          { message: 'Current password and new password are required' },
          { status: 400 }
        );
      }

      if (password.newPassword.length < 8) {
        return NextResponse.json(
          { message: 'New password must be at least 8 characters long' },
          { status: 400 }
        );
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(password.currentPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { message: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(password.newPassword, 12);
      
      // Update user password
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword }
      });
    }

    // Validate 2FA data if provided
    if (twoFA) {
      if (!twoFA.phone || !twoFA.country) {
        return NextResponse.json(
          { message: 'Phone number and country are required for 2FA setup' },
          { status: 400 }
        );
      }
    }

    // Update or create user settings
    const userSettings = await prisma.userSettings.upsert({
      where: { userId },
      update: {
        fullName: profile.fullName,
        preferredName: profile.preferredName,
        phone: personalInfo.phone,
        contactMethod: personalInfo.contactMethod,
        ...(twoFA && {
          twoFAEnabled: twoFA.enabled,
          twoFAPhone: twoFA.phone,
          twoFACountry: twoFA.country,
        }),
        ...(appearance && {
          appearance: appearance
        })
      },
      create: {
        userId,
        fullName: profile.fullName,
        preferredName: profile.preferredName,
        phone: personalInfo.phone,
        contactMethod: personalInfo.contactMethod,
        ...(twoFA && {
          twoFAEnabled: twoFA.enabled,
          twoFAPhone: twoFA.phone,
          twoFACountry: twoFA.country,
        }),
        ...(appearance && {
          appearance: appearance
        })
      }
    });

    // Update user email if it changed
    if (personalInfo.email !== user?.email) {
      await prisma.user.update({
        where: { id: userId },
        data: { email: personalInfo.email }
      });
    }

    return NextResponse.json({
      message: 'Settings updated successfully',
      data: userSettings
    });

  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 