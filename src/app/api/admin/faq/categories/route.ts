
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/authUtils';
import { z } from 'zod';

const categorySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
});

export async function POST(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validation = categorySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', issues: validation.error.issues }, { status: 400 });
    }

    const { title } = validation.data;

    const maxOrderCategory = await prisma.faqCategory.findFirst({
      orderBy: { order: 'desc' },
    });
    const newOrder = (maxOrderCategory?.order ?? -1) + 1;

    const newCategory = await prisma.faqCategory.create({
      data: {
        title,
        order: newOrder,
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Error creating FAQ category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
