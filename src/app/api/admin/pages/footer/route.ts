
'use server';
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/authUtils';
import { z } from 'zod';

const linkSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  href: z.string().min(1, 'URL is required'),
  target: z.string().optional(),
});

const footerSchema = z.object({
  authorLinks: z.array(linkSchema),
  reviewerLinks: z.array(linkSchema),
  quickLinks: z.array(linkSchema),
  contactPhone: z.string().optional(),
  contactAddress: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal('')),
});

async function checkAdminAuth(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== 'admin') return null;
  return decoded;
}

const PAGE_SLUG = 'footer-settings';

const defaultContent = {
  authorLinks: [
    { label: "Dr. Sanatomba Meitei", href: "/author/sanatomba-meitei" },
    { label: "Dr. Aribam Vishaal Sharma", href: "/author/aribam-vishaal-sharma" },
  ],
  reviewerLinks: [
    { label: "Reviewers Guidelines", href: "/reviewers-guidelines" },
    { label: "Peer Review", href: "/peer-review" },
  ],
  quickLinks: [
    { label: "Dhanamanjuri University", href: "https://dmu.ac.in/", target: "_blank" },
    { label: "Manipur University", href: "https://manipuruniv.ac.in/", target: "_blank" },
  ],
  contactPhone: "98561 - 98561",
  contactAddress: "Thangmeiband, Imphal West, 795001",
  contactEmail: "Dmcollege_science@Yahoo.Co.In",
};


// GET the footer settings
export async function GET(request: NextRequest) {
  if (!await checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const page = await prisma.sitePage.findUnique({ where: { slug: PAGE_SLUG } });
    if (!page || typeof page.content !== 'object' || page.content === null) {
      return NextResponse.json(defaultContent);
    }
    return NextResponse.json({ ...defaultContent, ...(page.content as object) });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (upsert) the footer settings
export async function PUT(request: NextRequest) {
  if (!await checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const body = await request.json();
    const validation = footerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', issues: validation.error.issues }, { status: 400 });
    }

    const updatedPage = await prisma.sitePage.upsert({
      where: { slug: PAGE_SLUG },
      update: { content: validation.data },
      create: { 
        slug: PAGE_SLUG, 
        title: 'Footer Settings',
        content: validation.data,
      },
    });

    return NextResponse.json(updatedPage.content);
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
