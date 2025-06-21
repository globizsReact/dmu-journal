
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/authUtils';
import { hashPassword } from '@/lib/authUtils';
import { z } from 'zod';

const createUserSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters.'),
  username: z.string().min(3, 'Username must be at least 3 characters.')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores.'),
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  role: z.enum(['admin', 'author', 'reviewer']),
});

export async function GET(request: NextRequest) {
  console.log('Admin All Users API: Received GET request');
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      console.log('Admin All Users API: Missing token.');
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken || decodedToken.role !== 'admin') {
      console.log('Admin All Users API: Invalid token or unauthorized role.');
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    if (!prisma) {
      console.error('Admin All Users API: Prisma client is not available.');
      return NextResponse.json({ error: 'Database client is not configured.' }, { status: 500 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        username: true,
        email: true,
        role: true,
      },
      skip: skip,
      take: limit,
      orderBy: {
        id: 'asc', 
      },
    });

    const totalCount = await prisma.user.count();
    const totalPages = Math.ceil(totalCount / limit);

    console.log(`Admin All Users API: Found ${users.length} users for page ${page}, total ${totalCount}.`);
    return NextResponse.json({ users, totalCount, totalPages, currentPage: page }, { status: 200 });

  } catch (error: unknown) {
    let responseErrorMessage = 'An unexpected error occurred while fetching users.';
    let responseErrorDetails = 'No specific details available.';
    console.error('Admin All Users API: Full error object caught:', error);
    if (error instanceof Error) {
      responseErrorDetails = error.message;
      if ((error as any).code) { // Prisma errors often have a code
        console.error('Admin All Users API: Prisma Error Code:', (error as any).code);
        responseErrorDetails += ` (Prisma Code: ${(error as any).code})`;
      }
      if (error.stack) {
        console.error('Admin All Users API: Stack Trace:', error.stack);
      }
    }
    return NextResponse.json(
      { error: responseErrorMessage, details: responseErrorDetails },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log('Admin Add User API: Received POST request');
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }
    const decodedToken = verifyToken(token);
    if (!decodedToken || decodedToken.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const validation = createUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input data.', issues: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { fullName, username, email, password, role } = validation.data;

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    if (existingUser) {
      return NextResponse.json({ error: 'Username or email already exists.' }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    
    // When an admin creates a reviewer, set their role to 'reviewer_inactive'
    // so they must be approved before they can log in.
    const finalRole = role === 'reviewer' ? 'reviewer_inactive' : role;

    const newUser = await prisma.user.create({
      data: {
        fullName,
        username,
        email,
        password_hash: hashedPassword,
        role: finalRole,
      },
      select: { id: true, fullName: true, username: true, email: true, role: true }
    });

    return NextResponse.json(newUser, { status: 201 });

  } catch (error: any) {
    console.error('Admin Add User API: General error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while creating the user.', details: error.message },
      { status: 500 }
    );
  }
}
    
