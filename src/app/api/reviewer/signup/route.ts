
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/authUtils';

export async function POST(request: NextRequest) {
  console.log('Reviewer Signup API: Received request');
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
          role: 'reviewer_inactive', // <-- Key change here
        },
      });

      return NextResponse.json(
        {
          message: 'Reviewer account created successfully. It is pending admin approval.',
          user: {
            id: newUser.id,
            fullName: newUser.fullName,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
          },
        },
        { status: 201 }
      );
    } catch (dbError: any) {
      console.error('Reviewer Signup API: Database error:', dbError);
      if (dbError.code === 'P2002') {
         return NextResponse.json(
          { error: 'Username or email already exists.' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'An internal server error occurred.', details: dbError.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Reviewer Signup API: General error:', error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred.', details: error.message },
      { status: 500 }
    );
  }
}
