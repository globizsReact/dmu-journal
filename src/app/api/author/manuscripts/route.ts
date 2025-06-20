
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/authUtils';

export async function GET(request: NextRequest) {
  console.log('Author Manuscripts API: Received GET request');
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      console.log('Author Manuscripts API: Missing token in Authorization header.');
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }
    // console.log('Author Manuscripts API: Token received from header:', token.substring(0, 20) + "...");

    const decodedToken = verifyToken(token);
    
    if (!decodedToken) {
      // verifyToken already logs the specific error (e.g. expired, invalid signature)
      console.log('Author Manuscripts API: Token verification failed (decodedToken is null). See previous authUtils log for details.');
      return NextResponse.json({ error: 'Unauthorized: Invalid token (verification failed)' }, { status: 401 });
    }
    
    if (!decodedToken.userId) {
      console.log('Author Manuscripts API: Token decoded, but userId is missing.', decodedToken);
      return NextResponse.json({ error: 'Unauthorized: Invalid token (userId missing)' }, { status: 401 });
    }

    const userId = decodedToken.userId as number;
    console.log(`Author Manuscripts API: Authenticated user ID: ${userId}`);

    const manuscripts = await prisma.manuscript.findMany({
      where: {
        submittedById: userId,
      },
      orderBy: {
        submittedAt: 'desc', 
      },
    });
    console.log(`Author Manuscripts API: Found ${manuscripts.length} manuscripts for user ID ${userId}`);

    return NextResponse.json(manuscripts, { status: 200 });

  } catch (error: any) {
    console.error('Author Manuscripts API: General error:', error);
    if (error.code) { 
        console.error(`Author Manuscripts API: Prisma error code: ${error.code}, Meta: ${JSON.stringify(error.meta)}`);
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
