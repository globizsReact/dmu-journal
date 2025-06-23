
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const revalidate = 60; // Revalidate every 60 seconds

// GET all journal categories for public consumption
export async function GET() {
  try {
    const categories = await prisma.journalCategory.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
            select: { manuscripts: true },
        },
      },
    });

    const categoriesWithCounts = categories.map(cat => ({
        ...cat,
        publishedArticlesCount: cat._count.manuscripts,
    }));

    return NextResponse.json(categoriesWithCounts);
  } catch (error) {
    console.error('Error fetching public journal categories:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
