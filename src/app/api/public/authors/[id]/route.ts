
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getPlainTextFromTiptapJson } from '@/lib/tiptapUtils';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const authorId = parseInt(params.id, 10);
  if (isNaN(authorId)) {
    return NextResponse.json({ error: 'Invalid author ID' }, { status: 400 });
  }

  try {
    const authorData = await prisma.user.findUnique({
      where: {
        id: authorId,
        // Explicitly only find users with the author role for this public page
        role: 'author',
      },
      select: {
        // Author profile fields
        id: true,
        fullName: true,
        username: true,
        avatarUrl: true,
        instituteName: true,
        department: true,
        // Include published manuscripts directly in the query
        submittedManuscripts: {
          where: {
            status: 'Published',
          },
          select: {
            id: true,
            articleTitle: true,
            submittedAt: true,
            views: true,
            downloads: true,
            abstract: true,
            journalCategory: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            submittedAt: 'desc',
          },
        },
      },
    });

    if (!authorData) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }

    // Separate the author's profile from their manuscripts for clean data structuring
    const { submittedManuscripts, ...authorProfile } = authorData;

    // Aggregate stats from the fetched manuscripts in memory
    const stats = submittedManuscripts.reduce(
      (acc, ms) => {
        acc.totalViews += ms.views || 0;
        acc.totalDownloads += ms.downloads || 0;
        return acc;
      },
      {
        totalViews: 0,
        totalDownloads: 0,
        totalManuscripts: submittedManuscripts.length,
      }
    );

    // Process manuscripts to create excerpts for the client
    const processedManuscripts = submittedManuscripts.map(ms => ({
      id: ms.id,
      articleTitle: ms.articleTitle,
      excerpt: getPlainTextFromTiptapJson(ms.abstract).substring(0, 150) + '...',
      submittedAt: ms.submittedAt.toISOString(),
      journalCategory: {
        name: ms.journalCategory?.name || 'Uncategorized',
      },
    }));

    // Return the combined, structured data
    return NextResponse.json({
      author: authorProfile,
      stats,
      manuscripts: processedManuscripts,
    });

  } catch (error: any) {
    console.error(`Error fetching author details for ID ${authorId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
