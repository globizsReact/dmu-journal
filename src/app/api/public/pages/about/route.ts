
'use server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const PAGE_SLUG = 'about-us';

export async function GET() {
  try {
    const page = await prisma.sitePage.findUnique({
      where: { slug: PAGE_SLUG },
    });

    if (!page) {
      // Provide a default fallback if the page hasn't been created in the admin panel yet
      return NextResponse.json({
        title: 'About Our Journal',
        content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Welcome to our about page. Content is being managed by an administrator.' }] }] },
        coverImagePath: null,
        coverImageHint: null,
      });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error(`Error fetching page with slug ${PAGE_SLUG}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
