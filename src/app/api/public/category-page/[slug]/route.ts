
'use server';

import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { JournalCategory, JournalEntry, PageWithChildren, EditorialBoardMember } from '@/lib/types';
import { getPlainTextFromTiptapJson } from '@/lib/tiptapUtils';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json({ error: 'Category slug is required' }, { status: 400 });
  }

  try {
    // 1. Fetch the category itself
    const category = await prisma.journalCategory.findUnique({
      where: { slug },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // 2. Fetch published manuscripts for this category
    const manuscripts = await prisma.manuscript.findMany({
      where: {
        journalCategoryId: category.id,
        status: 'Published',
      },
      orderBy: {
        submittedAt: 'desc',
      },
      include: {
        submittedBy: {
            select: {
                id: true,
                fullName: true,
                email: true,
                avatarUrl: true,
            }
        }
      }
    });

    // Map to JournalEntry type for the article list
    const journalEntries: JournalEntry[] = manuscripts.map(m => ({
      id: m.id,
      title: m.articleTitle,
      abstract: m.abstract,
      date: m.submittedAt.toISOString(),
      categoryId: category.id,
      excerpt: getPlainTextFromTiptapJson(m.abstract).substring(0, 150) + '...',
      views: m.views,
      downloads: m.downloads,
      citations: m.citations,
      keywords: m.keywords,
      articleType: m.articleType,
      thumbnailImagePath: m.thumbnailImagePath,
      thumbnailImageHint: m.thumbnailImageHint,
      authors: [{ name: m.submittedBy.fullName || 'N/A' }], // Simplified for list view
    }));

    // 3. Fetch pages for this category and build the tree
    const journalPagesRaw = await prisma.journalPage.findMany({
        where: { journalCategoryId: category.id },
        orderBy: { order: 'asc' },
    });
    
    const pageMap = new Map(journalPagesRaw.map(p => [p.id, { ...p, children: [] }]));
    const rootPages: PageWithChildren[] = [];
    journalPagesRaw.forEach(p => {
        if (p.parentId && pageMap.has(p.parentId)) {
            pageMap.get(p.parentId)?.children.push(pageMap.get(p.id)!);
        } else {
            rootPages.push(pageMap.get(p.id)!);
        }
    });

    // 4. Check if we need to fetch the editorial board
    const hasEditorialBoardPage = journalPagesRaw.some(p => p.pageType === 'EDITORIAL_BOARD');
    let editorialBoard: EditorialBoardMember[] | null = null;
    
    if (hasEditorialBoardPage) {
        // Fetch published manuscripts again, but this time with coAuthors
        const manuscriptsForBoard = await prisma.manuscript.findMany({
            where: {
                journalCategoryId: category.id,
                status: 'Published',
            },
            include: {
                submittedBy: { select: { id: true, fullName: true, email: true, avatarUrl: true } },
            },
            orderBy: { submittedAt: 'desc' },
        });

        const processedAuthors = new Set<number>();
        editorialBoard = [];

        for (const m of manuscriptsForBoard) {
            if (m.submittedBy && !processedAuthors.has(m.submittedBy.id)) {
                let affiliation = 'N/A';
                if (m.coAuthors && Array.isArray(m.coAuthors) && m.coAuthors.length > 0) {
                    const mainAuthorDetails = m.coAuthors.find(
                        (author: any) => typeof author === 'object' && author.email === m.submittedBy.email
                    ) as any;
                    if (mainAuthorDetails && mainAuthorDetails.affiliation) {
                        affiliation = mainAuthorDetails.affiliation;
                    }
                }

                editorialBoard.push({
                    id: m.submittedBy.id,
                    fullName: m.submittedBy.fullName || 'N/A',
                    articleNumber: m.id,
                    journalName: category.name,
                    affiliation: affiliation,
                    avatarUrl: m.submittedBy.avatarUrl || undefined,
                });
                processedAuthors.add(m.submittedBy.id);
            }
        }
    }

    return NextResponse.json({
      category,
      journals: journalEntries,
      pages: rootPages,
      editorialBoard,
    });

  } catch (error: any) {
    console.error(`Error fetching category page data for slug ${slug}:`, error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
