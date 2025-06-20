
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken, comparePassword, hashPassword } from '@/lib/authUtils';
import { z } from 'zod';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required.'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters.'),
});

export async function POST(request: NextRequest) {
  console.log('Change Password API: Received POST request');
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      console.log('Change Password API: Missing token');
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken || !decodedToken.userId) {
      console.log('Change Password API: Invalid token');
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }
    const userId = decodedToken.userId as number;
    console.log(`Change Password API: Authenticated user ID: ${userId}`);

    const body = await request.json();
    const validation = changePasswordSchema.safeParse(body);

    if (!validation.success) {
      console.log('Change Password API: Validation failed', validation.error.flatten().fieldErrors);
      return NextResponse.json({ error: 'Invalid input data.', issues: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { currentPassword, newPassword } = validation.data;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.log(`Change Password API: User not found for ID: ${userId}`);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isCurrentPasswordValid = await comparePassword(currentPassword, user.password_hash);
    if (!isCurrentPasswordValid) {
      console.log('Change Password API: Invalid current password');
      return NextResponse.json({ error: 'Invalid current password.' }, { status: 400 });
    }

    const newPasswordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password_hash: newPasswordHash },
    });

    console.log('Change Password API: Password updated successfully for user ID:', userId);
    return NextResponse.json({ message: 'Password updated successfully.' }, { status: 200 });

  } catch (error: any) {
    console.error('Change Password API: General error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while changing password.', details: error.message },
      { status: 500 }
    );
  }
}
