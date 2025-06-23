
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { Manuscript } from '@prisma/client';

interface Suggestion {
    id: string;
    title: string;
    excerpt: string;
    authors: string[];
}

// A simple utility to parse co-authors, robust against different storage formats
function parseCoAuthors(coAuthors: any): string[] {
    if (!coAuthors) return [];
    try {
        let authorsArray;
        if (typeof coAuthors === 'string') {
            authorsArray = JSON.parse(coAuthors);
        } else if (Array.isArray(coAuthors)) {
            authorsArray = coAuthors;
        } else {
            return [];
        }

        if (!Array.isArray(authorsArray)) return [];

        return authorsArray.map(author => {
            if (typeof author === 'object' && author !== null && author.givenName && author.lastName) {
                return `${author.givenName} ${author.lastName}`;
            }
            return 'Unknown Author';
        }).filter(name => name !== 'Unknown Author');

    } catch (error) {
        console.error("Failed to parse co-authors:", error);
        return [];
    }
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
          { articleTitle: { contains: query } },
          { abstract: { contains: query } },
          { keywords: { contains: query } },
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
    
    const suggestions: Suggestion[] = manuscripts.map(ms => ({
      id: ms.id,
      title: ms.articleTitle,
      excerpt: ms.abstract.substring(0, 100) + (ms.abstract.length > 100 ? '...' : ''),
      authors: parseCoAuthors(ms.coAuthors)
    }));

    return NextResponse.json({ suggestions });

  } catch (error: any) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: 'An error occurred while searching for manuscripts.', details: error.message },
      { status: 500 }
    );
  }
}
