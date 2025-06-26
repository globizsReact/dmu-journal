
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.faqCategory.findMany({
      orderBy: {
        order: 'asc',
      },
      include: {
        items: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Failed to fetch FAQs:", error);
    return NextResponse.json({ error: "Could not fetch FAQs." }, { status: 500 });
  }
}
