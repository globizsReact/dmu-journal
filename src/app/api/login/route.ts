
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePassword, generateToken } from '@/lib/authUtils';

export async function POST(request: NextRequest) {
  console.log('Login API: Received request');
  try {
    const body = await request.json();
    console.log('Login API: Request body:', body);
    const { username, password } = body; // Username can be actual username or email

    if (!username || !password) {
      console.log('Login API: Missing username/email or password');
      return NextResponse.json(
        { error: 'Username/email and password are required' },
        { status: 400 }
      );
    }

    try {
      console.log(`Login API: Attempting to find user by username/email: ${username}`);
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { username: username },
            { email: username },
          ],
        },
      });

      if (!user) {
        console.log('Login API: User not found');
        return NextResponse.json(
          { error: 'Invalid username/email or password' },
          { status: 401 }
        );
      }
      console.log('Login API: User found:', { id: user.id, username: user.username, email: user.email, role: user.role });

      console.log('Login API: Comparing password...');
      const isPasswordValid = await comparePassword(password, user.password_hash);

      if (!isPasswordValid) {
        console.log('Login API: Invalid password');
        return NextResponse.json(
          { error: 'Invalid username/email or password' },
          { status: 401 }
        );
      }
      console.log('Login API: Password is valid.');

      console.log('Login API: Generating token...');
      const token = generateToken({
        userId: user.id,
        username: user.username,
        role: user.role, // Ensure role is included in the token
      });
      console.log('Login API: Token generated.');

      return NextResponse.json(
        {
          message: 'Login successful',
          token,
          user: {
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            role: user.role, // Ensure role is sent back to client
          },
        },
        { status: 200 }
      );
    } catch (dbError: any) {
      console.error('Login API: Database error during login:', dbError);
      return NextResponse.json(
        { error: 'An internal server error occurred during database operation.', details: dbError.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Login API: General error:', error);
    if (error instanceof SyntaxError) {
        console.log('Login API: Invalid request body (SyntaxError).');
        return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred during login.', details: error.message },
      { status: 500 }
    );
  }
}
