
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface FooterLinkData {
  label: string;
  href: string;
  target?: string;
}

interface FooterContent {
  authorLinks: FooterLinkData[];
  reviewerLinks: FooterLinkData[];
  quickLinks: FooterLinkData[];
  contactPhone?: string;
  contactAddress?: string;
  contactEmail?: string;
}

const defaultContent: FooterContent = {
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

export async function GET(request: NextRequest) {
    try {
        const page = await prisma.sitePage.findUnique({ where: { slug: 'footer-settings' } });
        // If no specific settings are saved in the DB, return the hardcoded defaults
        if (!page || typeof page.content !== 'object' || page.content === null) {
            return NextResponse.json(defaultContent);
        }
        // If settings exist, return them directly.
        return NextResponse.json(page.content);
    } catch (error) {
        console.error("Error fetching public footer content:", error);
        // Fallback to default content on any DB error
        return NextResponse.json(defaultContent);
    }
}
