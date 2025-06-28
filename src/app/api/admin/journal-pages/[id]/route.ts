
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/authUtils';
import { z } from 'zod';
import { getPlainTextFromTiptapJson } from '@/lib/tiptapUtils';

const pageUpdateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  pageType: z.enum(['RICH_TEXT', 'TABLE', 'EDITORIAL_BOARD']),
  content: z.any(),
  parentId: z.string().optional(),
});

function createSlug(name: string): string {
    return name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

async function checkAdminAuth(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== 'admin') return null;
  return decoded;
}

// GET a single page by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  if (!await checkAdminAuth(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const page = await prisma.journalPage.findUnique({ where: { id: params.id } });
    if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    return NextResponse.json(page);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (update) a page by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!await checkAdminAuth(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const body = await request.json();
    const validation = pageUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', issues: validation.error.issues }, { status: 400 });
    }
    const { title, content, pageType, parentId } = validation.data;
    const slug = createSlug(title);

    const currentPage = await prisma.journalPage.findUnique({ where: { id: params.id }});
    if (!currentPage) return NextResponse.json({ error: 'Page not found' }, { status: 404 });

    const existingPage = await prisma.journalPage.findUnique({ where: { journalCategoryId_slug: { journalCategoryId: currentPage.journalCategoryId, slug } } });
    if (existingPage && existingPage.id !== params.id) {
      return NextResponse.json({ error: `A page with the slug '${slug}' already exists for this journal.` }, { status: 409 });
    }

    const updatedPage = await prisma.journalPage.update({
      where: { id: params.id },
      data: { 
        title, 
        slug, 
        content,
        pageType, 
        parentId: parentId === 'none' ? null : parentId || null 
      },
    });
    return NextResponse.json(updatedPage);
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

// DELETE a page by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!await checkAdminAuth(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const childrenCount = await prisma.journalPage.count({ where: { parentId: params.id } });
    if (childrenCount > 0) {
      return NextResponse.json({ error: 'Cannot delete a page with sub-pages. Please delete or move the sub-pages first.' }, { status: 409 });
    }
    
    await prisma.journalPage.delete({ where: { id: params.id } });
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    if (error.code === 'P2025') return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
