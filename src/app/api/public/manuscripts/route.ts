
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { JournalEntry } from '@/lib/types';

export async function GET() {
  try {
    const manuscripts = await prisma.manuscript.findMany({
      where: {
        status: 'Accepted', // Only fetch accepted/published manuscripts
      },
      include: {
        submittedBy: {
          select: {
            fullName: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    // Map Prisma model to JournalEntry type for frontend consistency
    const journalEntries: JournalEntry[] = manuscripts.map((m) => ({
      id: m.id,
      title: m.articleTitle,
      content: m.abstract, // Use abstract for content
      date: m.submittedAt.toISOString(),
      categoryId: m.journalCategoryId,
      excerpt: m.abstract.substring(0, 200) + '...', // Create an excerpt from the abstract
      authors: m.submittedBy ? [m.submittedBy.fullName || 'Unknown Author'] : [],
      articleType: "Published Article", // Example static value
      // imagePath and other fields can be added here if they exist on the model
    }));

    return NextResponse.json(journalEntries);
  } catch (error) {
    console.error('Error fetching manuscripts:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching manuscripts.' },
      { status: 500 }
    );
  }
}
