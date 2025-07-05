
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import JournalView from '@/components/journal/JournalView';
import type { JournalEntry, JournalCategory, PageWithChildren } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronDown, Download, MessageSquareQuote } from 'lucide-react';
import Image from 'next/image';
import LoadingJournalPage from './loading';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export default function JournalPage() {
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();

  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [category, setCategory] = useState<JournalCategory | null>(null);
  const [pages, setPages] = useState<PageWithChildren[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const menuLeaveTimeout = useRef<NodeJS.Timeout | null>(null);


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
      setPages(data.pages);
    } catch (err: any) {
      console.error(`Error fetching journal entry with ID ${id}:`, err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const handleIncrement = useCallback(async (type: 'views' | 'downloads' | 'citations') => {
    if (!id) return;

    setEntry(prev => prev ? { ...prev, [type]: (prev[type] || 0) + 1 } : null);
    
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
        setEntry(prev => prev ? { ...prev, [type]: (prev[type] || 0) - 1 } : null);
      }
    } catch (error) {
      console.error(`Failed to increment ${type} count`, error);
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
  
  useEffect(() => {
    if (id && !isLoading && entry) {
        const viewCounted = sessionStorage.getItem(`viewed_${id}`);
        if (!viewCounted) {
            handleIncrement('views');
            sessionStorage.setItem(`viewed_${id}`, 'true');
        }
    }
  }, [id, isLoading, entry, handleIncrement]);

  const handleMenuEnter = (pageId: string) => {
    if (menuLeaveTimeout.current) {
        clearTimeout(menuLeaveTimeout.current);
        menuLeaveTimeout.current = null;
    }
    setOpenDropdownId(pageId);
  };

  const handleMenuLeave = () => {
      menuLeaveTimeout.current = setTimeout(() => {
          setOpenDropdownId(null);
      }, 200); // 200ms delay to allow moving to dropdown content
  };

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

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <Header />

      <section className="relative py-16 md:py-20 text-primary-foreground bg-secondary">
        {category.imagePath && (
            <Image
                src={category.imagePath}
                alt={`${category.name} background`}
                fill
                sizes="100vw"
                className="object-cover absolute inset-0 z-0 opacity-30"
                data-ai-hint={category.imageHint}
                priority
            />
        )}
        <div className="absolute inset-0 bg-primary/70 z-0"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <p className="text-lg md:text-xl font-medium opacity-90">{category.name}</p>
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
        <div className="container mx-auto px-4">
          <div className="relative flex flex-wrap justify-center items-center py-1.5 gap-1">
            <Link href={`/category/${category.slug}`} className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors text-foreground hover:text-primary">
              Home
            </Link>
            {pages.map(page => {
                const hasChildren = page.children && page.children.length > 0;
                if (hasChildren) {
                    return (
                        <div
                            key={page.id}
                            className="group/menu relative"
                            onMouseEnter={() => handleMenuEnter(page.id)}
                            onMouseLeave={handleMenuLeave}
                        >
                            <DropdownMenu open={openDropdownId === page.id}>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                    variant="ghost"
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0",
                                        openDropdownId === page.id ? 'text-primary' : 'text-foreground hover:text-primary'
                                    )}
                                    >
                                        {page.title}
                                        <ChevronDown className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="start"
                                    sideOffset={0}
                                    className="w-auto min-w-[200px] whitespace-nowrap"
                                    onMouseEnter={() => handleMenuEnter(page.id)}
                                    onMouseLeave={handleMenuLeave}
                                >
                                    {page.children.map(child => (
                                        <DropdownMenuItem key={child.id} asChild className="cursor-pointer hover:bg-muted focus:bg-muted">
                                            <Link href={`/category/${category.slug}?page=${child.slug}`}>{child.title}</Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    );
                }
                return (
                    <Link key={page.id} href={`/category/${category.slug}?page=${page.slug}`} className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors text-foreground hover:text-primary">
                        {page.title}
                    </Link>
                );
            })}
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
