
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  try {
    const whereClause = {
      role: 'author',
      ...(query && {
        OR: [
          { fullName: { contains: query, mode: 'insensitive' } },
          { username: { contains: query, mode: 'insensitive' } },
        ],
      }),
    };

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
              where: { status: 'Published' }
            },
          },
        },
      },
      orderBy: {
        fullName: 'asc',
      },
    });

    return NextResponse.json(authors, { status: 200 });
  } catch (error) {
    console.error('Error fetching authors:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
