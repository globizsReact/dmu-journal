
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import JournalView from '@/components/journal/JournalView';
import { getJournalById, getCategoryBySlug, journalCategories } from '@/lib/data';
import type { JournalEntry, JournalCategory } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Info, FileText, Shield, Users, BookOpen, LayoutList } from 'lucide-react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

export default function JournalPage() {
  const params = useParams();
  const id = params.id as string;

  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [category, setCategory] = useState<JournalCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundEntry = getJournalById(id);
      if (foundEntry) {
        setEntry(foundEntry);
        const foundCategory = journalCategories.find(cat => cat.id === foundEntry.categoryId);
        setCategory(foundCategory || null);
      } else {
        console.error("Journal entry not found");
      }
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) {
    // Delegate to loading.tsx
    return null; 
  }

  if (!entry || !category) {
     return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl font-headline text-destructive mb-4">Journal Entry or Category Not Found</h1>
          <p className="text-muted-foreground mb-6">The journal entry or its category could not be found.</p>
          <Button asChild>
            <Link href="/" className="flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 mr-2" /> Go Back to Home
            </Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }
  
  const subNavItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "About DMUJ", href: "/about-dmuj", icon: Info },
    { label: "Publication Policy", href: "/publication-policy", icon: FileText },
    { label: "Ethics Policy", href: "/ethics-policy", icon: Shield },
    { label: "Authors Section", href: "/authors-section", icon: Users },
    { label: "Journal Issues", href: `/category/${category.slug}/issues`, icon: BookOpen },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 md:py-20 text-primary-foreground bg-secondary">
        {category.imagePath && (
            <Image
                src={category.imagePath}
                alt={`${category.name} background`}
                layout="fill"
                objectFit="cover"
                className="absolute inset-0 z-0 opacity-30"
                data-ai-hint={category.imageHint}
            />
        )}
        <div className="absolute inset-0 bg-primary/70 z-0"></div> {/* Dark overlay */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <p className="text-lg md:text-xl font-medium opacity-90">Journal Of {category.name}</p>
          <h1 className="text-3xl md:text-5xl font-headline font-bold mt-2 mb-3 text-white">
            {entry.title}
          </h1>
          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs md:text-sm opacity-80">
            {category.abbreviation && <span>Abbreviation: {category.abbreviation}</span>}
            {category.language && <span>Language: {category.language}</span>}
            {category.issn && <span>ISSN: {category.issn}</span>}
            {category.doiBase && <span>DOI: {category.doiBase}</span>}
            {category.startYear && <span>Start Year: {category.startYear}</span>}
            {category.publishedArticlesCount && <span>Published Articles: {category.publishedArticlesCount}</span>}
          </div>
        </div>
      </section>

      {/* Sub-Navigation Bar */}
      <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 h-14">
          <div className="flex items-center justify-center h-full overflow-x-auto whitespace-nowrap">
            {subNavItems.map((item, index) => (
              <React.Fragment key={item.label}>
                <Link
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
                {index < subNavItems.length - 1 && (
                  <Separator orientation="vertical" className="h-4 bg-border/70" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </nav>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <JournalView entry={entry} category={category} />
         <div className="mt-12 text-center">
            <Button asChild variant="outline">
                <Link href={`/category/${category.slug}`} className="inline-flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-2" /> 
                    Back to {category.name}
                </Link>
            </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
