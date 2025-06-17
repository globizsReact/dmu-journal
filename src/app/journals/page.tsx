
"use client";

import { useState, useMemo } from 'react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import AlphabetFilter from '@/components/shared/AlphabetFilter';
import SubjectBrowseItem from '@/components/journals/SubjectBrowseItem';
import { journalCategories, journalEntries } from '@/lib/data';
import type { JournalEntry } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { ChevronRight } from 'lucide-react';

const metadataLine = "Abbreviation: J. Biophys. Struct. Biol. Language: English ISSN: 2141-2200 DOI: 10.5897/JBSB Start Year: 2009 Published Articles: 25";

export default function AllJournalsPage() {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const groupedJournals = useMemo(() => {
    const groups: Record<string, JournalEntry[]> = {};
    const filtered = selectedLetter
      ? journalEntries.filter(entry => entry.title.toUpperCase().startsWith(selectedLetter))
      : journalEntries;

    filtered.forEach(entry => {
      const firstLetter = entry.title.charAt(0).toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(entry);
    });
    return groups;
  }, [selectedLetter]);

  const sortedGroupKeys = Object.keys(groupedJournals).sort();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[350px] text-primary-foreground">
        <Image
          src="https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Journals Background"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
          data-ai-hint="university campus library"
          priority
        />
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">
            Journals
          </h1>
          <p className="text-sm md:text-base opacity-90 max-w-3xl">
            {metadataLine}
          </p>
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
            <div className="bg-card p-4 rounded-lg shadow">
              <h2 className="text-xl font-headline font-semibold text-primary mb-3">Browse By Subject</h2>
              <Link
                href="/journals"
                className="block py-2 px-3 text-sm text-foreground hover:bg-muted rounded-md transition-colors font-medium mb-2"
                onClick={() => setSelectedLetter(null)}
              >
                Lists All Journals
              </Link>
              <Separator className="mb-2"/>
              <nav className="space-y-1">
                {journalCategories.map(category => (
                  <SubjectBrowseItem key={category.id} category={category} />
                ))}
              </nav>
            </div>
          </aside>

          {/* Right Content Pane */}
          <section className="w-full md:w-3/4 lg:w-4/5">
            <h2 className="text-2xl md:text-3xl font-headline font-bold text-primary mb-6">
              Journals By Title
            </h2>
            <AlphabetFilter selectedLetter={selectedLetter} onSelectLetter={setSelectedLetter} />
            
            {sortedGroupKeys.length > 0 ? (
              sortedGroupKeys.map(letter => (
                <div key={letter} className="mb-8">
                  <h3 className="text-2xl font-headline font-semibold text-primary/80 mb-4 pb-2 border-b border-border">
                    {letter}
                  </h3>
                  <ul className="space-y-3">
                    {groupedJournals[letter].map(entry => (
                      <li key={entry.id} className="text-foreground/80 hover:text-primary transition-colors">
                        <Link href={`/journal/${entry.id}`} className="flex items-center group">
                           <ChevronRight className="w-4 h-4 text-muted-foreground mr-2 group-hover:text-primary transition-colors shrink-0" />
                           <span className="font-body">{entry.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8 text-lg">
                No journals found for the selected filter.
              </p>
            )}
            {selectedLetter && sortedGroupKeys.length === 0 && (
                 <p className="text-center text-muted-foreground py-8 text-lg">
                    No journals starting with the letter &quot;{selectedLetter}&quot; found.
                </p>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
