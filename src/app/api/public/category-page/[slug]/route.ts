
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { JournalCategory, JournalEntry, PageWithChildren, EditorialBoardMember } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  if (!slug) {
    return NextResponse.json({ error: 'Category slug is required' }, { status: 400 });
  }

  try {
    const category = await prisma.journalCategory.findUnique({
      where: { slug },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const publishedManuscripts = await prisma.manuscript.findMany({
      where: {
        journalCategoryId: category.id,
        status: 'Published'
      },
      select: {
        id: true,
        articleTitle: true,
        abstract: true,
        submittedAt: true,
        journalCategoryId: true,
        submittedById: true,
        thumbnailImagePath: true,
        thumbnailImageHint: true,
        coAuthors: true,
        views: true,
        downloads: true,
        citations: true,
        keywords: true,
      }
    });
    
    const journalEntries: JournalEntry[] = publishedManuscripts.map(ms => ({
      id: ms.id,
      title: ms.articleTitle,
      abstract: ms.abstract,
      date: ms.submittedAt.toISOString(),
      categoryId: ms.journalCategoryId,
      excerpt: typeof ms.abstract === 'object' && ms.abstract && 'content' in ms.abstract ? (ms.abstract as any).content.map((c: any) => c.content?.map((t: any) => t.text).join(' ')).join(' ').substring(0, 150) + '...' : '',
      authors: Array.isArray(ms.coAuthors) ? ms.coAuthors.map((a: any) => `${a.title} ${a.givenName} ${a.lastName}`) : [],
      thumbnailImagePath: ms.thumbnailImagePath || undefined,
      thumbnailImageHint: ms.thumbnailImageHint || undefined,
      views: ms.views || 0,
      downloads: ms.downloads || 0,
      citations: ms.citations || 0,
      keywords: ms.keywords || undefined,
    }));

    const pagesResult = await prisma.journalPage.findMany({
      where: { journalCategoryId: category.id },
      orderBy: { order: 'asc' },
    });

    const pageMap = new Map(pagesResult.map(p => [p.id, { ...p, children: [] }]));
    const rootPages: PageWithChildren[] = [];
    pagesResult.forEach(p => {
      if (p.parentId && pageMap.has(p.parentId)) {
        pageMap.get(p.parentId)?.children.push(pageMap.get(p.id)!);
      } else {
        rootPages.push(pageMap.get(p.id)!);
      }
    });

    // --- New Editorial Board Logic ---
    let editorialBoard: EditorialBoardMember[] = [];
    const hasEditorialBoardPage = pagesResult.some(p => p.pageType === 'EDITORIAL_BOARD');

    if (hasEditorialBoardPage) {
        // We already have the published manuscripts, let's find the unique authors
        const authorIds = [...new Set(publishedManuscripts.map(m => m.submittedById))];

        const authors = await prisma.user.findMany({
          where: { id: { in: authorIds } },
          select: { id: true, fullName: true },
        });

        editorialBoard = authors.map(author => {
            const firstManuscript = publishedManuscripts.find(m => m.submittedById === author.id);
            let affiliation = "Affiliation not available";
            
            if (firstManuscript && firstManuscript.coAuthors && Array.isArray(firstManuscript.coAuthors) && firstManuscript.coAuthors.length > 0) {
              const coAuthorInfo = firstManuscript.coAuthors[0] as any;
              if (coAuthorInfo.affiliation && coAuthorInfo.country) {
                affiliation = `${coAuthorInfo.affiliation}, ${coAuthorInfo.country}`;
              } else if (coAuthorInfo.affiliation) {
                affiliation = coAuthorInfo.affiliation;
              }
            }

            return {
                id: author.id,
                fullName: author.fullName || 'Unknown Author',
                articleNumber: firstManuscript?.id || 'N/A',
                journalName: category.name,
                affiliation: affiliation,
            };
        });
    }


    const responsePayload = {
      category,
      journals: journalEntries,
      pages: rootPages,
      editorialBoard: editorialBoard.length > 0 ? editorialBoard : null,
    };

    return NextResponse.json(responsePayload);
  } catch (error: any) {
    console.error(`Error fetching category page data for slug ${slug}:`, error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
