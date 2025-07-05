
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getPlainTextFromTiptapJson } from '@/lib/tiptapUtils';
import type { AuthorProfile, AuthorStats, JournalEntry, ManuscriptData } from '@/lib/types';


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authorId = parseInt(params.id, 10);
    if (isNaN(authorId)) {
      return NextResponse.json({ error: 'Invalid author ID' }, { status: 400 });
    }

    const author = await prisma.user.findFirst({
      where: { id: authorId, role: 'author' },
      select: {
        id: true,
        fullName: true,
        username: true,
        avatarUrl: true,
        instituteName: true,
        department: true,
        submittedManuscripts: {
          where: { status: 'Published' },
          select: {
            id: true,
            articleTitle: true,
            abstract: true,
            submittedAt: true,
            journalCategoryId: true,
            journalCategory: {
              select: {
                name: true,
                imagePath: true, // Fetch category image for fallback
                imageHint: true,
              },
            },
            thumbnailImagePath: true,
            thumbnailImageHint: true,
            views: true,
            downloads: true,
          },
          orderBy: {
            submittedAt: 'desc',
          },
        },
        _count: {
          select: {
            submittedManuscripts: {
              where: { status: 'Published' },
            },
          },
        },
      },
    });

    if (!author) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }

    const authorProfile: AuthorProfile = {
      id: author.id,
      fullName: author.fullName,
      username: author.username,
      avatarUrl: author.avatarUrl,
      instituteName: author.instituteName,
      department: author.department,
    };

    const totalViews = author.submittedManuscripts.reduce((sum, ms) => sum + (ms.views || 0), 0);
    const totalDownloads = author.submittedManuscripts.reduce((sum, ms) => sum + (ms.downloads || 0), 0);

    const stats: AuthorStats = {
      totalViews,
      totalDownloads,
      totalManuscripts: author._count.submittedManuscripts,
    };

    const manuscripts: ManuscriptData[] = author.submittedManuscripts.map(ms => ({
      entry: {
        id: ms.id,
        title: ms.articleTitle,
        abstract: ms.abstract,
        date: ms.submittedAt.toISOString(),
        categoryId: ms.journalCategoryId,
        excerpt: getPlainTextFromTiptapJson(ms.abstract).substring(0, 150) + '...',
        thumbnailImagePath: ms.thumbnailImagePath,
        thumbnailImageHint: ms.thumbnailImageHint,
        imagePath: ms.journalCategory?.imagePath, // Fallback image
        imageHint: ms.journalCategory?.imageHint, // Fallback hint
        views: ms.views,
        downloads: ms.downloads,
      },
      categoryName: ms.journalCategory?.name || 'Unknown',
    }));
    
    return NextResponse.json({
      author: authorProfile,
      stats,
      manuscripts,
    });

  } catch (error: any) {
    console.error('Error fetching author data:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
