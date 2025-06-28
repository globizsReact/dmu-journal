
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { JournalCategory, JournalEntry, PageWithChildren, EditorialBoardMember } from '@/lib/types';
import { getPlainTextFromTiptapJson } from '@/lib/tiptapUtils';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;

  try {
    const category = await prisma.journalCategory.findUnique({
      where: { slug },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const [journals, pages, publishedManuscripts] = await Promise.all([
      prisma.manuscript.findMany({
        where: { journalCategoryId: category.id, status: 'Published' },
        select: {
          id: true,
          articleTitle: true,
          abstract: true,
          submittedAt: true,
          journalCategoryId: true,
          thumbnailImagePath: true,
          thumbnailImageHint: true,
          coAuthors: true,
          keywords: true,
          articleType: true,
          views: true,
          downloads: true,
          citations: true,
        },
        orderBy: { submittedAt: 'desc' },
      }),
      prisma.journalPage.findMany({
        where: { journalCategoryId: category.id },
        orderBy: { order: 'asc' },
      }),
      prisma.manuscript.findMany({ // Separate query for editorial board
        where: { journalCategoryId: category.id, status: 'Published' },
        select: {
          id: true,
          submittedBy: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true, // Crucially, select avatarUrl
            },
          },
        },
        distinct: ['submittedById'],
      }),
    ]);

    const journalEntries: JournalEntry[] = journals.map(j => ({
      id: j.id,
      title: j.articleTitle,
      abstract: j.abstract,
      date: j.submittedAt.toISOString(),
      categoryId: j.journalCategoryId,
      excerpt: getPlainTextFromTiptapJson(j.abstract).substring(0, 150) + '...',
      imagePath: j.thumbnailImagePath,
      imageHint: j.thumbnailImageHint,
      keywords: j.keywords,
      articleType: j.articleType || undefined,
      views: j.views,
      downloads: j.downloads,
      citations: j.citations,
    }));
    
    // Build page tree
    const pageMap = new Map(pages.map(p => [p.id, { ...p, children: [] }]));
    const rootPages: PageWithChildren[] = [];
    pages.forEach(p => {
        const pageWithChildren = pageMap.get(p.id)!;
        if (p.parentId && pageMap.has(p.parentId)) {
            pageMap.get(p.parentId)?.children.push(pageWithChildren);
        } else {
            rootPages.push(pageWithChildren);
        }
    });

    // Create a unique list of authors for the editorial board
    const editorialBoardMembers: EditorialBoardMember[] = publishedManuscripts.map(ms => ({
        id: ms.submittedBy.id,
        fullName: ms.submittedBy.fullName || 'Unnamed Author',
        articleNumber: ms.id,
        journalName: category.name,
        affiliation: 'Dhanamanjuri University', // This is a placeholder as it's not in the DB
        avatarUrl: ms.submittedBy.avatarUrl || undefined,
    }));

    const categoryWithCount = {
        ...category,
        publishedArticlesCount: journals.length,
    };

    return NextResponse.json({
      category: categoryWithCount,
      journals: journalEntries,
      pages: rootPages,
      editorialBoard: editorialBoardMembers,
    });

  } catch (error: any) {
    console.error(`Error in /api/public/category-page/${slug}:`, error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
