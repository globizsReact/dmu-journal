
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePassword, generateToken } from '@/lib/authUtils';

export async function POST(request: NextRequest) {
  console.log('Login API: Received request');
  try {
    const body = await request.json();
    console.log('Login API: Request body:', body);
    const { username, password, role: expectedRole } = body; // Username can be actual username or email

    if (!username || !password || !expectedRole) {
      console.log('Login API: Missing username, password, or expected role');
      return NextResponse.json(
        { error: 'Username/email, password, and role are required' },
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

      // Block admins from using the general login form
      if (user.role === 'admin') {
        console.log('Login API: Admin login attempt blocked from general login form.');
        return NextResponse.json(
          { error: 'Admin accounts must use the designated admin login page.' },
          { status: 403 }
        );
      }
      
      // Check for inactive (unverified) reviewer trying to log in
      if (expectedRole === 'reviewer' && user.role === 'reviewer_inactive') {
        console.log(`Login API: Inactive reviewer login attempt for: ${username}`);
        return NextResponse.json(
          { error: 'Your reviewer account is pending approval by an administrator.' },
          { status: 403 } // 403 Forbidden is appropriate
        );
      }

      // Check if user's actual role matches the expected role from the tab
      if (user.role !== expectedRole) {
          console.log(`Login API: Role mismatch. User role: '${user.role}', expected: '${expectedRole}'.`);
          const userRoleCapitalized = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'a different role';
          return NextResponse.json(
              { error: `This account is a ${userRoleCapitalized} account. Please select the correct tab to sign in.` },
              { status: 403 } // 403 Forbidden is appropriate here
          );
      }

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
            avatarUrl: user.avatarUrl,
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
