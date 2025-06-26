
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/authUtils';
import { z } from 'zod';

const categoryUpdateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
});

async function checkAdminAuth(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== 'admin') return null;
  return decoded;
}

// PUT (update) a category by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!await checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const body = await request.json();
    const validation = categoryUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', issues: validation.error.issues }, { status: 400 });
    }

    const updatedCategory = await prisma.faqCategory.update({
      where: { id },
      data: { title: validation.data.title },
    });
    return NextResponse.json(updatedCategory);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a category by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!await checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    // Prisma cascading delete will handle deleting related FaqItems
    await prisma.faqCategory.delete({ where: { id } });
    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
