
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { JournalEntry } from '@/lib/types';
import type { Manuscript as PrismaManuscript, JournalCategory } from '@prisma/client';
import { getPlainTextFromTiptapJson } from '@/lib/tiptapUtils';

// A type that includes potential relations
interface ManuscriptWithDetails extends PrismaManuscript {
  submittedBy?: {
    fullName: string | null;
  } | null;
  coAuthors?: any; // coAuthors is JSON
  journalCategory: JournalCategory;
}

function mapPrismaManuscriptToJournalEntry(manuscript: ManuscriptWithDetails): JournalEntry {
  // Safely parse coAuthors if they exist and are an array
  let coAuthorNames: string[] = [];
  if (manuscript.coAuthors && Array.isArray(manuscript.coAuthors)) {
    try {
      coAuthorNames = manuscript.coAuthors.map((author: any) => `${author.givenName || ''} ${author.lastName || ''}`.trim()).filter(name => name);
    } catch (e) {
      console.error("Failed to parse co-author names:", e);
    }
  }

  // Get plain text from the abstract for the excerpt
  const plainTextAbstract = getPlainTextFromTiptapJson(manuscript.abstract);

  return {
    id: manuscript.id,
    title: manuscript.articleTitle,
    abstract: manuscript.abstract, // Keep the JSON for rendering
    excerpt: plainTextAbstract.substring(0, 250) + '...', // Use plain text for the excerpt
    date: manuscript.submittedAt.toISOString(),
    categoryId: manuscript.journalCategoryId,
    authors: manuscript.submittedBy?.fullName ? [manuscript.submittedBy.fullName, ...coAuthorNames] : [...coAuthorNames],
    keywords: typeof manuscript.keywords === 'string' ? manuscript.keywords.split(',').map(k => k.trim()) : [],
    views: manuscript.views,
    downloads: manuscript.downloads,
    citations: manuscript.citations,
    articleType: "Full Length Research Paper", // Assuming a default or this would come from the model
    thumbnailImagePath: manuscript.thumbnailImagePath,
    thumbnailImageHint: manuscript.thumbnailImageHint,
  };
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  
  if (!id) {
    return NextResponse.json({ error: 'Manuscript ID is required.' }, { status: 400 });
  }

  try {
    const manuscript = await prisma.manuscript.findUnique({
      where: { 
        id,
        status: 'Published' // Only fetch published manuscripts
      },
      include: {
        submittedBy: {
          select: {
            fullName: true,
          },
        },
        journalCategory: true,
      },
    });

    if (!manuscript || !manuscript.journalCategory) {
      return NextResponse.json({ error: 'Published manuscript not found.' }, { status: 404 });
    }

    // The prisma client might return coAuthors as a JSON object, let's parse it if needed
    let parsedManuscript = { ...manuscript };
    if (typeof manuscript.coAuthors === 'string') {
        try {
            parsedManuscript.coAuthors = JSON.parse(manuscript.coAuthors);
        } catch (e) {
             console.error("Failed to parse coAuthors from string:", e);
             parsedManuscript.coAuthors = [];
        }
    }


    const journalEntry = mapPrismaManuscriptToJournalEntry(parsedManuscript as ManuscriptWithDetails);
    const category = manuscript.journalCategory;
    
    return NextResponse.json({ manuscript: journalEntry, category }, { status: 200 });

  } catch (error: any) {
    console.error(`Error fetching manuscript ${id}:`, error);
    return NextResponse.json({ error: 'An internal server error occurred.', details: error.message }, { status: 500 });
  }
}
