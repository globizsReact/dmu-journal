
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getPlainTextFromTiptapJson } from '@/lib/tiptapUtils';
import type { JournalEntry } from '@/lib/types';

// Helper to build a tree structure from a flat list of pages
function buildPageTree(pages: any[]) {
    const pageMap = new Map(pages.map(p => [p.id, { ...p, children: [] }]));
    const rootPages: any[] = [];
    pages.forEach(p => {
        if (p.parentId && pageMap.has(p.parentId)) {
            pageMap.get(p.parentId)?.children.push(pageMap.get(p.id)!);
        } else {
            rootPages.push(pageMap.get(p.id)!);
        }
    });
    return rootPages;
}

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

    const [manuscripts, pages] = await Promise.all([
      prisma.manuscript.findMany({
        where: {
          journalCategoryId: category.id,
          status: 'Published',
        },
        orderBy: {
          submittedAt: 'desc',
        },
      }),
      prisma.journalPage.findMany({
        where: { journalCategoryId: category.id },
        orderBy: { order: 'asc' },
      })
    ]);

    const pageTree = buildPageTree(pages);
    
    // Transform manuscripts to JournalEntry format for the frontend
    const journalEntries: JournalEntry[] = manuscripts.map(m => ({
      id: m.id,
      title: m.articleTitle,
      abstract: m.abstract,
      date: m.submittedAt.toISOString(),
      categoryId: m.journalCategoryId,
      excerpt: getPlainTextFromTiptapJson(m.abstract).substring(0, 250) + '...',
      authors: m.coAuthors && typeof m.coAuthors === 'object' ? (m.coAuthors as any[]).map(a => `${a.givenName} ${a.lastName}`) : [],
      keywords: m.keywords || undefined,
      articleType: "Published Article", // This could be a field in the future
      thumbnailImagePath: m.thumbnailImagePath,
      thumbnailImageHint: m.thumbnailImageHint,
      views: m.views,
      downloads: m.downloads,
      citations: m.citations,
    }));


    return NextResponse.json({
      category,
      journals: journalEntries,
      pages: pageTree,
    });

  } catch (error) {
    console.error(`Error fetching data for category ${slug}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
