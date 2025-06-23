
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const categoriesFromDb = await prisma.journalCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { manuscripts: { where: { status: 'Published' } } },
        },
      },
    });

    const categories = categoriesFromDb.map(category => ({
      ...category,
      publishedArticlesCount: category._count.manuscripts,
    }));

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching journal categories:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
