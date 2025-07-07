import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';

    const whereClause: any = {
      role: 'author',
    };

    if (query) {
      // Corrected Prisma query without the 'mode' argument which was causing an error.
      // The search will now be case-sensitive.
      whereClause.OR = [
        { fullName: { contains: query } },
        { username: { contains: query } },
      ];
    }

    const authors = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        fullName: true,
        username: true,
        avatarUrl: true,
        instituteName: true,
        _count: {
          select: {
            submittedManuscripts: {
              where: { status: 'Published' }, // We still count only published ones for display
            },
          },
        },
      },
      orderBy: {
        fullName: 'asc',
      },
    });

    return NextResponse.json(authors, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching authors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch authors', details: error.message },
      { status: 500 }
    );
  }
}
