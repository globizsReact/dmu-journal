
import { type NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { comparePassword, generateToken } from '@/lib/authUtils';
import type { RowDataPacket } from 'mysql2';

interface UserRecord extends RowDataPacket {
  id: number;
  fullName: string;
  username: string;
  email: string;
  password_hash: string;
  role: string;
}

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

    let connection;
    try {
      connection = await pool.getConnection();
      const [rows] = await connection.execute<UserRecord[]>(
        'SELECT id, fullName, username, email, password_hash, role FROM users WHERE username = ? OR email = ?',
        [username, username]
      );

      if (rows.length === 0) {
        return NextResponse.json(
          { error: 'Invalid username/email or password' },
          { status: 401 }
        );
      }

      const user = rows[0];
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
        role: user.role 
      });

      // Return token and user info (excluding password hash)
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
        { error: 'An internal server error occurred.' },
        { status: 500 }
      );
    } finally {
      if (connection) connection.release();
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
  }
}
