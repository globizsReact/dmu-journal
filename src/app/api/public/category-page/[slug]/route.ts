
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getPlainTextFromTiptapJson } from '@/lib/tiptapUtils';
import type { JournalEntry } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  if (!slug) {
    return NextResponse.json({ error: 'Category slug is required.' }, { status: 400 });
  }

  try {
    const category = await prisma.journalCategory.findUnique({
      where: { slug },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
    }

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
            fullName: true,
          },
        },
      },
    });

    // Transform manuscripts to JournalEntry format
    const journals: JournalEntry[] = manuscripts.map((j) => {
      const plainAbstract = getPlainTextFromTiptapJson(j.abstract);
      let coAuthorNames: string[] = [];
      if (j.coAuthors && Array.isArray(j.coAuthors)) {
        coAuthorNames = j.coAuthors.map((a: any) => `${a.title || ''} ${a.givenName || ''} ${a.lastName || ''}`.trim());
      }
      const authorList = [j.submittedBy?.fullName, ...coAuthorNames].filter(Boolean) as string[];

      return {
        id: j.id,
        title: j.articleTitle,
        excerpt: plainAbstract.substring(0, 200) + (plainAbstract.length > 200 ? '...' : ''),
        date: j.submittedAt.toISOString(),
        categoryId: category.id,
        views: j.views,
        downloads: j.downloads,
        citations: j.citations,
        keywords: j.keywords?.split(',').map(k => k.trim()) || [],
        articleType: "Full Length Research Paper", // This might need to be a field in the DB later
        authors: authorList,
        abstract: j.abstract,
        imagePath: j.thumbnailImagePath || category.imagePath,
        imageHint: j.thumbnailImageHint || category.imageHint,
        thumbnailImagePath: j.thumbnailImagePath,
        thumbnailImageHint: j.thumbnailImageHint,
      };
    });

    return NextResponse.json({ category, journals });

  } catch (error: any) {
    console.error(`Error fetching category page data for slug ${slug}:`, error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
