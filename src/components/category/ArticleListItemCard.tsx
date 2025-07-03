
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { JournalEntry } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { toPublicUrl } from '@/lib/urlUtils';

interface ArticleListItemCardProps {
  entry: JournalEntry;
  categoryName: string;
  className?: string;
}

const ArticleListItemCard = ({ entry, categoryName, className }: ArticleListItemCardProps) => {
  const imageUrl = toPublicUrl(entry.thumbnailImagePath || entry.imagePath) || 'https://placehold.co/200x150.png';

  return (
    <div className={cn("group flex flex-col md:flex-row items-stretch gap-6 p-6 border border-border rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow", className)}>
      <div className="w-full md:w-1/4 lg:w-1/5 flex-shrink-0 aspect-[4/3] md:aspect-auto relative rounded-md overflow-hidden bg-muted">
        <Image
          src={imageUrl}
          alt={entry.title || 'Article image'}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover"
          data-ai-hint={entry.thumbnailImageHint || entry.imageHint || "scientific research"}
        />
      </div>
      <div className="flex-grow flex flex-col">
        <div>
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
        </div>
        <div className="mt-auto">
          <Button asChild variant="link" className="p-0 text-primary hover:text-primary/90 font-medium">
            <Link href={`/journal/${entry.id}`} className="inline-flex items-center gap-1">
              Read More
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArticleListItemCard;
