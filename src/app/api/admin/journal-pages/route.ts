
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/authUtils';
import { z } from 'zod';
import { getPlainTextFromTiptapJson } from '@/lib/tiptapUtils';

const pageSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  content: z.any().refine((value) => {
    const text = getPlainTextFromTiptapJson(value);
    return text.length >= 10;
  }, { message: "Content must contain at least 10 characters of text." }),
  journalId: z.string(),
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

// GET all pages for a journal category
export async function GET(request: NextRequest) {
  if (!await checkAdminAuth(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  
  const { searchParams } = new URL(request.url);
  const journalCategoryId = searchParams.get('journalCategoryId');
  if (!journalCategoryId) return NextResponse.json({ error: 'journalCategoryId is required' }, { status: 400 });

  try {
    const pages = await prisma.journalPage.findMany({
      where: { journalCategoryId },
      orderBy: { order: 'asc' },
    });
    // Build a tree structure
    const pageMap = new Map(pages.map(p => [p.id, { ...p, children: [] }]));
    const rootPages: any[] = [];
    pages.forEach(p => {
      if (p.parentId && pageMap.has(p.parentId)) {
        pageMap.get(p.parentId)?.children.push(pageMap.get(p.id)!);
      } else {
        rootPages.push(pageMap.get(p.id)!);
      }
    });
    return NextResponse.json(rootPages);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new journal page
export async function POST(request: NextRequest) {
  const decoded = await checkAdminAuth(request);
  if (!decoded) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const body = await request.json();
    const validation = pageSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', issues: validation.error.issues }, { status: 400 });
    }

    const { title, content, journalId, parentId } = validation.data;
    const slug = createSlug(title);

    const existingPage = await prisma.journalPage.findUnique({ where: { journalCategoryId_slug: { journalCategoryId: journalId, slug } } });
    if (existingPage) {
      return NextResponse.json({ error: `A page with the slug '${slug}' already exists for this journal.` }, { status: 409 });
    }
    
    const maxOrder = await prisma.journalPage.aggregate({
        _max: { order: true },
        where: { journalCategoryId: journalId, parentId: parentId === 'none' ? null : parentId || null }
    });
    const newOrder = (maxOrder._max.order ?? -1) + 1;

    const newPage = await prisma.journalPage.create({
      data: {
        title,
        slug,
        content,
        order: newOrder,
        journalCategoryId: journalId,
        parentId: parentId === 'none' ? null : parentId || null,
      },
    });

    return NextResponse.json(newPage, { status: 201 });
  } catch (error: any) {
    console.error('Error creating journal page:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
