
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getPlainTextFromTiptapJson } from '@/lib/tiptapUtils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query')?.toLowerCase().trim();

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    // We fetch all published manuscripts and filter in memory.
    // For a larger dataset, a full-text search index (e.g., with PostgreSQL or a search service) would be better.
    const manuscripts = await prisma.manuscript.findMany({
      where: {
        status: 'Published', // Only search published manuscripts
      },
      include: {
        submittedBy: {
          select: {
            fullName: true,
          },
        },
      },
      take: 100, // Limit initial fetch to avoid performance issues with very large datasets
    });

    const suggestions = manuscripts
      .map(m => {
        const plainTextAbstract = getPlainTextFromTiptapJson(m.abstract);
        const authorName = m.submittedBy?.fullName?.toLowerCase() || '';

        // Check for matches in title, abstract, or author name
        const isMatch =
          m.articleTitle.toLowerCase().includes(query) ||
          plainTextAbstract.toLowerCase().includes(query) ||
          authorName.includes(query);

        if (isMatch) {
          return {
            id: m.id,
            title: m.articleTitle,
            excerpt: plainTextAbstract.substring(0, 150) + '...', // Create excerpt from plain text
            authors: m.submittedBy?.fullName ? [m.submittedBy.fullName] : [],
          };
        }
        return null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null) // Filter out nulls and type guard
      .slice(0, 10); // Limit to a reasonable number of suggestions

    return NextResponse.json({ suggestions });
  } catch (error: any) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Failed to perform search.', details: error.message }, { status: 500 });
  }
}
