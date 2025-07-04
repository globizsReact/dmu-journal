
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

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
  authorLinks: [],
  reviewerLinks: [],
  quickLinks: [],
  contactPhone: "Loading...",
  contactAddress: "Loading...",
  contactEmail: "loading@example.com",
};

const FooterLink = ({ href, children, target }: { href: string; children: React.ReactNode, target?: string }) => (
  <Link href={href} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined} className="text-sm text-primary-foreground/80 hover:text-accent transition-colors">
    {children}
  </Link>
);

const FooterSkeleton = ({ className }: { className?: string }) => (
  <>
    <footer className={cn("py-10 md:py-16 px-4 md:px-8 bg-primary", className)}>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <Skeleton className="h-6 w-1/3 mb-4 bg-primary-foreground/20" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-2/3 bg-primary-foreground/20" />
                <Skeleton className="h-4 w-1/2 bg-primary-foreground/20" />
                <Skeleton className="h-4 w-3/4 bg-primary-foreground/20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
    <div className={cn("py-3 bg-black text-center text-xs text-gray-400", className)}>
       <Skeleton className="h-4 w-48 mx-auto bg-gray-600" />
    </div>
  </>
);


interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  const [content, setContent] = useState<FooterContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFooterContent = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/public/pages/footer');
        if (!response.ok) {
          console.error("Failed to fetch footer content, using defaults.");
          setContent(defaultContent);
          return;
        }
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error("Error fetching footer content:", error);
        setContent(defaultContent);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFooterContent();
  }, []);

  if (isLoading) {
    return <FooterSkeleton className={className} />;
  }

  const finalContent = content || defaultContent;

  return (
    <>
      <footer className={cn("py-10 md:py-16 px-4 md:px-8 bg-primary text-primary-foreground", className)}>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            
            <div>
              <h4 className="font-headline text-lg text-accent mb-3">AUTHOR</h4>
              <ul className="space-y-2">
                {finalContent.authorLinks.map(link => (
                  <li key={link.href}><FooterLink href={link.href} target={link.target}>{link.label}</FooterLink></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-headline text-lg text-accent mb-3">REVIEWERS</h4>
              <ul className="space-y-2">
                {finalContent.reviewerLinks.map(link => (
                  <li key={link.href}><FooterLink href={link.href} target={link.target}>{link.label}</FooterLink></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-headline text-lg text-accent mb-3">QUICK LINKS</h4>
              <ul className="space-y-2">
                {finalContent.quickLinks.map(link => (
                  <li key={link.href}><FooterLink href={link.href} target={link.target}>{link.label}</FooterLink></li>
                ))}
              </ul>
            </div>
            
            <div>
             <h4 className="font-headline text-lg text-accent mb-3">CONTACT</h4>
             {finalContent.contactPhone && <p className="text-sm text-primary-foreground/80">{finalContent.contactPhone}</p>}
             {finalContent.contactAddress && <p className="text-sm text-primary-foreground/80">{finalContent.contactAddress}</p>}
             {finalContent.contactEmail && <p className="text-sm text-primary-foreground/80">
               E-Mail: <a href={`mailto:${finalContent.contactEmail}`} className="hover:text-accent transition-colors underline">{finalContent.contactEmail}</a>
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
