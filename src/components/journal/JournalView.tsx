
import React, { useState } from 'react';
import type { ManuscriptDetails, JournalCategory } from '@/lib/types';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Eye, Download, MessageSquareQuote } from 'lucide-react';
import { Button } from '../ui/button';
import TiptapRenderer from '../shared/TiptapRenderer';
import { toPublicUrl } from '@/lib/urlUtils';
import AuthorInfoView from './AuthorInfoView';
import { cn } from '@/lib/utils';


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
  entry: ManuscriptDetails;
  category: JournalCategory;
  onIncrement: (type: 'views' | 'downloads' | 'citations') => void;
}

const JournalView = ({ entry, category, onIncrement }: JournalViewProps) => {
  const [activeTab, setActiveTab] = useState('abstract');
  
  const copyrightText = `Copyright © ${new Date().getFullYear()} Author(S) Retain The Copyright Of This Article. This Article Is Published Under The Terms Of The University`;

  const displayImagePath = toPublicUrl(entry.thumbnailImagePath || category.imagePath);
  const displayImageHint = entry.thumbnailImageHint || category.imageHint;

  const tabs = [
    { key: 'abstract', label: 'Abstract' },
    { key: 'pdf', label: 'Full Text PDF' },
    { key: 'authors', label: 'Authors' },
    { key: 'articles', label: 'Articles' },
    { key: 'citations', label: 'Citations' },
    { key: 'metrics', label: 'Article Metrics' },
  ];

  const handleTabClick = (key: string) => {
    if (key === 'pdf') {
      onIncrement('downloads');
    } else if (key === 'citations') {
      onIncrement('citations');
    } else {
      setActiveTab(key);
    }
  };


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
              <div className="w-full mt-4 sm:mt-0 sm:w-1/3 flex-shrink-0">
                <div className="relative h-full min-h-[180px] w-full overflow-hidden rounded-md border">
                  <Image
                    src={displayImagePath}
                    alt={`Thumbnail for ${entry.title}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover"
                    data-ai-hint={displayImageHint || "research graph"}
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

       {/* Action Bar / Tabs */}
       <div className="my-8 py-3 bg-primary rounded-md">
        <div className="container mx-auto px-2">
            <div className="flex flex-wrap items-center justify-center md:justify-around gap-x-3 gap-y-2">
                {tabs.map((tab, index) => (
                    <React.Fragment key={tab.key}>
                        <Button
                             variant={activeTab === tab.key ? "secondary" : "link"}
                            className={cn(
                                "font-medium h-auto px-3 py-1.5",
                                activeTab === tab.key
                                    ? "text-secondary-foreground"
                                    : "text-primary-foreground hover:text-accent hover:no-underline",
                            )}
                            onClick={() => handleTabClick(tab.key)}
                        >
                            {tab.label}
                        </Button>
                        {index < tabs.length - 1 && <Separator orientation="vertical" className="h-4 bg-primary-foreground/30 hidden md:block" />}
                    </React.Fragment>
                ))}
            </div>
        </div>
      </div>

      {/* Conditionally Rendered Content */}
      <div className="my-8">
        {activeTab === 'abstract' && (
          <>
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
          </>
        )}
        
        {activeTab === 'authors' && (
          <AuthorInfoView authorDetails={entry} />
        )}
      </div>
    </>
  );
};

export default JournalView;
