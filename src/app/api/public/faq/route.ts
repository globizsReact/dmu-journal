import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const faqData = await prisma.faqCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        items: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return NextResponse.json(faqData, { status: 200 });
  } catch (error: any) {
    console.error('API Public FAQ Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching FAQ data.', details: error.message },
      { status: 500 }
    );
  }
}
