
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { JournalEntry } from '@/lib/types';

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
      include: {
        manuscripts: {
          where: { status: 'Published' },
          orderBy: { submittedAt: 'desc' },
        },
        _count: {
          select: { manuscripts: { where: { status: 'Published' } } },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const journalEntries: JournalEntry[] = category.manuscripts.map(ms => {
      const authors = ms.coAuthors && Array.isArray(ms.coAuthors) 
          ? ms.coAuthors.map((a: any) => `${a.givenName} ${a.lastName}`) 
          : [];
      return {
          id: ms.id,
          title: ms.articleTitle,
          content: ms.abstract,
          date: ms.submittedAt.toISOString(),
          categoryId: ms.journalCategoryId,
          excerpt: ms.abstract.substring(0, 250) + '...',
          authors: authors,
          views: ms.views,
          downloads: ms.downloads,
          citations: ms.citations,
          keywords: ms.keywords || "",
          articleType: "Published Article",
      };
    });

    const categoryWithCount = {
      ...category,
      publishedArticlesCount: category._count.manuscripts,
    };
    // Don't send back the full manuscripts list inside the category object to avoid data duplication
    delete (categoryWithCount as any).manuscripts;

    return NextResponse.json({ category: categoryWithCount, journals: journalEntries });

  } catch (error: any) {
    console.error(`Error fetching data for category slug ${slug}:`, error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
