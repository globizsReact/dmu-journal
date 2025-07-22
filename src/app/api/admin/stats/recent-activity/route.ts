
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
    if (!decodedToken || decodedToken.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      where: { role: { not: 'admin' } }, // Exclude admin registrations from the feed
      select: {
        id: true,
        fullName: true,
        username: true,
        createdAt: true,
        avatarUrl: true,
      },
    });

    const recentManuscripts = await prisma.manuscript.findMany({
      take: 5,
      orderBy: { submittedAt: 'desc' },
      select: {
        id: true,
        articleTitle: true,
        submittedAt: true,
        submittedBy: {
          select: {
            fullName: true,
            avatarUrl: true
          }
        }
      },
    });

    const combinedActivities = [
      ...recentUsers.map(user => ({
        id: `user-${user.id}`,
        type: 'NEW_USER' as const,
        text: `<strong>${user.fullName || user.username}</strong> registered as a new user.`,
        timestamp: user.createdAt.toISOString(),
        user: {
            fullName: user.fullName,
            avatarUrl: user.avatarUrl
        }
      })),
      ...recentManuscripts.map(ms => ({
        id: `ms-${ms.id}`,
        type: 'NEW_MANUSCRIPT' as const,
        text: `<strong>${ms.submittedBy?.fullName || 'A user'}</strong> submitted a new manuscript: <em>"${ms.articleTitle}"</em>.`,
        timestamp: ms.submittedAt.toISOString(),
        user: ms.submittedBy
      })),
    ];

    // Sort combined activities by timestamp desc and take the latest 5
    const sortedActivities = combinedActivities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);

    return NextResponse.json(sortedActivities, { status: 200 });

  } catch (error: any) {
    console.error('Admin Stats API (Recent Activity): General error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching recent activity.', details: error.message },
      { status: 500 }
    );
  }
}
