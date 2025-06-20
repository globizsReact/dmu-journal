
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/authUtils';

export async function POST(request: NextRequest) {
  console.log('Signup API: Received request');
  try {
    const body = await request.json();
    console.log('Signup API: Request body:', body);
    const { fullName, username, email, password } = body;

    if (!fullName || !username || !email || !password) {
      console.log('Signup API: Missing fields');
      return NextResponse.json(
        { error: 'All fields (fullName, username, email, password) are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      console.log('Signup API: Password too short');
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.log('Signup API: Invalid email format');
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    try {
      console.log(`Signup API: Checking for existing user with username: ${username} or email: ${email}`);
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { username: username },
            { email: email },
          ],
        },
      });

      if (existingUser) {
        console.log('Signup API: Username or email already exists:', existingUser);
        return NextResponse.json(
          { error: 'Username or email already exists.' },
          { status: 409 } // 409 Conflict
        );
      }
      console.log('Signup API: No existing user found. Proceeding to hash password.');

      const hashedPassword = await hashPassword(password);
      console.log('Signup API: Password hashed.');

      console.log('Signup API: Creating new user in database...');
      const newUser = await prisma.user.create({
        data: {
          fullName,
          username,
          email,
          password_hash: hashedPassword,
          role: 'author', // Default role
        },
      });
      console.log('Signup API: New user created successfully:', newUser);

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
    } catch (dbError: any) {
      console.error('Signup API: Database error during signup:', dbError);
      if (dbError.code === 'P2002') { // Prisma unique constraint violation
         console.log('Signup API: Prisma unique constraint violation (P2002).');
         return NextResponse.json(
          { error: 'Username or email already exists.' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'An internal server error occurred during database operation.', details: dbError.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Signup API: General error:', error);
    if (error instanceof SyntaxError) {
        console.log('Signup API: Invalid request body (SyntaxError).');
        return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred during sign up.', details: error.message },
      { status: 500 }
    );
  }
}
