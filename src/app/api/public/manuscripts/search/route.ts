
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface SearchSuggestion {
  id: string;
  title: string;
  excerpt: string;
  authors: string[];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const manuscripts = await prisma.manuscript.findMany({
      where: {
        status: 'Published',
        OR: [
          { articleTitle: { contains: query, mode: 'insensitive' } },
          { abstract: { contains: query, mode: 'insensitive' } },
          { keywords: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        articleTitle: true,
        abstract: true,
        coAuthors: true,
      },
      take: 10,
    });

    const suggestions: SearchSuggestion[] = manuscripts.map((ms) => {
      let authorNames: string[] = [];
      // The coAuthors field is of type JsonValue. We must handle it safely.
      if (Array.isArray(ms.coAuthors)) {
        try {
          authorNames = ms.coAuthors
            .map((author: any) => {
              if (author && typeof author === 'object' && author.givenName && author.lastName) {
                return `${author.givenName} ${author.lastName}`.trim();
              }
              return null;
            })
            .filter((name): name is string => name !== null && name !== '');
        } catch (e) {
            console.error(`Error processing coAuthors for manuscript ID ${ms.id}:`, e);
            // On error, authorNames will remain an empty array.
            authorNames = [];
        }
      }

      return {
        id: ms.id,
        title: ms.articleTitle,
        // Ensure abstract is not null before calling substring
        excerpt: ms.abstract?.substring(0, 100) || '',
        authors: authorNames,
      };
    });

    return NextResponse.json({ suggestions });
  } catch (error: any) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during search.', details: error.message },
      { status: 500 }
    );
  }
}
