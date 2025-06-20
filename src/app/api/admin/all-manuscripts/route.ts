
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/authUtils';

export async function GET(request: NextRequest) {
  console.log('Admin All Manuscripts API: Received GET request');
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      console.log('Admin All Manuscripts API: Missing token.');
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }

    const decodedToken = verifyToken(token);
    
    if (!decodedToken || !decodedToken.userId) {
      console.log('Admin All Manuscripts API: Invalid token or missing userId.');
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    if (decodedToken.role !== 'admin' && decodedToken.role !== 'reviewer') {
      console.log(`Admin All Manuscripts API: User role '${decodedToken.role}' not authorized.`);
      return NextResponse.json({ error: 'Forbidden: Insufficient privileges' }, { status: 403 });
    }
    
    const userId = decodedToken.userId as number;
    console.log(`Admin All Manuscripts API: Authenticated user ID: ${userId}, Role: ${decodedToken.role}`);

    const manuscripts = await prisma.manuscript.findMany({
      include: {
        submittedBy: { // Include author details
          select: {
            fullName: true,
            email: true,
          }
        }
      },
      orderBy: {
        submittedAt: 'desc', 
      },
    });
    console.log(`Admin All Manuscripts API: Found ${manuscripts.length} manuscripts.`);

    return NextResponse.json(manuscripts, { status: 200 });

  } catch (error: any) {
    console.error('Admin All Manuscripts API: General error:', error);
    if (error.code) { 
        console.error(`Admin All Manuscripts API: Prisma error code: ${error.code}, Meta: ${JSON.stringify(error.meta)}`);
        return NextResponse.json(
            { error: 'Database error while fetching manuscripts.', prismaCode: error.code, details: error.message },
            { status: 500 }
        );
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching manuscripts.', details: error.message },
      { status: 500 }
    );
  }
}
