
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
  try {
    const body = await request.json();
    const validation = incrementSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid type specified' }, { status: 400 });
    }

    const { type } = validation.data;

    await prisma.manuscript.update({
      where: { id: params.id },
      data: {
        [type]: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Manuscript not found' }, { status: 404 });
    }
    console.error(`Error incrementing ${params.id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
