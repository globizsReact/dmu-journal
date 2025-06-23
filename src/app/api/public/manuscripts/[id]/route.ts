
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { Manuscript } from '@prisma/client';

function mapPrismaManuscriptToJournalEntry(manuscript: Manuscript, category: any) {
    let authors = [];
    if (manuscript.coAuthors && typeof manuscript.coAuthors === 'string') {
        try {
            const coAuthorsData = JSON.parse(manuscript.coAuthors);
            if (Array.isArray(coAuthorsData)) {
                authors = coAuthorsData.map((a: any) => `${a.title || ''} ${a.givenName || ''} ${a.lastName || ''}`.trim());
            }
        } catch (e) {
            console.error("Failed to parse coAuthors JSON:", e);
        }
    } else if (Array.isArray(manuscript.coAuthors)) {
        authors = (manuscript.coAuthors as any[]).map((a: any) => `${a.title || ''} ${a.givenName || ''} ${a.lastName || ''}`.trim());
    }

    return {
        ...manuscript,
        title: manuscript.articleTitle,
        excerpt: manuscript.abstract.substring(0, 250) + '...',
        date: manuscript.submittedAt.toISOString(),
        content: manuscript.abstract,
        categoryId: manuscript.journalCategoryId,
        imagePath: category.imagePath,
        imageHint: category.imageHint,
        authors: authors,
        id: manuscript.id
    };
}


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const manuscriptId = params.id;
  try {
    const manuscript = await prisma.manuscript.findUnique({
      where: { id: manuscriptId },
    });

    if (!manuscript) {
      return NextResponse.json({ error: 'Manuscript not found' }, { status: 404 });
    }
    
    const category = await prisma.journalCategory.findUnique({
        where: { id: manuscript.journalCategoryId },
    });

    if (!category) {
        return NextResponse.json({ error: 'Associated journal category not found' }, { status: 404 });
    }
    
    const augmentedManuscript = mapPrismaManuscriptToJournalEntry(manuscript, category);

    return NextResponse.json({ manuscript: augmentedManuscript, category }, { status: 200 });

  } catch (error: any) {
    console.error(`Error fetching journal entry with ID ${manuscriptId}:`, error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching the manuscript.', details: error.message },
      { status: 500 }
    );
  }
}
