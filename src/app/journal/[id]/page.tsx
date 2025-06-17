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
import { ArrowLeft } from 'lucide-react';

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
        if (foundCategory) {
          setCategory(foundCategory);
        }
      } else {
        console.error("Journal entry not found");
      }
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 text-center">
          <p className="text-xl text-muted-foreground">Loading journal entry...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!entry) {
     return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl font-headline text-destructive mb-4">Journal Entry Not Found</h1>
          <p className="text-muted-foreground mb-6">The journal entry you're looking for doesn't exist.</p>
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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <JournalView entry={entry} category={category || undefined} />
        <div className="mt-12 text-center animate-fade-in" style={{animationDelay: '0.2s'}}>
            <Button asChild variant="outline">
                <Link href={category ? `/category/${category.slug}` : "/"} className="inline-flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-2" /> 
                    Back to {category ? category.name : "Journals"}
                </Link>
            </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
