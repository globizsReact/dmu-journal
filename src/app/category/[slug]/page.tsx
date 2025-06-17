
"use client"; 

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import ArticleListItemCard from '@/components/category/ArticleListItemCard';
import ViewFilters from '@/components/category/ViewFilters';
import { getCategoryBySlug, getJournalsByCategoryId } from '@/lib/data';
import type { JournalCategory, JournalEntry } from '@/lib/types';
import { ArrowLeft, Home, Info, FileText, Shield, Users, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const SubNavItem = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) => (
  <Link href={href} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors">
    <Icon className="w-4 h-4" />
    {label}
  </Link>
);


export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [category, setCategory] = useState<JournalCategory | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<string | null>("Most Recent"); // Default view

  useEffect(() => {
    if (slug) {
      const foundCategory = getCategoryBySlug(slug);
      if (foundCategory) {
        setCategory(foundCategory);
        const categoryJournals = getJournalsByCategoryId(foundCategory.id);
        // Add sorting logic here based on selectedView if implementing full functionality
        setEntries(categoryJournals);
      } else {
        console.error("Category not found");
      }
      setIsLoading(false);
    }
  }, [slug]);

  if (isLoading) {
    // You might want to create a more detailed skeleton loader matching the new layout
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 text-center">
          <p className="text-xl text-muted-foreground">Loading journal category...</p>
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

  const CategoryIcon = category.icon;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      {/* Hero/Title Section */}
      <section className="py-10 md:py-16 bg-secondary text-secondary-foreground">
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

      {/* Sub-Navigation Bar */}
      <nav className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center md:justify-start items-center py-2 gap-1">
            <SubNavItem href="/" icon={Home} label="Home" />
            <SubNavItem href="/about-dmuj" icon={Info} label="About DMUJ" />
            <SubNavItem href="/publication-policy" icon={FileText} label="Publication Policy" />
            <SubNavItem href="/ethics-policy" icon={Shield} label="Ethics Policy" />
            <SubNavItem href="/authors-section" icon={Users} label="Authors Section" />
            <SubNavItem href={`/category/${category.slug}/issues`} icon={BookOpen} label="Journal Issues" />
          </div>
        </div>
      </nav>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Scope Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-headline text-primary mb-4">Scope Of The {category.name}</h2>
          {category.scope?.introduction && <p className="text-foreground/80 mb-4 font-body">{category.scope.introduction}</p>}
          {category.scope?.topics && category.scope.topics.length > 0 && (
            <ul className="list-disc list-inside space-y-1 mb-4 font-body text-foreground/80 pl-4">
              {category.scope.topics.map(topic => <li key={topic}>{topic}</li>)}
            </ul>
          )}
          {category.scope?.conclusion && <p className="text-foreground/80 font-body">{category.scope.conclusion}</p>}
          {!category.scope && <p className="text-foreground/80 font-body">{category.description}</p>}
        </section>

        <ViewFilters selectedView={selectedView} onSelectView={setSelectedView} />
        
        <div className="space-y-8">
          {entries.length > 0 ? (
            entries.map((entry) => (
              <ArticleListItemCard 
                key={entry.id} 
                entry={entry} 
                categoryName={category.name}
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
      </main>

      {/* ISSN and Copyright Section */}
      {(category.displayIssn || category.copyrightYear) && (
        <section className="py-6 border-t border-border mt-12">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            {category.displayIssn && <p>{category.displayIssn}</p>}
            {category.copyrightYear && <p>&copy; {category.copyrightYear} DM University, All Rights Reserved.</p>}
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
}
