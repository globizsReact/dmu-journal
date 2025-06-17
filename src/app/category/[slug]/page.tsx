"use client"; 

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import AlphabetFilter from '@/components/shared/AlphabetFilter';
import JournalList from '@/components/journal/JournalList';
import { getCategoryBySlug, getJournalsByCategoryId } from '@/lib/data';
import type { JournalCategory, JournalEntry } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [category, setCategory] = useState<JournalCategory | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const foundCategory = getCategoryBySlug(slug);
      if (foundCategory) {
        setCategory(foundCategory);
        const categoryJournals = getJournalsByCategoryId(foundCategory.id);
        setEntries(categoryJournals);
      } else {
        // Handle category not found, perhaps redirect or show a message
        console.error("Category not found");
      }
      setIsLoading(false);
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 text-center">
          <p className="text-xl text-muted-foreground">Loading journals...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl font-headline text-destructive mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-6">The journal category you're looking for doesn't exist.</p>
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

  const Icon = category.icon;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-12 text-center animate-fade-in">
          <Icon className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-5xl font-headline text-primary mb-3">{category.name}</h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto font-body">{category.description}</p>
        </div>
        
        <div className="animate-slide-in-up" style={{animationDelay: '0.2s'}}>
            <AlphabetFilter selectedLetter={selectedLetter} onSelectLetter={setSelectedLetter} />
        </div>
        
        <div className="animate-slide-in-up" style={{animationDelay: '0.4s'}}>
            <JournalList entries={entries} filterLetter={selectedLetter} />
        </div>

        <div className="mt-12 text-center animate-fade-in" style={{animationDelay: '0.6s'}}>
            <Button asChild variant="outline">
                <Link href="/" className="inline-flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to All Categories
                </Link>
            </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
