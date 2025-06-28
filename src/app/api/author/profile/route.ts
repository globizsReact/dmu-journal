
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/authUtils';
import { z } from 'zod';

// Zod schema for validating profile update data
const profileUpdateSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters.').max(100),
  username: z.string().min(3, 'Username must be at least 3 characters.').max(50)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores.'),
  email: z.string().email('Invalid email address.'),
  avatarUrl: z.string().url().optional().or(z.literal('')),
});

export async function GET(request: NextRequest) {
  console.log('Author Profile API: Received GET request');
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      console.log('Author Profile API (GET): Missing token');
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken || !decodedToken.userId) {
      console.log('Author Profile API (GET): Invalid token');
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }
    const userId = decodedToken.userId as number;
    console.log(`Author Profile API (GET): Authenticated user ID: ${userId}`);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        username: true,
        email: true,
        role: true,
        avatarUrl: true,
      },
    });

    if (!user) {
      console.log(`Author Profile API (GET): User not found for ID: ${userId}`);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('Author Profile API (GET): User profile fetched successfully:', user);
    return NextResponse.json(user, { status: 200 });

  } catch (error: any) {
    console.error('Author Profile API (GET): General error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching profile data.', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  console.log('Author Profile API: Received PUT request');
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      console.log('Author Profile API (PUT): Missing token');
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken || !decodedToken.userId) {
      console.log('Author Profile API (PUT): Invalid token');
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }
    const userId = decodedToken.userId as number;
    console.log(`Author Profile API (PUT): Authenticated user ID: ${userId}`);

    const body = await request.json();
    const validation = profileUpdateSchema.safeParse(body);

    if (!validation.success) {
      console.log('Author Profile API (PUT): Validation failed', validation.error.flatten().fieldErrors);
      return NextResponse.json({ error: 'Invalid input data.', issues: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { fullName, username, email, avatarUrl } = validation.data;

    // Check for username/email conflicts with OTHER users
    const existingUserByUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUserByUsername && existingUserByUsername.id !== userId) {
      console.log(`Author Profile API (PUT): Username "${username}" already taken by another user.`);
      return NextResponse.json({ error: 'Username already taken.' }, { status: 409 });
    }

    const existingUserByEmail = await prisma.user.findUnique({ where: { email } });
    if (existingUserByEmail && existingUserByEmail.id !== userId) {
      console.log(`Author Profile API (PUT): Email "${email}" already taken by another user.`);
      return NextResponse.json({ error: 'Email already taken.' }, { status: 409 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName,
        username,
        email,
        avatarUrl,
      },
      select: { // Only return non-sensitive fields
        id: true,
        fullName: true,
        username: true,
        email: true,
        role: true,
        avatarUrl: true,
      }
    });

    console.log('Author Profile API (PUT): User profile updated successfully:', updatedUser);
    return NextResponse.json(updatedUser, { status: 200 });

  } catch (error: any) {
    console.error('Author Profile API (PUT): General error:', error);
     if (error.code === 'P2002') { // Prisma unique constraint violation
        console.log('Author Profile API (PUT): Prisma unique constraint violation (P2002).');
        // This should ideally be caught by the checks above, but as a fallback:
        let field = 'unknown';
        if (error.meta?.target?.includes('username')) field = 'username';
        if (error.meta?.target?.includes('email')) field = 'email';
        return NextResponse.json(
         { error: `The ${field} is already in use.` },
         { status: 409 }
       );
     }
    return NextResponse.json(
      { error: 'An unexpected error occurred while updating profile data.', details: error.message },
      { status: 500 }
    );
  }
}
