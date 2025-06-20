
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

    if (!prisma) {
      console.error('Admin All Users API: Prisma client is not available. This is a critical configuration error.');
      return NextResponse.json({ error: 'Database client is not configured.', details: 'Prisma instance is undefined.' }, { status: 500 });
    }

    const users = await prisma.user.findMany({
      select: { 
        id: true,
        fullName: true,
        username: true,
        email: true,
        role: true,
        createdAt: true, // Keep this as createdAt for the select, Prisma maps this
        updatedAt: true, // Keep this as updatedAt for the select, Prisma maps this
      },
      orderBy: {
        created_at: 'desc', // Corrected field name for orderBy
      },
    });
    console.log(`Admin All Users API: Found ${users.length} users.`);

    return NextResponse.json(users, { status: 200 });

  } catch (error: unknown) { 
    let responseErrorMessage = 'An unexpected error occurred while fetching users.';
    let responseErrorDetails = 'No specific details available.';
    const statusCode = 500;

    console.error('Admin All Users API: Full error object caught:', error); 

    if (error instanceof Error) {
      responseErrorDetails = error.message; 

      const potentialPrismaError = error as any;
      if (potentialPrismaError.code) {
        console.error(`Admin All Users API: Prisma error encountered. Code: ${potentialPrismaError.code}, Meta: ${JSON.stringify(potentialPrismaError.meta)}`);
        responseErrorMessage = 'Database error while fetching users.';
      } else {
        console.error(`Admin All Users API: Non-Prisma error of type ${error.name}: ${error.message}`);
        if (error.stack) {
            console.error('Admin All Users API: Stack trace:', error.stack);
        }
      }
    } else {
      console.error('Admin All Users API: Caught an error that is not an instance of Error. Value:', error);
      try {
        responseErrorDetails = JSON.stringify(error);
      } catch {
        responseErrorDetails = String(error);
      }
    }

    return NextResponse.json(
      { error: responseErrorMessage, details: responseErrorDetails },
      { status: statusCode }
    );
  }
}
