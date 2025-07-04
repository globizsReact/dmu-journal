
import { NextResponse } from 'next/server';
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
    { label: "Dr. PH Parmila Devi", href: "/author/ph-parmila-devi" },
    { label: "Dr. Sangeeta Kumari", href: "/author/sangeeta-kumari" },
  ],
  reviewerLinks: [
    { label: "Reviewers Guidelines", href: "/reviewers-guidelines" },
    { label: "Peer Review", href: "/peer-review" },
  ],
  quickLinks: [
    { label: "Dhanamanjuri University", href: "https://dmu.ac.in/", target: "_blank" },
    { label: "Manipur University", href: "https://manipuruniv.ac.in/", target: "_blank" },
    { label: "University Grants Commission (UGC)", href: "https://www.ugc.gov.in/", target: "_blank" },
  ],
  contactPhone: "98561 - 98561",
  contactAddress: "Thangmeiband, Imphal West, 795001",
  contactEmail: "Dmcollege_science@Yahoo.Co.In",
};


export async function GET() {
  try {
    const pageData = await prisma.sitePage.findUnique({
      where: { slug: 'footer-settings' },
    });
    if (pageData && typeof pageData.content === 'object' && pageData.content) {
      const content = { ...defaultContent, ...(pageData.content as Partial<FooterContent>) };
      return NextResponse.json(content);
    }
    return NextResponse.json(defaultContent);
  } catch (error) {
    console.error("Failed to fetch footer content:", error);
    // Return default content on error to avoid breaking the site
    return NextResponse.json(defaultContent, { status: 500, statusText: "Internal Server Error" });
  }
}
