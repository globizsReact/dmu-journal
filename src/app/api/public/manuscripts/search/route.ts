
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { User } from '@prisma/client';

interface CoAuthor {
    title: string;
    givenName: string;
    lastName: string;
    email: string;
    affiliation: string;
    country: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ suggestions: [] });
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
        submittedBy: {
          select: {
            fullName: true,
          },
        },
        coAuthors: true,
      },
      take: 10, // Limit the number of suggestions
    });

    const suggestions = manuscripts.map((manuscript) => {
      const authors: string[] = [];
      if (manuscript.submittedBy?.fullName) {
        authors.push(manuscript.submittedBy.fullName);
      }
      
      let parsedCoAuthors: CoAuthor[] = [];
      if (manuscript.coAuthors) {
          if (typeof manuscript.coAuthors === 'string') {
              try {
                  parsedCoAuthors = JSON.parse(manuscript.coAuthors);
              } catch (e) {
                  // Ignore if parsing fails, co-authors will not be added to search result
              }
          } else if (Array.isArray(manuscript.coAuthors)) {
              // Directly use if it's already a JSON object (array)
              parsedCoAuthors = manuscript.coAuthors as CoAuthor[];
          }
      }
      
      if (Array.isArray(parsedCoAuthors)) {
        parsedCoAuthors.forEach(coAuthor => {
          if (coAuthor.givenName && coAuthor.lastName) {
            authors.push(`${coAuthor.givenName} ${coAuthor.lastName}`);
          }
        });
      }

      return {
        id: manuscript.id,
        title: manuscript.articleTitle,
        excerpt: manuscript.abstract.substring(0, 100) + '...',
        authors: authors,
      };
    });

    return NextResponse.json({ suggestions });

  } catch (error: any) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      { error: 'An error occurred while searching.', details: error.message },
      { status: 500 }
    );
  }
}
