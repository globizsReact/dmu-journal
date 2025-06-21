
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

    // In a real-world scenario, you would fetch manuscripts specifically assigned to this reviewer.
    // As a placeholder, we are fetching all manuscripts that are in a reviewable state.
    const manuscripts = await prisma.manuscript.findMany({
      where: {
        OR: [
          { status: 'Submitted' },
          { status: 'In Review' },
        ],
      },
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
