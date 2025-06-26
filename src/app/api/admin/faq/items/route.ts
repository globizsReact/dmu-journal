
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/authUtils';
import { z } from 'zod';
import { getPlainTextFromTiptapJson } from '@/lib/tiptapUtils';

const itemSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters.'),
  answer: z.any().refine((value) => {
    const text = getPlainTextFromTiptapJson(value);
    return text.length >= 10;
  }, { message: "Answer must contain at least 10 characters of text." }),
  categoryId: z.string().min(1, 'Category is required.'),
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
    const validation = itemSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', issues: validation.error.issues }, { status: 400 });
    }

    const { question, answer, categoryId } = validation.data;

    const maxOrderItem = await prisma.faqItem.findFirst({
        where: { categoryId },
        orderBy: { order: 'desc' },
    });
    const newOrder = (maxOrderItem?.order ?? -1) + 1;

    const newItem = await prisma.faqItem.create({
      data: {
        question,
        answer,
        categoryId,
        order: newOrder,
      },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Error creating FAQ item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
