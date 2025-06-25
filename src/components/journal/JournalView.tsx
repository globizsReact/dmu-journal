
import React from 'react';
import type { JournalEntry, JournalCategory } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Eye, Download, MessageSquareQuote, FileText, Users, ListOrdered, BarChart3 } from 'lucide-react';
import { Button } from '../ui/button';
import TiptapRenderer from '../shared/TiptapRenderer';

interface StatItemProps {
  icon: React.ElementType;
  label: string;
  value?: number | string;
}

const StatItem: React.FC<StatItemProps> = ({ icon: Icon, label, value }) => (
  <div className="text-center md:text-left">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-2xl font-bold text-primary">{value ?? 0}</p>
  </div>
);

interface JournalViewProps {
  entry: JournalEntry;
  category: JournalCategory;
  onIncrement: (type: 'views' | 'downloads' | 'citations') => void;
}

const JournalView = ({ entry, category, onIncrement }: JournalViewProps) => {
  const copyrightText = `Copyright © ${new Date().getFullYear()} Author(S) Retain The Copyright Of This Article. This Article Is Published Under The Terms Of The University`;

  const actionLinks = [
    { label: "Full Text PDF", action: () => onIncrement('downloads'), icon: FileText },
    { label: "Authors", href: "#authors", icon: Users },
    { label: "Articles", href: `/category/${category.slug}`, icon: ListOrdered },
    { label: "Citations", action: () => onIncrement('citations'), icon: MessageSquareQuote },
    { label: "Article Metrics", href: "#metrics", icon: BarChart3 },
  ];

  const displayImagePath = entry.thumbnailImagePath || category.imagePath;
  const displayImageHint = entry.thumbnailImageHint || category.imageHint;

  return (
    <>
      {entry.articleType && (
        <Badge variant="secondary" className="mb-6 text-sm py-1 px-3">
          {entry.articleType}
        </Badge>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Sidebar - Stats */}
        <aside className="w-full md:w-24 lg:w-28 flex-shrink-0 flex flex-row justify-center items-center space-x-4 md:flex-col md:items-start md:space-y-6 md:space-x-0">
          <StatItem icon={Eye} label="Views" value={entry.views} />
          <StatItem icon={Download} label="Downloads" value={entry.downloads} />
          <StatItem icon={MessageSquareQuote} label="Citations" value={entry.citations} />
        </aside>

        {/* Right Main Content - Article Details */}
        <section className="w-full md:flex-1">
          <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-stretch'>
            <div className="w-full sm:w-2/3">
              <h1 className="text-2xl md:text-3xl font-headline font-bold text-primary mb-2">
                {entry.title}
              </h1>
              <p className="text-sm text-muted-foreground mb-1">
                Article Number - {entry.id}
              </p>
              <p className="text-md font-medium text-primary/80 mb-3">
                Journal Of {category.name}
              </p>
              <div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {copyrightText}
                </p>
              </div>
            </div>

            {displayImagePath && (
              <div className="w-full mt-4 sm:mt-0 sm:w-1/3 flex-shrink-0 flex flex-col">
                <div className="relative h-[180px] sm:h-full overflow-hidden border flex-grow">
                  <Image
                    src={displayImagePath}
                    alt={`Thumbnail for ${entry.title}`}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={displayImageHint || "research graph"}
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Action Bar */}
      <div className="my-8 py-3 bg-primary/90 text-primary-foreground rounded-md">
        <div className="container mx-auto px-2">
            <div className="flex flex-wrap items-center justify-center md:justify-around gap-x-3 gap-y-2">
                {actionLinks.map((link, index) => (
                <React.Fragment key={link.label}>
                    {link.action ? (
                      <Button
                        onClick={link.action}
                        variant="ghost"
                        className="text-sm font-medium hover:bg-primary/80 hover:text-accent h-auto px-2 py-1 flex items-center gap-1"
                      >
                        {link.label}
                      </Button>
                    ) : (
                      <Link
                        href={link.href || '#'}
                        className="text-sm font-medium hover:text-accent transition-colors px-2 py-1 flex items-center gap-1"
                      >
                        {link.label}
                      </Link>
                    )}
                    {index < actionLinks.length - 1 && (
                    <Separator orientation="vertical" className="h-4 bg-primary-foreground/30 hidden md:block" />
                    )}
                </React.Fragment>
                ))}
            </div>
        </div>
      </div>

      {/* Abstract Section */}
      <div className="my-8">
        <h2 className="text-xl font-headline font-semibold text-primary mb-3">Abstract</h2>
        <Separator className="mb-4" />
        <TiptapRenderer
          jsonContent={entry.abstract}
          className="prose prose-sm sm:prose-base max-w-none font-body text-foreground/80
                     prose-headings:font-headline prose-headings:text-primary
                     prose-strong:text-primary/90"
        />
        {entry.keywords && entry.keywords.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-semibold text-primary">
              Key words:{' '}
              <span className="font-normal text-foreground/80">
                {(Array.isArray(entry.keywords) ? entry.keywords.join(', ') : entry.keywords)}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Bottom "Tabs" and Copyright */}
      <div className="my-8 pt-6 border-t border-border">
        <div className="flex items-center space-x-4 mb-3">
          <h3 className="text-md font-semibold text-primary border-b-2 border-primary pb-1">Abstract</h3>
          <Button variant="link" className="text-md font-medium text-muted-foreground hover:text-primary p-0 h-auto pb-1" onClick={() => onIncrement('downloads')}>
            Full Text PDF
          </Button>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {copyrightText}
        </p>
      </div>
    </>
  );
};

export default JournalView;
