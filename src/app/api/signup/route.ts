
import { type NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hashPassword } from '@/lib/authUtils';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

interface UserCheckResult extends RowDataPacket {
  count: number;
}

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
    // Basic email validation (more robust validation can be added)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }


    let connection;
    try {
      connection = await pool.getConnection();

      // Check if username or email already exists
      const [existingUsers] = await connection.execute<UserCheckResult[]>(
        'SELECT COUNT(*) as count FROM users WHERE username = ? OR email = ?',
        [username, email]
      );

      if (existingUsers[0].count > 0) {
        return NextResponse.json(
          { error: 'Username or email already exists.' },
          { status: 409 } // 409 Conflict
        );
      }

      const hashedPassword = await hashPassword(password);

      const [result] = await connection.execute<ResultSetHeader>(
        'INSERT INTO users (fullName, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
        [fullName, username, email, hashedPassword, 'author'] // Default role to 'author'
      );

      if (result.affectedRows === 1) {
        return NextResponse.json(
          {
            message: 'User account created successfully.',
            user: {
              id: result.insertId,
              fullName,
              username,
              email,
              role: 'author',
            },
          },
          { status: 201 } // 201 Created
        );
      } else {
        console.error('User creation failed, affectedRows was not 1.');
        return NextResponse.json(
          { error: 'Failed to create user account.' },
          { status: 500 }
        );
      }
    } catch (dbError) {
      console.error('Database error during signup:', dbError);
      return NextResponse.json(
        { error: 'An internal server error occurred.' },
        { status: 500 }
      );
    } finally {
      if (connection) connection.release();
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
  }
}
