
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
    { label: "All Authors", href: "/authors" },
    { label: "Dhanamanjuri University", href: "https://dmu.ac.in/", target: "_blank" },
    { label: "Manipur University", href: "https://manipuruniv.ac.in/", target: "_blank" },
  ],
  contactPhone: "98561 - 98561",
  contactAddress: "Thangmeiband, Imphal West, 795001",
  contactEmail: "Dmcollege_science@Yahoo.Co.In",
};


// GET the footer settings
export async function GET(request: NextRequest) {
  try {
    const page = await prisma.sitePage.findUnique({ where: { slug: PAGE_SLUG } });
    if (!page || typeof page.content !== 'object' || page.content === null) {
      return NextResponse.json(defaultContent);
    }
    return NextResponse.json(page.content);
  } catch (error) {
    console.error("Error fetching footer settings:", error);
    // On error, still return default content so the site doesn't break
    return NextResponse.json(defaultContent);
  }
}
