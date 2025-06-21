
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { journalCategories } from '@/lib/data'; // To get fallback image

// Helper function to truncate text
const truncate = (str: string, num: number) => {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + '...';
};

export async function GET(
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  const categoryId = params.categoryId;

  if (!categoryId) {
    return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
  }

  try {
    const manuscripts = await prisma.manuscript.findMany({
      where: {
        journalCategoryId: categoryId,
        // In a real application, you might filter by status, e.g., 'Accepted' or 'Published'
        // For now, we'll show all submitted manuscripts for demonstration.
      },
      include: {
        submittedBy: {
          select: {
            fullName: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
      take: 20, // Add a limit to avoid fetching too much data
    });

    const category = journalCategories.find(cat => cat.id === categoryId);

    // Map Prisma Manuscript model to a structure that matches the frontend's JournalEntry type
    const formattedEntries = manuscripts.map(manuscript => {
      // Safely parse coAuthors JSON
      let coAuthorNames: string[] = [];
      if (manuscript.coAuthors && typeof manuscript.coAuthors === 'string') {
        try {
            const coAuthorsParsed = JSON.parse(manuscript.coAuthors) as { givenName: string; lastName: string }[];
            if (Array.isArray(coAuthorsParsed)) {
               coAuthorNames = coAuthorsParsed.map(a => `${a.givenName} ${a.lastName}`);
            }
        } catch (e) {
            console.error("Failed to parse coAuthors JSON for manuscript:", manuscript.id);
        }
      } else if (Array.isArray(manuscript.coAuthors)) {
          // Handle case where it might already be an array of objects
          const coAuthorsArr = manuscript.coAuthors as unknown as { givenName: string; lastName: string }[];
          coAuthorNames = coAuthorsArr.map(a => `${a.givenName} ${a.lastName}`);
      }

      const authorNames = [
        manuscript.submittedBy?.fullName,
        ...coAuthorNames,
      ].filter(Boolean) as string[];

      return {
        id: manuscript.id,
        title: manuscript.articleTitle,
        content: manuscript.abstract, // For full view later
        date: manuscript.submittedAt.toISOString(),
        categoryId: manuscript.journalCategoryId,
        excerpt: truncate(manuscript.abstract, 150),
        authors: authorNames,
        imagePath: category?.imagePath || 'https://placehold.co/200x150.png',
        imageHint: category?.imageHint || 'research',
        // Mock data for fields not in Manuscript model
        views: Math.floor(Math.random() * 500), 
        downloads: Math.floor(Math.random() * 100),
        citations: Math.floor(Math.random() * 50),
        keywords: manuscript.keywords ? manuscript.keywords.split(',').map(k => k.trim()) : [],
        articleType: 'Submitted Manuscript',
      };
    });
    
    return NextResponse.json(formattedEntries, { status: 200 });

  } catch (error: any) {
    console.error(`Public Manuscript API: General error for category ID ${categoryId}:`, error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching journal entries.', details: error.message },
      { status: 500 }
    );
  }
}
