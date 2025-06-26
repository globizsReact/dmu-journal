
'use server';
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/authUtils';
import { z } from 'zod';

const landingPageSchema = z.object({
  heroTitle: z.string().min(1),
  heroSubtitle: z.string().min(1),
  journalSectionTitle: z.string().min(1),
  journalSectionSubtitle: z.string().min(1),
});

async function checkAdminAuth(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== 'admin') return null;
  return decoded;
}

const PAGE_SLUG = 'landing-page';

const defaultContent = {
  heroTitle: "Accelerating Discovery",
  heroSubtitle: "By Embracing Open Access, Academic Journals Drives Faster Dissemination Of Rigorous And Impactful Research.",
  journalSectionTitle: "Dhanamanjuri University Journals Portal",
  journalSectionSubtitle: "Driven By Knowledge. Defined By Research."
};

// GET the 'Landing Page' content
export async function GET(request: NextRequest) {
  if (!await checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const page = await prisma.sitePage.findUnique({ where: { slug: PAGE_SLUG } });
    if (!page || typeof page.content !== 'object' || page.content === null) {
      return NextResponse.json(defaultContent);
    }
    return NextResponse.json({ ...defaultContent, ...page.content as any });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (upsert) the 'Landing Page' content
export async function PUT(request: NextRequest) {
  if (!await checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const body = await request.json();
    const validation = landingPageSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', issues: validation.error.issues }, { status: 400 });
    }

    const { heroTitle, heroSubtitle, journalSectionTitle, journalSectionSubtitle } = validation.data;
    const content = { heroTitle, heroSubtitle, journalSectionTitle, journalSectionSubtitle };

    const updatedPage = await prisma.sitePage.upsert({
      where: { slug: PAGE_SLUG },
      update: { content },
      create: { 
        slug: PAGE_SLUG, 
        title: 'Landing Page Content', // A descriptive title for the DB record
        content 
      },
    });

    return NextResponse.json(updatedPage.content);
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
