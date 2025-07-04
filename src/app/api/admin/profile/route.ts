
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/authUtils';
import { z } from 'zod';

const profileUpdateSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters.').max(100),
  username: z.string().min(3, 'Username must be at least 3 characters.').max(50)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores.'),
  email: z.string().email('Invalid email address.'),
  avatarUrl: z.string().url().optional().or(z.literal('')),
});

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decodedToken = verifyToken(token);
    if (!decodedToken || decodedToken.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const userId = decodedToken.userId as number;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, fullName: true, username: true, email: true, role: true, avatarUrl: true },
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decodedToken = verifyToken(token);
    if (!decodedToken || decodedToken.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const userId = decodedToken.userId as number;

    const body = await request.json();
    const validation = profileUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', issues: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { fullName, username, email, avatarUrl } = validation.data;

    const existingUserByUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUserByUsername && existingUserByUsername.id !== userId) {
      return NextResponse.json({ error: 'Username already taken.' }, { status: 409 });
    }
    const existingUserByEmail = await prisma.user.findUnique({ where: { email } });
    if (existingUserByEmail && existingUserByEmail.id !== userId) {
      return NextResponse.json({ error: 'Email already taken.' }, { status: 409 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { fullName, username, email, avatarUrl },
      select: { id: true, fullName: true, username: true, email: true, role: true, avatarUrl: true }
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
