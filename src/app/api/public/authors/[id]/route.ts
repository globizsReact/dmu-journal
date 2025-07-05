
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const authorId = parseInt(params.id, 10);
  if (isNaN(authorId)) {
    return NextResponse.json({ error: 'Invalid author ID' }, { status: 400 });
  }

  try {
    const author = await prisma.user.findUnique({
      where: { id: authorId, role: 'author' },
      select: {
        id: true,
        fullName: true,
        username: true,
        avatarUrl: true,
        instituteName: true,
        department: true,
      },
    });

    if (!author) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }

    const manuscripts = await prisma.manuscript.findMany({
      where: {
        submittedById: authorId,
        status: 'Published',
      },
      select: {
        id: true,
        articleTitle: true,
        excerpt: true,
        views: true,
        downloads: true,
        submittedAt: true,
        journalCategory: {
          select: {
            name: true,
          }
        }
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    const stats = manuscripts.reduce(
      (acc, ms) => {
        acc.totalViews += ms.views ?? 0;
        acc.totalDownloads += ms.downloads ?? 0;
        return acc;
      },
      { totalViews: 0, totalDownloads: 0 }
    );

    const totalManuscripts = manuscripts.length;

    return NextResponse.json({
      author,
      stats: { ...stats, totalManuscripts },
      manuscripts,
    });
  } catch (error) {
    console.error(`Error fetching author details for ID ${authorId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
