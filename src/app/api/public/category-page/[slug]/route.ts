
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { JournalEntry, PageWithChildren, EditorialBoardMember } from '@/lib/types';
import { getPlainTextFromTiptapJson } from '@/lib/tiptapUtils';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;

  try {
    // 1. Fetch Journal Category
    const category = await prisma.journalCategory.findUnique({
      where: { slug },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // 2. Fetch published manuscripts for this category
    const publishedManuscripts = await prisma.manuscript.findMany({
      where: {
        journalCategoryId: category.id,
        status: 'Published',
      },
      include: {
        submittedBy: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            department: true,
            instituteName: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    const journals: JournalEntry[] = publishedManuscripts.map(ms => ({
      id: ms.id,
      title: ms.articleTitle,
      abstract: ms.abstract,
      date: ms.submittedAt.toISOString(),
      categoryId: ms.journalCategoryId,
      excerpt: getPlainTextFromTiptapJson(ms.abstract).substring(0, 200) + '...',
      authors: ms.coAuthors && typeof ms.coAuthors === 'object' && Array.isArray(ms.coAuthors)
          ? ms.coAuthors.map((author: any) => ({ name: `${author.givenName} ${author.lastName}` }))
          : [],
      views: ms.views,
      downloads: ms.downloads,
      citations: ms.citations,
      keywords: ms.keywords || '',
      articleType: ms.articleType || 'Research Article',
      thumbnailImagePath: ms.thumbnailImagePath,
      thumbnailImageHint: ms.thumbnailImageHint,
    }));
    
    // 3. Fetch pages for this category
    const allPages = await prisma.journalPage.findMany({
        where: { journalCategoryId: category.id },
        orderBy: { order: 'asc' },
    });

    const pageMap = new Map(allPages.map(p => [p.id, { ...p, children: [] }]));
    const rootPages: PageWithChildren[] = [];

    allPages.forEach(p => {
        if (p.parentId && pageMap.has(p.parentId)) {
            pageMap.get(p.parentId)?.children.push(pageMap.get(p.id)!);
        } else {
            rootPages.push(pageMap.get(p.id)!);
        }
    });

    // 4. Construct Editorial Board
    const editorialBoardMembers: EditorialBoardMember[] = publishedManuscripts
      .filter(ms => ms.submittedBy) // Ensure the author exists
      .map(ms => ({
        id: ms.submittedBy!.id,
        fullName: ms.submittedBy!.fullName || 'Unknown Author',
        articleNumber: ms.id,
        journalName: category.name,
        manuscriptTitle: ms.articleTitle,
        department: ms.submittedBy!.department,
        instituteName: ms.submittedBy!.instituteName,
        avatarUrl: ms.submittedBy!.avatarUrl,
      }));


    return NextResponse.json({
      category,
      journals,
      pages: rootPages,
      editorialBoard: editorialBoardMembers,
    });

  } catch (error: any) {
    console.error(`Error fetching data for category page ${slug}:`, error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
