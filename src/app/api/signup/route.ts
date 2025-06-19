
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/authUtils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, username, email, password } = body;

    if (!fullName || !username || !email || !password) {
      return NextResponse.json(
        { error: 'All fields (fullName, username, email, password) are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    try {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { username: username },
            { email: email },
          ],
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Username or email already exists.' },
          { status: 409 } // 409 Conflict
        );
      }

      const hashedPassword = await hashPassword(password);

      const newUser = await prisma.user.create({
        data: {
          fullName,
          username,
          email,
          password_hash: hashedPassword,
          role: 'author', // Default role to 'author'
        },
      });

      return NextResponse.json(
        {
          message: 'User account created successfully.',
          user: {
            id: newUser.id,
            fullName: newUser.fullName,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
          },
        },
        { status: 201 } // 201 Created
      );
    } catch (dbError) {
      console.error('Database error during signup:', dbError);
      // Check for Prisma specific error codes if needed, e.g., P2002 for unique constraint violation
      if ((dbError as any).code === 'P2002') {
         return NextResponse.json(
          { error: 'Username or email already exists.' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'An internal server error occurred during database operation.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Signup API error:', error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred during sign up.' },
      { status: 500 }
    );
  } finally {
    // Prisma manages connections automatically, so explicit disconnect is not usually needed here.
    // await prisma.$disconnect(); // Generally not recommended per request in serverless environments
  }
}
