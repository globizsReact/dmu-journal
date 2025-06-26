
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getPlainTextFromTiptapJson } from '@/lib/tiptapUtils';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  try {
    const category = await prisma.journalCategory.findUnique({
      where: { slug },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const journals = await prisma.manuscript.findMany({
      where: {
        journalCategoryId: category.id,
        status: 'Published', // Only show published articles
      },
      orderBy: { submittedAt: 'desc' },
      select: {
        id: true,
        articleTitle: true,
        abstract: true,
        submittedAt: true,
        journalCategoryId: true,
        thumbnailImagePath: true,
        thumbnailImageHint: true,
        views: true,
        downloads: true,
        citations: true,
        articleType: true,
      },
    });

    const journalEntries = journals.map(m => ({
      id: m.id,
      title: m.articleTitle,
      date: m.submittedAt.toISOString(),
      excerpt: getPlainTextFromTiptapJson(m.abstract).substring(0, 150) + '...',
      categoryId: m.journalCategoryId,
      thumbnailImagePath: m.thumbnailImagePath,
      thumbnailImageHint: m.thumbnailImageHint,
      views: m.views,
      downloads: m.downloads,
      citations: m.citations,
      articleType: m.articleType,
      abstract: m.abstract, // pass full abstract for rendering
    }));

    const publishedArticlesCount = journalEntries.length;
    
    const categoryPages = await prisma.journalPage.findMany({
        where: { journalCategoryId: category.id },
        orderBy: { order: 'asc' },
    });

    const pageTree = categoryPages
      .filter(page => !page.parentId)
      .map(page => ({
        ...page,
        children: categoryPages.filter(child => child.parentId === page.id),
      }));

    return NextResponse.json({
      category: { ...category, publishedArticlesCount },
      journals: journalEntries,
      pages: pageTree,
    });

  } catch (error: any) {
    console.error(`Error fetching category page for slug ${slug}:`, error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
