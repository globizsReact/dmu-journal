
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, AlertTriangle } from 'lucide-react';
import TiptapRenderer from '@/components/shared/TiptapRenderer';
import { toPublicUrl } from '@/lib/urlUtils';

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

interface PageData {
    title: string;
    content: any; // JSON from Tiptap
    coverImagePath?: string | null;
    coverImageHint?: string | null;
}

export default function AboutUsPage() {
    const [pageData, setPageData] = useState<PageData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/public/pages/about');
                if (!response.ok) {
                    throw new Error('Failed to load content. Please try again later.');
                }
                const data = await response.json();
                setPageData(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContent();
    }, []);

  const heroImage = toPublicUrl(pageData?.coverImagePath) || "https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[350px] text-primary-foreground">
        <Image
          src={heroImage}
          alt={pageData?.coverImageHint || "About Us Background"}
          fill
          sizes="100vw"
          className="absolute inset-0 z-0 object-cover"
          data-ai-hint={pageData?.coverImageHint || "university campus"}
          priority
        />
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">
            About Us
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
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Separator orientation="vertical" className="h-5 bg-border" />
            <Link href="/submit" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Call For Paper Submission For 2025
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Left Sidebar */}
          <aside className="w-full md:w-1/4 lg:w-1/5">
            <h2 className="text-xl font-headline font-semibold text-primary mb-4 px-3">About Us</h2>
            <nav className="space-y-1">
              <SidebarLink href="#">About Us</SidebarLink>
              <SidebarLink href="#">Membership</SidebarLink>
              <SidebarLink href="#">Support Center</SidebarLink>
            </nav>
          </aside>

          {/* Right Content Pane */}
          <section className="w-full md:w-3/4 lg:w-4/5">
            {isLoading && (
                 <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                 </div>
            )}
            {error && (
                <div className="text-center py-10 bg-destructive/10 text-destructive rounded-lg px-4">
                    <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
                    <p className="font-semibold">Failed to load content</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}
            {!isLoading && !error && pageData && (
                <>
                    <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-6">
                        {pageData.title}
                    </h2>
                    <TiptapRenderer 
                        jsonContent={pageData.content} 
                        className="prose prose-sm sm:prose-base max-w-none font-body text-foreground/80"
                    />
                </>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
