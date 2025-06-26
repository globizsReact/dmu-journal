
"use client"; 

import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import ArticleListItemCard from '@/components/category/ArticleListItemCard';
import ViewFilters from '@/components/category/ViewFilters';
import type { JournalCategory, JournalEntry } from '@/lib/types';
import { ArrowLeft, BookOpen, ChevronDown, FileText, Info, Loader2, Shield } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import TiptapRenderer from '@/components/shared/TiptapRenderer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PageWithChildren {
  id: string;
  title: string;
  slug: string;
  content: any;
  order: number;
  parentId: string | null;
  children: PageWithChildren[];
}

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const pageSlug = searchParams.get('page');

  const [category, setCategory] = useState<JournalCategory | null>(null);
  const [allCategoryJournals, setAllCategoryJournals] = useState<JournalEntry[]>([]);
  const [displayedEntries, setDisplayedEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<string>("Most Recent");
  const [pages, setPages] = useState<PageWithChildren[]>([]);

  const activePage = useMemo(() => {
    if (!pageSlug || pages.length === 0) return null;
    for (const page of pages) {
      if (page.slug === pageSlug) return page;
      const childPage = page.children.find(child => child.slug === pageSlug);
      if (childPage) return childPage;
    }
    return null;
  }, [pageSlug, pages]);


  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/public/category-page/${slug}`);
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Failed to fetch category data.');
        }
        const data: { category: JournalCategory; journals: JournalEntry[], pages: PageWithChildren[] } = await response.json();
        setCategory(data.category);
        setAllCategoryJournals(data.journals);
        setPages(data.pages);
      } catch (err: any) {
        console.error(`Error fetching data for slug ${slug}:`, err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  useEffect(() => {
    if (allCategoryJournals.length > 0) {
      let sortedJournals = [...allCategoryJournals];
      if (selectedView === "Most Recent") {
        sortedJournals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      } else if (selectedView === "Most View") {
        sortedJournals.sort((a, b) => (b.views || 0) - (a.views || 0));
      } else if (selectedView === "Most Shared") {
        sortedJournals.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
      }
      setDisplayedEntries(sortedJournals);
    } else {
      setDisplayedEntries([]);
    }
  }, [allCategoryJournals, selectedView]);

  useEffect(() => {
    if (!isLoading && !category && !error) {
      setError("Category not found.");
    }
  }, [isLoading, category, error]);

  const renderContent = () => {
    if (activePage) {
        return (
            <div className="py-8">
                 <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-6">
                    {activePage.title}
                </h2>
                <TiptapRenderer 
                    jsonContent={activePage.content}
                    className="prose lg:prose-xl max-w-none font-body text-foreground/80"
                />
            </div>
        );
    }
    // Default content (Article List)
    return (
        <>
            <section className="my-12">
              <h2 className="text-3xl font-headline text-primary mb-4">Scope Of The {category?.name}</h2>
              <TiptapRenderer
                jsonContent={category?.description}
                className="prose prose-sm sm:prose-base max-w-none font-body text-foreground/80"
              />
            </section>

            <ViewFilters selectedView={selectedView} onSelectView={setSelectedView} />
            
            <div className="space-y-8">
              {displayedEntries.length > 0 ? (
                displayedEntries.map((entry) => (
                  <ArticleListItemCard 
                    key={entry.id} 
                    entry={{...entry, imagePath: category?.imagePath, imageHint: category?.imageHint}}
                    categoryName={category?.name || ''}
                  />
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8 text-lg">No journal entries found for this category currently.</p>
              )}
            </div>

            <div className="mt-12 text-center">
                <Button asChild variant="outline">
                    <Link href="/" className="inline-flex items-center">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to All Journals
                    </Link>
                </Button>
            </div>
        </>
    );
  };
  
  if (isLoading || !category) {
    return <div className="flex flex-col min-h-screen">
      <Header />
      <section className="py-10 md:py-16 bg-secondary"><div className="container mx-auto px-4"><Skeleton className="h-6 w-1/4 mb-2" /><Skeleton className="h-10 md:h-12 w-3/4 md:w-1/2 mb-4" /></div></section>
      <nav className="bg-card border-b border-border sticky top-0 z-40 shadow-sm"><div className="container mx-auto px-4"><div className="flex flex-wrap justify-center md:justify-start items-center py-3 gap-4"><Skeleton className="h-8 w-20" />{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-8 w-24" />)}</div></div></nav>
      <main className="flex-1 container mx-auto px-4 py-8"><div className="flex justify-center items-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /><p className="ml-4 text-lg">Loading Category...</p></div></main>
      <Footer />
    </div>;
  }
  
  const categorySpecificBgColor = category.bgColor;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <section className={cn("py-10 md:py-16 text-secondary-foreground",!categorySpecificBgColor && "bg-secondary")} style={categorySpecificBgColor ? { backgroundColor: categorySpecificBgColor } : {}}>
        <div className="container mx-auto px-4 text-center md:text-left">
          <p className="text-lg font-medium opacity-90">Dhanamanjuri University</p>
          <h1 className="text-4xl md:text-5xl font-headline font-bold mt-1 mb-4">{category.name}</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm opacity-80">
            {category.abbreviation && <span>Abbreviation: {category.abbreviation}</span>}
            {category.language && <span>Language: {category.language}</span>}
            {category.issn && <span>ISSN: {category.issn}</span>}
            {category.doiBase && <span>DOI: {category.doiBase}</span>}
            {category.startYear && <span>Start Year: {category.startYear}</span>}
            {category.publishedArticlesCount && <span>Published Articles: {category.publishedArticlesCount}</span>}
          </div>
        </div>
      </section>

      {/* Dynamic Tab Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="relative flex flex-wrap justify-center md:justify-start items-center py-1.5 gap-1">
             <Link href={`/category/${slug}`} className={cn("flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors hover:text-primary", !pageSlug ? 'font-semibold text-primary' : 'text-foreground')}>Home</Link>
              {pages.map(page => {
                  const hasChildren = page.children.length > 0;
                  if (hasChildren) {
                      return (
                          <DropdownMenu key={page.id}>
                              <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className={cn("flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md", page.children.some(c => c.slug === pageSlug) ? 'font-semibold text-primary bg-muted' : 'text-foreground')}>
                                      {page.title}
                                      <ChevronDown className="w-4 h-4" />
                                  </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                  {page.children.map(child => (
                                      <DropdownMenuItem key={child.id} asChild>
                                          <Link href={`/category/${slug}?page=${child.slug}`}>{child.title}</Link>
                                      </DropdownMenuItem>
                                  ))}
                              </DropdownMenuContent>
                          </DropdownMenu>
                      );
                  }
                  return (
                      <Link key={page.id} href={`/category/${slug}?page=${page.slug}`} className={cn("flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors hover:text-primary", page.slug === pageSlug ? 'font-semibold text-primary' : 'text-foreground')}>{page.title}</Link>
                  );
              })}
          </div>
        </div>
      </nav>
      
      <main className="flex-1 container mx-auto px-4">
        {error ? (
          <div className="text-center py-10 text-destructive bg-destructive/10 rounded-lg"><h2 className="text-2xl font-bold mb-2">An Error Occurred</h2><p>{error}</p></div>
        ) : (
          renderContent()
        )}
      </main>

      {(category.displayIssn || category.copyrightYear) && (
        <section className="py-6 border-t border-border mt-12"><div className="container mx-auto px-4 text-center text-sm text-muted-foreground">{category.displayIssn && <p>{category.displayIssn}</p>}{category.copyrightYear && <p>&copy; {category.copyrightYear} DM University, All Rights Reserved.</p>}</div></section>
      )}
      <Footer />
    </div>
  );
}
