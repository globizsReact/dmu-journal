
'use server';
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/authUtils';
import { z } from 'zod';

const pageSchema = z.object({
  coverImagePath: z.string().optional(),
  coverImageHint: z.string().optional(),
});

async function checkAdminAuth(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== 'admin') return null;
  return decoded;
}

const PAGE_SLUG = 'faq';

// GET the 'FAQ' page content
export async function GET(request: NextRequest) {
  if (!await checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const page = await prisma.sitePage.findUnique({ where: { slug: PAGE_SLUG } });
    if (!page) {
      return NextResponse.json({
          slug: PAGE_SLUG,
          title: 'FAQ',
          content: {}, // FAQ content is stored elsewhere
          coverImagePath: null,
          coverImageHint: null,
      });
    }
    return NextResponse.json(page);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (upsert) the 'FAQ' page content
export async function PUT(request: NextRequest) {
  if (!await checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const body = await request.json();
    const validation = pageSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', issues: validation.error.issues }, { status: 400 });
    }

    const { coverImagePath, coverImageHint } = validation.data;

    const updatedPage = await prisma.sitePage.upsert({
      where: { slug: PAGE_SLUG },
      update: { coverImagePath, coverImageHint },
      create: { 
        slug: PAGE_SLUG, 
        title: 'FAQ Page Settings', 
        content: {}, // FAQ content is managed separately
        coverImagePath, 
        coverImageHint 
      },
    });

    return NextResponse.json(updatedPage);
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
