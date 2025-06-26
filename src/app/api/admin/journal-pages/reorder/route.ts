
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/authUtils';
import { z } from 'zod';

const reorderSchema = z.object({
  orderedItems: z.array(z.object({
    id: z.string(),
    order: z.number(),
  })),
});

export async function POST(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validation = reorderSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', issues: validation.error.issues }, { status: 400 });
    }

    const { orderedItems } = validation.data;

    const updates = orderedItems.map(item =>
      prisma.journalPage.update({
        where: { id: item.id },
        data: { order: item.order },
      })
    );

    await prisma.$transaction(updates);

    return NextResponse.json({ message: 'Order updated successfully' }, { status: 200 });

  } catch (error) {
    console.error(`Error reordering journal pages:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
