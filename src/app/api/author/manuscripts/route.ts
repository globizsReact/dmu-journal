
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/authUtils';

export async function GET(request: NextRequest) {
  console.log('Author Manuscripts API: Received GET request');
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      console.log('Author Manuscripts API: Missing token');
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken || !decodedToken.userId) {
      console.log('Author Manuscripts API: Invalid token');
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }
    const userId = decodedToken.userId as number;
    console.log(`Author Manuscripts API: Authenticated user ID: ${userId}`);

    const manuscripts = await prisma.manuscript.findMany({
      where: {
        submittedById: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      // Select specific fields if needed, or include related data
      // For now, fetching all direct fields of the manuscript
    });
    console.log(`Author Manuscripts API: Found ${manuscripts.length} manuscripts for user ID ${userId}`);

    return NextResponse.json(manuscripts, { status: 200 });

  } catch (error: any) {
    console.error('Author Manuscripts API: General error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching manuscripts.', details: error.message },
      { status: 500 }
    );
  }
}
