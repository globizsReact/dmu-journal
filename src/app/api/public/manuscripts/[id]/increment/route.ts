
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const incrementSchema = z.object({
  type: z.enum(['views', 'downloads', 'citations']),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const manuscriptId = params.id;

  try {
    const body = await request.json();
    const validation = incrementSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid increment type.' }, { status: 400 });
    }

    const { type } = validation.data;

    // Use Prisma's atomic increment operation
    const updatedManuscript = await prisma.manuscript.update({
      where: { id: manuscriptId },
      data: {
        [type]: {
          increment: 1,
        },
      },
      select: { // Only return the updated counts
        views: true,
        downloads: true,
        citations: true,
      }
    });

    return NextResponse.json({ message: `${type} count incremented successfully.`, counts: updatedManuscript }, { status: 200 });

  } catch (error: any) {
    if (error.code === 'P2025') { // Prisma error for record not found
      return NextResponse.json({ error: 'Manuscript not found' }, { status: 404 });
    }
    console.error(`Failed to increment count for manuscript ${manuscriptId}:`, error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
