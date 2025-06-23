
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

    const totalManuscripts = await prisma.manuscript.count();

    const pendingReviews = await prisma.manuscript.count({
      where: {
        status: { in: ['Submitted', 'In Review'] }
      },
    });

    const completedReviews = await prisma.manuscript.count({
        where: {
          status: { in: ['Accepted', 'Published', 'Suspended'] }
        },
    });


    const stats = {
      totalManuscripts,
      pendingReviews,
      completedReviews,
    };

    return NextResponse.json(stats, { status: 200 });

  } catch (error: any) {
    console.error('Reviewer Stats API: General error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching statistics.', details: error.message },
      { status: 500 }
    );
  }
}
