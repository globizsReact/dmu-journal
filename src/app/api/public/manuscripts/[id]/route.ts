
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { JournalPage, PageWithChildren } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const manuscript = await prisma.manuscript.findUnique({
      where: { id: params.id, status: 'Published' },
      include: { journalCategory: true },
    });

    if (!manuscript || !manuscript.journalCategory) {
      return NextResponse.json({ error: 'Published manuscript not found' }, { status: 404 });
    }

    const pagesData = await prisma.journalPage.findMany({
      where: { journalCategoryId: manuscript.journalCategoryId },
      orderBy: { order: 'asc' },
    });

    const pageMap = new Map<string, PageWithChildren>(pagesData.map(p => ({ ...p, children: [] })).map(p => [p.id, p]));
    const pages: PageWithChildren[] = [];
    pagesData.forEach(p => {
      if (p.parentId && pageMap.has(p.parentId)) {
        pageMap.get(p.parentId)?.children.push(pageMap.get(p.id)!);
      } else {
        pages.push(pageMap.get(p.id)!);
      }
    });

    let parsedManuscript = { ...manuscript };
    if (manuscript.coAuthors && typeof manuscript.coAuthors === 'string') {
      try {
        parsedManuscript.coAuthors = JSON.parse(manuscript.coAuthors);
      } catch (e) {
        console.error("Failed to parse coAuthors JSON:", e);
        parsedManuscript.coAuthors = [];
      }
    }

    return NextResponse.json({
      manuscript: parsedManuscript,
      category: manuscript.journalCategory,
      pages: pages,
    }, { status: 200 });

  } catch (error: any) {
    console.error(`Error fetching manuscript ${params.id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
