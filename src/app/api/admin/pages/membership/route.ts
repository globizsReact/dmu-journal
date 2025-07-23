
'use server';
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

const PAGE_SLUG = 'membership';

// GET the 'Membership' page content
export async function GET(request: NextRequest) {
  if (!await checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const page = await prisma.sitePage.findUnique({ where: { slug: PAGE_SLUG } });
    if (!page) {
      // Return a default structure if it doesn't exist yet
      return NextResponse.json({
          slug: PAGE_SLUG,
          title: 'Membership',
          content: { type: 'doc', content: [{ type: 'paragraph' }] },
          coverImagePath: null,
          coverImageHint: null,
      });
    }
    return NextResponse.json(page);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (upsert) the 'Membership' page content
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

    const { title, content, coverImagePath, coverImageHint } = validation.data;

    const updatedPage = await prisma.sitePage.upsert({
      where: { slug: PAGE_SLUG },
      update: { title, content, coverImagePath, coverImageHint },
      create: { slug: PAGE_SLUG, title, content, coverImagePath, coverImageHint },
    });

    return NextResponse.json(updatedPage);
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
