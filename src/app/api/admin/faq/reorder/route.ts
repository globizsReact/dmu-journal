
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/authUtils';
import { z } from 'zod';

const reorderSchema = z.object({
  type: z.enum(['category', 'item']),
  orderedIds: z.array(z.string()),
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

    const { type, orderedIds } = validation.data;

    let updates;
    if (type === 'category') {
        updates = orderedIds.map((id, index) =>
            prisma.faqCategory.update({ where: { id }, data: { order: index } })
        );
    } else { // type === 'item'
        updates = orderedIds.map((id, index) =>
            prisma.faqItem.update({ where: { id }, data: { order: index } })
        );
    }

    await prisma.$transaction(updates);

    return NextResponse.json({ message: 'Order updated successfully' }, { status: 200 });

  } catch (error) {
    console.error(`Error reordering ${body.type || 'items'}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
