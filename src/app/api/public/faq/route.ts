
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// This endpoint now returns both the page settings (like cover photo) and the FAQ data itself.
export async function GET() {
  try {
    const pageSettings = await prisma.sitePage.findUnique({
      where: { slug: 'faq' },
      select: {
        coverImagePath: true,
        coverImageHint: true,
      }
    });

    const faqCategories = await prisma.faqCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        items: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return NextResponse.json({ pageSettings, faqData: faqCategories });
  } catch (error) {
    console.error('Error fetching public FAQ data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
