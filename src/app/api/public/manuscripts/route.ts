
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const publishedManuscripts = await prisma.manuscript.findMany({
      where: {
        status: 'Published',
      },
      select: {
        id: true,
        articleTitle: true,
      },
      orderBy: {
        articleTitle: 'asc',
      },
    });

    // Transform the data to a simpler format for the list view
    const journalEntries = publishedManuscripts.map(ms => ({
      id: ms.id,
      title: ms.articleTitle,
    }));

    return NextResponse.json(journalEntries, { status: 200 });
  } catch (error) {
    console.error('Error fetching published manuscripts:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching journal entries.' },
      { status: 500 }
    );
  }
}
