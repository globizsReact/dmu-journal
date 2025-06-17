
import { type NextRequest, NextResponse } from 'next/server';

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

    // Basic validation examples (you'd want more robust validation)
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Check if the username or email already exists in the database.
    // 2. Hash the password securely (e.g., using bcrypt).
    // 3. Store the new user in your database.

    console.log('Mock Sign Up Attempt:');
    console.log('Full Name:', fullName);
    console.log('Username:', username);
    console.log('Email:', email);
    // console.log('Password:', password); // Avoid logging passwords, even in mock scenarios if possible

    // Simulate successful user creation
    return NextResponse.json(
      {
        message: 'User account created successfully (mock).',
        user: {
          fullName,
          username,
          email,
        },
      },
      { status: 201 } // 201 Created
    );

  } catch (error) {
    console.error('Signup API error:', error);
    if (error instanceof SyntaxError) { // Handle JSON parsing errors
        return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred during sign up.' },
      { status: 500 }
    );
  }
}
