
import Link from 'next/link';
import type { JournalCategory } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SubjectBrowseItemProps {
  category: JournalCategory;
  className?: string;
}

const SubjectBrowseItem = ({ category, className }: SubjectBrowseItemProps) => {
  const Icon = category.icon;
  return (
    <Link
      href={`/category/${category.slug}`}
      className={cn(
        "group flex items-center justify-between py-2 px-3 text-sm text-foreground hover:bg-muted rounded-md transition-colors",
        className
      )}
    >
      <div className="flex items-center">
        <Icon className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
        <span className="font-medium group-hover:text-primary transition-colors">{category.name}</span>
      </div>
      {category.publishedArticlesCount !== undefined && (
        <Badge variant="secondary" className="text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          {category.publishedArticlesCount}
        </Badge>
      )}
    </Link>
  );
};

export default SubjectBrowseItem;
