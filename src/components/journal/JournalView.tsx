import type { JournalEntry, JournalCategory } from '@/lib/types';
import { CalendarDays, Tag } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface JournalViewProps {
  entry: JournalEntry;
  category?: JournalCategory;
}

const JournalView = ({ entry, category }: JournalViewProps) => {
  return (
    <article className="max-w-3xl mx-auto py-8 px-4 md:px-0 bg-card shadow-xl rounded-lg my-8 animate-fade-in">
      <header className="mb-8 border-b pb-6 px-6">
        <h1 className="text-4xl md:text-5xl font-headline text-primary leading-tight mb-4">
          {entry.title}
        </h1>
        <div className="flex flex-wrap items-center text-sm text-muted-foreground space-x-4">
          <div className="flex items-center">
            <CalendarDays className="w-4 h-4 mr-2" />
            <time dateTime={entry.date}>{format(new Date(entry.date), 'MMMM d, yyyy, h:mm a')}</time>
          </div>
          {category && (
            <div className="flex items-center">
              <Tag className="w-4 h-4 mr-2" />
              <Link href={`/category/${category.slug}`} className="hover:underline">
                <Badge variant="secondary">{category.name}</Badge>
              </Link>
            </div>
          )}
        </div>
      </header>
      <div
        className="prose prose-lg lg:prose-xl max-w-none px-6 font-body text-foreground/90 
                   prose-headings:font-headline prose-headings:text-primary 
                   prose-strong:text-primary prose-a:text-accent hover:prose-a:text-accent/80"
        dangerouslySetInnerHTML={{ __html: entry.content.replace(/\n/g, '<br />') }} // Simple new line to br conversion
      />
    </article>
  );
};

export default JournalView;
