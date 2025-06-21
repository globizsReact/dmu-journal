
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface SearchSuggestion {
  id: string;
  title: string;
  excerpt: string;
  authors: string[];
}

// A simple function to generate an excerpt from content
const createExcerpt = (content: string, maxLength: number = 100): string => {
  if (!content) return '';
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trim() + '...';
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const manuscripts = await prisma.manuscript.findMany({
      where: {
        status: 'Accepted', // Only search published manuscripts
        OR: [
          {
            articleTitle: {
              contains: query, // `mode: 'insensitive'` removed for MySQL compatibility
            },
          },
          {
            abstract: {
              contains: query, // `mode: 'insensitive'` removed for MySQL compatibility
            },
          },
          {
            keywords: {
              contains: query, // `mode: 'insensitive'` removed for MySQL compatibility
            },
          },
        ],
      },
      take: 10, // Limit the number of suggestions
      include: {
        submittedBy: {
          select: {
            fullName: true,
          },
        },
      },
    });

    const suggestions: SearchSuggestion[] = manuscripts.map((manuscript) => {
      const authorNames: string[] = [];

      // Add the main submitting author if available
      if (manuscript.submittedBy?.fullName) {
        authorNames.push(manuscript.submittedBy.fullName);
      }

      // Add co-authors if they exist
      if (Array.isArray(manuscript.coAuthors)) {
        manuscript.coAuthors.forEach((author: any) => {
          // Check if author is a valid object with name properties
          if (author && typeof author === 'object' && author.givenName && author.lastName) {
            const coAuthorName = `${author.givenName} ${author.lastName}`;
            // Avoid adding duplicates if the main author is also listed as a co-author
            if (!authorNames.includes(coAuthorName)) {
              authorNames.push(coAuthorName);
            }
          }
        });
      }

      return {
        id: manuscript.id,
        title: manuscript.articleTitle,
        excerpt: createExcerpt(manuscript.abstract),
        authors: authorNames,
      };
    });

    return NextResponse.json({ suggestions });

  } catch (error: any) {
    console.error('Search API Error:', error);
    // It's better to return a specific error message for easier debugging
    return NextResponse.json(
      { error: 'Failed to fetch search suggestions.', details: error.message },
      { status: 500 }
    );
  }
}
