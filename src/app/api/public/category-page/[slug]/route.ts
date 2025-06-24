
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
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

    const journals = await prisma.manuscript.findMany({
      where: {
        journalCategoryId: category.id,
        status: 'Published',
      },
      select: {
        id: true,
        articleTitle: true,
        abstract: true,
        submittedAt: true,
        views: true,
        downloads: true,
        citations: true,
        keywords: true,
        status: true,
        submittedById: true,
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });
    
    // Map to a simplified JournalEntry-like structure
    const journalEntries = journals.map(j => ({
        id: j.id,
        title: j.articleTitle,
        excerpt: j.abstract.substring(0, 200) + '...',
        date: j.submittedAt.toISOString(),
        categoryId: category.id,
        views: j.views,
        downloads: j.downloads,
        citations: j.citations,
        keywords: j.keywords,
        articleType: 'Published Article',
        imagePath: category.imagePath,
        imageHint: category.imageHint,
    }));


    return NextResponse.json({ category, journals: journalEntries }, { status: 200 });
  } catch (error: any) {
    console.error(`Error fetching category page data for slug ${slug}:`, error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.', details: error.message },
      { status: 500 }
    );
  }
}
