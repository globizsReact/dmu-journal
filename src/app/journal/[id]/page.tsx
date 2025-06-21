
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import JournalView from '@/components/journal/JournalView';
import type { JournalEntry, JournalCategory } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Info, FileText, Shield, Users, BookOpen } from 'lucide-react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import LoadingJournalPage from './loading'; // Import the skeleton component
import { useToast } from '@/hooks/use-toast';

export default function JournalPage() {
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();

  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [category, setCategory] = useState<JournalCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJournalData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/public/manuscripts/${id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch journal entry: ${response.status}`);
      }
      const data = await response.json();
      setEntry(data.manuscript);
      setCategory(data.category);
    } catch (err: any) {
      console.error(`Error fetching journal entry with ID ${id}:`, err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const handleIncrement = useCallback(async (type: 'views' | 'downloads' | 'citations') => {
    if (!id) return;

    // Optimistic UI update
    setEntry(prev => prev ? { ...prev, [type]: (prev[type] || 0) + 1 } : null);
    
    // Give user feedback for interactive clicks
    if (type === 'downloads') {
      toast({ title: "Downloading...", description: "Your PDF download will begin shortly (mock)." });
    }
    if (type === 'citations') {
      toast({ title: "Citation Copied", description: "Citation details copied to clipboard (mock)." });
    }

    try {
      const response = await fetch(`/api/public/manuscripts/${id}/increment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });
      if (!response.ok) {
        // Revert on API error
        setEntry(prev => prev ? { ...prev, [type]: (prev[type] || 0) - 1 } : null);
      }
    } catch (error) {
      console.error(`Failed to increment ${type} count`, error);
      // Revert on network error
      setEntry(prev => prev ? { ...prev, [type]: (prev[type] || 0) - 1 } : null);
    }
  }, [id, toast]);

  useEffect(() => {
    if (id) {
      fetchJournalData();
    } else {
        setIsLoading(false);
        setError("No journal ID provided in the URL.");
    }
  }, [id, fetchJournalData]);
  
  // Effect for incrementing view count
  useEffect(() => {
    if (id && !isLoading && entry) { // Ensure entry is loaded before trying to increment
        const viewCounted = sessionStorage.getItem(`viewed_${id}`);
        if (!viewCounted) {
            handleIncrement('views');
            sessionStorage.setItem(`viewed_${id}`, 'true');
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isLoading, entry]); // handleIncrement is memoized and safe


  if (isLoading) {
    return <LoadingJournalPage />; 
  }

  if (error || !entry || !category) {
     return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl font-headline text-destructive mb-4">
            {error ? 'An Error Occurred' : 'Journal Entry Not Found'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {error || 'The journal entry or its category could not be found.'}
          </p>
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

      <section className="relative py-16 md:py-20 text-primary-foreground bg-secondary">
        {category.imagePath && (
            <Image
                src={category.imagePath}
                alt={`${category.name} background`}
                fill
                style={{ objectFit: "cover" }}
                className="absolute inset-0 z-0 opacity-30"
                data-ai-hint={category.imageHint}
                priority
            />
        )}
        <div className="absolute inset-0 bg-primary/70 z-0"></div>
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
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <JournalView entry={entry} category={category} onIncrement={handleIncrement} />
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
