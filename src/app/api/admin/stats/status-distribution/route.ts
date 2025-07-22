
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

    const distribution = await prisma.manuscript.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    const chartData = distribution.map(item => ({
      status: item.status,
      count: item._count.status,
    }));

    return NextResponse.json(chartData, { status: 200 });

  } catch (error: any) {
    console.error('Admin Stats API (Status Distribution): General error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching status distribution data.', details: error.message },
      { status: 500 }
    );
  }
}
