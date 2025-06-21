
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ suggestions: [] }, { status: 200 });
  }

  try {
    const manuscripts = await prisma.manuscript.findMany({
      where: {
        status: 'Accepted', // Only search published manuscripts
        OR: [
          {
            articleTitle: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            abstract: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            keywords: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            submittedBy: {
              fullName: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
        ],
      },
      take: 5, // Limit the number of suggestions
      select: {
        id: true,
        articleTitle: true,
        abstract: true,
        submittedBy: {
          select: {
            fullName: true,
          },
        },
      },
    });

    const suggestions = manuscripts.map(m => ({
        id: m.id,
        title: m.articleTitle,
        excerpt: m.abstract.substring(0, 100) + (m.abstract.length > 100 ? '...' : ''),
        authors: m.submittedBy?.fullName ? [m.submittedBy.fullName] : [],
    }));

    return NextResponse.json({ suggestions }, { status: 200 });

  } catch (error: any) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during search.', details: error.message },
      { status: 500 }
    );
  }
}
