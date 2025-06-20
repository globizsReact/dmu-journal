
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/authUtils';

export async function GET(request: NextRequest) {
  console.log('Admin All Manuscripts API: Received GET request');
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }
    const decodedToken = verifyToken(token);
    if (!decodedToken || decodedToken.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const manuscripts = await prisma.manuscript.findMany({
      include: {
        submittedBy: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
      skip: skip,
      take: limit,
    });

    const totalCount = await prisma.manuscript.count();
    const totalPages = Math.ceil(totalCount / limit);

    console.log(`Admin All Manuscripts API: Found ${manuscripts.length} manuscripts for page ${page}, total ${totalCount}.`);
    return NextResponse.json({ manuscripts, totalCount, totalPages, currentPage: page }, { status: 200 });

  } catch (error: any) {
    console.error('Admin All Manuscripts API: General error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching manuscripts.', details: error.message },
      { status: 500 }
    );
  }
}
    
