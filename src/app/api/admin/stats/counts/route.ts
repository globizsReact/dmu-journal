
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/authUtils';

export async function GET(request: NextRequest) {
  console.log('Admin Stats API: Received GET request for counts');
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      console.log('Admin Stats API: Missing token.');
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken || decodedToken.role !== 'admin') {
      console.log('Admin Stats API: Invalid token or unauthorized role.');
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }
    
    console.log(`Admin Stats API: Authenticated admin user ID: ${decodedToken.userId}`);

    const totalUsers = await prisma.user.count();
    const totalSubmittedManuscripts = await prisma.manuscript.count();
    const pendingManuscripts = await prisma.manuscript.count({
      where: {
        OR: [
          { status: 'Submitted' },
          { status: 'In Review' },
        ],
      },
    });

    const stats = {
      totalUsers,
      totalSubmittedManuscripts,
      pendingManuscripts,
    };

    console.log('Admin Stats API: Counts fetched successfully:', stats);
    return NextResponse.json(stats, { status: 200 });

  } catch (error: any) {
    console.error('Admin Stats API: General error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching statistics.', details: error.message },
      { status: 500 }
    );
  }
}
