
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/authUtils';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken || decodedToken.role !== 'reviewer') {
      return NextResponse.json({ error: 'Forbidden: Reviewer access required' }, { status: 403 });
    }

    // Return all manuscripts for the reviewer to manage
    const manuscripts = await prisma.manuscript.findMany({
      orderBy: {
        submittedAt: 'desc',
      },
    });

    return NextResponse.json(manuscripts, { status: 200 });

  } catch (error: any) {
    console.error('Reviewer Manuscripts API: General error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching manuscripts.', details: error.message },
      { status: 500 }
    );
  }
}
