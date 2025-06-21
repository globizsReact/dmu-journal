
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { journalCategories } from '@/lib/data'; // for category details

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const manuscriptId = params.id;

  if (!manuscriptId) {
    return NextResponse.json({ error: 'Manuscript ID is required' }, { status: 400 });
  }

  try {
    const manuscript = await prisma.manuscript.findUnique({
      where: { id: manuscriptId },
      include: {
        submittedBy: {
          select: {
            fullName: true,
          },
        },
      },
    });

    if (!manuscript) {
      return NextResponse.json({ error: 'Manuscript not found' }, { status: 404 });
    }
    
    const category = journalCategories.find(cat => cat.id === manuscript.journalCategoryId);
    if (!category) {
        // This case is unlikely if data is consistent, but good to handle.
        return NextResponse.json({ error: 'Journal category for this manuscript not found' }, { status: 404 });
    }

    // Adapt Prisma manuscript to JournalEntry-like structure
    const authors: string[] = [];
    if (manuscript.submittedBy?.fullName) {
      authors.push(manuscript.submittedBy.fullName);
    }
    
    // Assuming coAuthors is a JSON array of objects with name properties
    if (manuscript.coAuthors && Array.isArray(manuscript.coAuthors)) {
        manuscript.coAuthors.forEach((author: any) => {
            if(author.givenName && author.lastName) {
                authors.push(`${author.title || ''} ${author.givenName} ${author.lastName}`.trim());
            }
        });
    }
    
    const journalEntryData = {
        id: manuscript.id,
        title: manuscript.articleTitle,
        content: manuscript.abstract, // Mapping abstract to content
        date: manuscript.submittedAt.toISOString(),
        categoryId: manuscript.journalCategoryId,
        excerpt: manuscript.abstract.substring(0, 200) + '...', // Create excerpt
        authors: authors,
        keywords: manuscript.keywords ? manuscript.keywords.split(',').map(k => k.trim()) : [],
        articleType: 'Research Paper', // Mocking this as it's not in the model
        // Mocking stats as they are not in the model
        views: Math.floor(Math.random() * 500) + 20, 
        downloads: Math.floor(Math.random() * 100) + 5,
        citations: Math.floor(Math.random() * 50),
        // Add other fields if needed by JournalView, like imagePath
        imagePath: category.imagePath, // Use category image as a fallback
        imageHint: category.imageHint,
    };


    return NextResponse.json({ manuscript: journalEntryData, category }, { status: 200 });

  } catch (error: any) {
    console.error(`Error fetching manuscript ${manuscriptId}:`, error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching the journal entry.', details: error.message },
      { status: 500 }
    );
  }
}
