
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { JournalEntry } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface ArticleListItemCardProps {
  entry: JournalEntry;
  categoryName: string;
  className?: string;
}

const ArticleListItemCard = ({ entry, categoryName, className }: ArticleListItemCardProps) => {
  return (
    <div className={cn("group flex flex-col md:flex-row items-start gap-6 p-6 border border-border rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow", className)}>
      <div className="w-full md:w-1/4 lg:w-1/5 flex-shrink-0">
        <div className="aspect-[4/3] relative rounded-md overflow-hidden bg-muted">
          <Image
            src={entry.thumbnailImagePath || entry.imagePath || 'https://placehold.co/200x150.png'}
            alt={entry.title || 'Article image'}
            layout="fill"
            objectFit="cover"
            data-ai-hint={entry.thumbnailImageHint || entry.imageHint || "scientific research"}
          />
        </div>
      </div>
      <div className="flex-grow">
        <p className="text-sm text-muted-foreground mb-1">Article Number - {entry.id}</p>
        <p className="text-sm text-primary font-medium mb-1">{categoryName}</p>
        <h3 className="text-xl font-headline font-semibold text-primary mb-2">
          <Link href={`/journal/${entry.id}`}>
            {entry.title}
          </Link>
        </h3>
        <p className="text-sm text-foreground/80 mb-4 line-clamp-3 font-body">
          {entry.excerpt}
        </p>
        <Button asChild variant="link" className="p-0 text-primary hover:text-primary/90 font-medium">
          <Link href={`/journal/${entry.id}`} className="inline-flex items-center gap-1">
            Read More
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ArticleListItemCard;
