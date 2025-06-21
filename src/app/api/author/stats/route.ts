
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
    if (!decodedToken || !decodedToken.userId) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }
    const userId = decodedToken.userId as number;

    const submittedCount = await prisma.manuscript.count({
      where: { submittedById: userId, status: 'Submitted' },
    });
    const inReviewCount = await prisma.manuscript.count({
      where: { submittedById: userId, status: 'In Review' },
    });
    const acceptedCount = await prisma.manuscript.count({
      where: { submittedById: userId, status: 'Accepted' },
    });
    const publishedCount = await prisma.manuscript.count({
        where: { submittedById: userId, status: 'Published' },
    });
    const suspendedCount = await prisma.manuscript.count({
        where: { submittedById: userId, status: 'Suspended' },
    });

    const stats = {
      submitted: submittedCount,
      inReview: inReviewCount,
      accepted: acceptedCount,
      published: publishedCount,
      suspended: suspendedCount,
    };

    return NextResponse.json(stats, { status: 200 });

  } catch (error: any) {
    console.error('Author Stats API: General error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching statistics.', details: error.message },
      { status: 500 }
    );
  }
}
