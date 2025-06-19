
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePassword, generateToken } from '@/lib/authUtils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body; // Username can be actual username or email

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username/email and password are required' },
        { status: 400 }
      );
    }

    try {
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { username: username },
            { email: username },
          ],
        },
      });

      if (!user) {
        return NextResponse.json(
          { error: 'Invalid username/email or password' },
          { status: 401 }
        );
      }

      const isPasswordValid = await comparePassword(password, user.password_hash);

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Invalid username/email or password' },
          { status: 401 }
        );
      }

      const token = generateToken({
        userId: user.id,
        username: user.username,
        role: user.role,
      });

      return NextResponse.json(
        {
          message: 'Login successful',
          token,
          user: {
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            role: user.role,
          },
        },
        { status: 200 }
      );
    } catch (dbError) {
      console.error('Database error during login:', dbError);
      return NextResponse.json(
        { error: 'An internal server error occurred during database operation.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Login API error:', error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred during login.' },
      { status: 500 }
    );
  } finally {
    // Prisma manages connections automatically.
    // await prisma.$disconnect();
  }
}
