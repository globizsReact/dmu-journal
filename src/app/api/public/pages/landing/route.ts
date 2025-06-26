
'use server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const PAGE_SLUG = 'landing-page';

const defaultContent = {
  heroTitle: "Accelerating Discovery",
  heroSubtitle: "By Embracing Open Access, Academic Journals Drives Faster Dissemination Of Rigorous And Impactful Research.",
  journalSectionTitle: "Dhanamanjuri University Journals Portal",
  journalSectionSubtitle: "Driven By Knowledge. Defined By Research."
};

// GET the 'Landing Page' content
export async function GET(request: Request) {
  try {
    const page = await prisma.sitePage.findUnique({ where: { slug: PAGE_SLUG } });
    if (!page || typeof page.content !== 'object' || page.content === null) {
      return NextResponse.json(defaultContent);
    }
    // Merge with defaults to ensure all keys are present even if DB is partially filled
    return NextResponse.json({ ...defaultContent, ...page.content as any });
  } catch (error) {
    console.error("Public API - Failed to fetch landing page content:", error);
    // Return default content on error to prevent site crash
    return NextResponse.json(defaultContent);
  }
}
