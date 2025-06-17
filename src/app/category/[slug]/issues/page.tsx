
"use client";

import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import { getCategoryBySlug } from '@/lib/data';
import type { JournalCategory } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton'; // For a more detailed inline loading

export default function CategoryIssuesPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [category, setCategory] = useState<JournalCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const foundCategory = getCategoryBySlug(slug);
      setCategory(foundCategory || null);
      // Simulate a small delay for data fetching if needed, or remove if data is instant
      const timer = setTimeout(() => setIsLoading(false), 200); 
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [slug]);

  if (isLoading) {
    // Use the main loading.tsx for full page skeleton, this is a quick inline fallback
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
          <Skeleton className="h-10 w-48 mb-8" />
          <Skeleton className="h-12 w-2/3 mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-5 w-full" />
          </div>
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
          <p className="text-muted-foreground mb-6">The journal category for these issues could not be found.</p>
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
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <Button asChild variant="outline">
            <Link href={`/category/${slug}`} className="inline-flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to {category.name}
            </Link>
          </Button>
        </div>
        <h1 className="text-4xl font-headline font-bold text-primary mb-6">
          Journal Issues for {category.name}
        </h1>
        <div className="prose lg:prose-xl max-w-none font-body text-foreground/80 space-y-4">
          <p>
            This page will list all the past and current journal issues for the <strong>{category.name}</strong>.
            Each issue could be presented with its volume number, issue number, publication date, and a link to view
            the articles contained within that specific issue.
          </p>
          <p>
            Currently, detailed issue listings are under development. Please check back later for updates.
          </p>
          <p>
            Future enhancements could include:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>A searchable and filterable list of issues.</li>
            <li>Table of contents for each issue.</li>
            <li>Links to download full issues if available.</li>
            <li>Details of special issues or thematic collections.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
