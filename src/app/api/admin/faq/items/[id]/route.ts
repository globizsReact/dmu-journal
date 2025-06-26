
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/authUtils';
import { z } from 'zod';
import { getPlainTextFromTiptapJson } from '@/lib/tiptapUtils';

const itemUpdateSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters.'),
  answer: z.any().refine((value) => {
    const text = getPlainTextFromTiptapJson(value);
    return text.length >= 10;
  }, { message: "Answer must contain at least 10 characters of text." }),
});

async function checkAdminAuth(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== 'admin') return null;
  return decoded;
}

// PUT (update) an item by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!await checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const body = await request.json();
    const validation = itemUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', issues: validation.error.issues }, { status: 400 });
    }

    const updatedItem = await prisma.faqItem.update({
      where: { id },
      data: validation.data,
    });
    return NextResponse.json(updatedItem);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE an item by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!await checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    await prisma.faqItem.delete({ where: { id } });
    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
