
import Link from 'next/link';
import { cn } from '@/lib/utils';
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

async function getFooterContent(): Promise<FooterContent> {
  try {
    const pageData = await prisma.sitePage.findUnique({
      where: { slug: 'footer-settings' },
    });
    if (pageData && typeof pageData.content === 'object' && pageData.content) {
      // Merge with defaults to ensure all keys are present
      return { ...defaultContent, ...(pageData.content as Partial<FooterContent>) };
    }
    return defaultContent;
  } catch (error) {
    console.error("Failed to fetch footer content:", error);
    return defaultContent; // Return default content on error
  }
}

const FooterLink = ({ href, children, target }: { href: string; children: React.ReactNode, target?: string }) => (
  <Link href={href} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined} className="text-sm text-primary-foreground/80 hover:text-accent transition-colors">
    {children}
  </Link>
);

interface FooterProps {
  className?: string;
}

export default async function Footer({ className }: FooterProps) {
  const content = await getFooterContent();

  return (
    <>
      <footer className={cn("py-10 md:py-16 px-4 md:px-8 bg-primary text-primary-foreground", className)}>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            
            <div>
              <h4 className="font-headline text-lg text-accent mb-3">AUTHOR</h4>
              <ul className="space-y-2">
                {content.authorLinks.map(link => (
                  <li key={link.href}><FooterLink href={link.href} target={link.target}>{link.label}</FooterLink></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-headline text-lg text-accent mb-3">REVIEWERS</h4>
              <ul className="space-y-2">
                {content.reviewerLinks.map(link => (
                  <li key={link.href}><FooterLink href={link.href} target={link.target}>{link.label}</FooterLink></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-headline text-lg text-accent mb-3">QUICK LINKS</h4>
              <ul className="space-y-2">
                {content.quickLinks.map(link => (
                  <li key={link.href}><FooterLink href={link.href} target={link.target}>{link.label}</FooterLink></li>
                ))}
              </ul>
            </div>
            
            <div>
             <h4 className="font-headline text-lg text-accent mb-3">CONTACT</h4>
             {content.contactPhone && <p className="text-sm text-primary-foreground/80">{content.contactPhone}</p>}
             {content.contactAddress && <p className="text-sm text-primary-foreground/80">{content.contactAddress}</p>}
             {content.contactEmail && <p className="text-sm text-primary-foreground/80">
               E-Mail: <a href={`mailto:${content.contactEmail}`} className="hover:text-accent transition-colors underline">{content.contactEmail}</a>
             </p>}
           </div>
          </div>
        </div>
      </footer>
      <div className={cn("py-3 bg-black text-center text-xs text-gray-400", className)}>
        <p>Design &amp; Developed By: <Link href="https://globizs.com/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Globizs</Link></p>
      </div>
    </>
  );
};
