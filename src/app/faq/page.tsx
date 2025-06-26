
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TiptapRenderer from '@/components/shared/TiptapRenderer';
import { Skeleton } from '@/components/ui/skeleton';
import { toPublicUrl } from '@/lib/urlUtils';

interface FaqItem {
  id: string;
  question: string;
  answer: any; // JSON for Tiptap
}

interface FaqCategory {
  id: string;
  title: string;
  items: FaqItem[];
}

interface PageSettings {
    coverImagePath?: string | null;
    coverImageHint?: string | null;
}

interface FaqPageData {
    pageSettings: PageSettings | null;
    faqData: FaqCategory[];
}

const metadataItems = [
  "Abbreviation: J. Biophys. Struct. Biol.",
  "Language: English",
  "ISSN: 2141-2200",
  "DOI: 10.5897/JBSB",
  "Start Year: 2009",
  "Published Articles: 25",
];

const SidebarLink = ({ children, href = "#" }: { children: React.ReactNode; href?: string }) => (
  <Link
    href={href}
    className="block py-2 px-3 text-foreground hover:bg-muted rounded-md transition-colors font-medium"
  >
    {children}
  </Link>
);

export default function FAQPage() {
  const [pageData, setPageData] = useState<FaqPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/public/faq');
        if (!response.ok) {
          throw new Error('Failed to load FAQs. Please try again later.');
        }
        const data = await response.json();
        setPageData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const heroImage = toPublicUrl(pageData?.pageSettings?.coverImagePath) || "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
  const heroImageHint = pageData?.pageSettings?.coverImageHint || "help desk";

  const renderContent = () => {
    if (isLoading) {
      // The loading.tsx file handles the initial server-side load.
      // This is a fallback for client-side state changes.
      return (
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          <aside className="w-full md:w-1/4 lg:w-1/5">
            <Skeleton className="h-7 w-2/3 mb-4 px-3" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" /> <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" /> <Skeleton className="h-8 w-full" />
            </div>
          </aside>
          <section className="w-full md:w-3/4 lg:w-4/5">
            {[...Array(2)].map((_, sectionIndex) => (
              <div key={sectionIndex} className="mb-10">
                <Skeleton className="h-8 md:h-9 w-1/3 mb-6" />
                <div className="space-y-3">
                  {[...Array(3)].map((_, itemIndex) => (
                    <Skeleton key={itemIndex} className="h-14 w-full rounded-lg" />
                  ))}
                </div>
              </div>
            ))}
          </section>
        </div>
      );
    }
    if (error) {
      return <div className="text-center py-10 text-destructive">{error}</div>;
    }
    if (!pageData || pageData.faqData.length === 0) {
        return <div className="text-center py-10 text-muted-foreground">No FAQs have been added yet.</div>;
    }
    return (
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            <aside className="w-full md:w-1/4 lg:w-1/5">
                <h2 className="text-xl font-headline font-semibold text-primary mb-4 px-3">Quick Links</h2>
                <nav className="space-y-1">
                <SidebarLink href="/journals">Journals</SidebarLink>
                <SidebarLink href="/about">About Us</SidebarLink>
                <SidebarLink href="#">Membership</SidebarLink>
                <SidebarLink href="#">Support Center</SidebarLink>
                </nav>
            </aside>
            <section className="w-full md:w-3/4 lg:w-4/5">
                {pageData.faqData.map((section) => (
                <div key={section.id} className="mb-10">
                    <h2 className="text-2xl md:text-3xl font-headline font-bold text-primary mb-6">
                    {section.title}
                    </h2>
                    <Accordion type="single" collapsible className="w-full space-y-3">
                    {section.items.map((item, index) => (
                        <AccordionItem key={item.id} value={`item-${section.id}-${index}`} className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
                        <AccordionTrigger className="px-6 py-4 text-left text-md font-medium text-foreground hover:bg-muted/50 transition-colors">
                            {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4 pt-0">
                           <TiptapRenderer jsonContent={item.answer} className="prose prose-sm max-w-none font-body text-foreground/80" />
                        </AccordionContent>
                        </AccordionItem>
                    ))}
                    </Accordion>
                </div>
                ))}
            </section>
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[350px] text-primary-foreground">
        <Image
          src={heroImage}
          alt="FAQ Background"
          fill
          sizes="100vw"
          className="absolute inset-0 z-0 object-cover"
          data-ai-hint={heroImageHint}
          priority
        />
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">
            FAQ
          </h1>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm md:text-base">
            {metadataItems.map((item, index) => (
              <span key={index} className="opacity-90">
                {item}
                {index < metadataItems.length - 1 && <span className="mx-1 hidden md:inline">|</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Sub-Navigation Bar */}
      <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 h-14 flex items-center justify-center">
          <div className="flex items-center space-x-4 md:space-x-6">
            <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Separator orientation="vertical" className="h-5 bg-border" />
            <Link href="/submit" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Call For Paper Submission For 2025
            </Link>
            <Separator orientation="vertical" className="h-5 bg-border hidden md:block" />
            <Link href="/journals" className="text-sm font-medium text-foreground hover:text-primary transition-colors hidden md:block">
              Journal Issues
            </Link>
            <Separator orientation="vertical" className="h-5 bg-border hidden md:block" />
             <Link href="/publication-policy" className="text-sm font-medium text-foreground hover:text-primary transition-colors hidden md:block">
              Publication
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        {renderContent()}
      </main>

      <Footer />
    </div>
  );
}
