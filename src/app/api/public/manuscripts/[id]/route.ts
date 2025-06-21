
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { journalCategories } from '@/lib/data';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const manuscriptId = params.id;
  try {
    const manuscript = await prisma.manuscript.findUnique({
      where: { id: manuscriptId },
      include: {
        submittedBy: {
            select: { fullName: true }
        }
      }
    });

    if (!manuscript) {
      return NextResponse.json({ error: 'Manuscript not found' }, { status: 404 });
    }

    const category = journalCategories.find(c => c.id === manuscript.journalCategoryId);

    if (!category) {
      return NextResponse.json({ error: 'Manuscript category not found' }, { status: 404 });
    }

    // Co-authors are stored as a JSON array of objects. We need to format them.
    const coAuthors: string[] = Array.isArray(manuscript.coAuthors) 
        ? manuscript.coAuthors.map((a: any) => `${a.title || ''} ${a.givenName || ''} ${a.lastName || ''}`.trim()).filter(name => name)
        : [];
    
    // Combine submitting author with co-authors
    const allAuthors = [manuscript.submittedBy.fullName || 'N/A', ...coAuthors];

    // Create a response object that matches the `JournalEntry` type used by frontend components
    const journalEntryResponse = {
      id: manuscript.id,
      title: manuscript.articleTitle,
      content: manuscript.abstract,
      date: manuscript.submittedAt.toISOString(),
      categoryId: manuscript.journalCategoryId,
      excerpt: manuscript.abstract.substring(0, 200) + '...',
      authors: allAuthors,
      imagePath: category.imagePath,
      imageHint: category.imageHint,
      views: manuscript.views,
      downloads: manuscript.downloads,
      citations: manuscript.citations,
      keywords: manuscript.keywords || '',
      articleType: "Research Paper", // This field is not in the DB model, so we can hardcode a default
    };

    return NextResponse.json({ manuscript: journalEntryResponse, category }, { status: 200 });

  } catch (error: any) {
    console.error(`Error fetching manuscript ${manuscriptId}:`, error);
    return NextResponse.json({ error: 'An unexpected error occurred while fetching manuscript data.' }, { status: 500 });
  }
}
