
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/authUtils';

export async function GET(request: NextRequest) {
  console.log('Admin All Users API: Received GET request');
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      console.log('Admin All Users API: Missing token.');
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }

    const decodedToken = verifyToken(token);
    
    if (!decodedToken || !decodedToken.userId) {
      console.log('Admin All Users API: Invalid token or missing userId.');
      return NextResponse.json({ error: 'Unauthorized: Invalid or expired token' }, { status: 401 });
    }

    if (decodedToken.role !== 'admin') {
      console.log(`Admin All Users API: User role '${decodedToken.role}' not authorized. Admin access required.`);
      return NextResponse.json({ error: 'Forbidden: Insufficient privileges. Admin access required.' }, { status: 403 });
    }
    
    const adminId = decodedToken.userId as number; 
    console.log(`Admin All Users API: Authenticated admin user ID: ${adminId}`);

    const users = await prisma.user.findMany({
      select: { // Select only necessary fields, exclude password_hash
        id: true,
        fullName: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // Do NOT include password_hash
      },
      orderBy: {
        createdAt: 'desc', 
      },
    });
    console.log(`Admin All Users API: Found ${users.length} users.`);

    return NextResponse.json(users, { status: 200 });

  } catch (error: any) {
    console.error('Admin All Users API: General error:', error);
    if (error.code) { 
        console.error(`Admin All Users API: Prisma error code: ${error.code}, Meta: ${JSON.stringify(error.meta)}`);
        return NextResponse.json(
            { error: 'Database error while fetching users.', prismaCode: error.code, details: error.message },
            { status: 500 }
        );
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching users.', details: error.message },
      { status: 500 }
    );
  }
}
