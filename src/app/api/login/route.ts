
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // In a real application, you would validate credentials against a database
    // and generate a real JWT or session token.
    if (username === 'author' && password === 'password') {
      // Simulate successful login
      return NextResponse.json(
        { 
          message: 'Login successful', 
          token: 'mock-jwt-token-for-author', // This is a mock token
          user: {
            username: 'author',
            name: 'Dr. Santosh Sharma', // Example name
            role: 'author'
          }
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
