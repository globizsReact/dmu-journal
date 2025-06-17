
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import type { JournalCategory } from '@/lib/types';

interface JournalPublicationCardProps {
  category: JournalCategory;
  universityName: string;
}

const JournalPublicationCard = ({ category, universityName }: JournalPublicationCardProps) => {
  return (
    <Link href={`/category/${category.slug}`} className="group block h-full">
      <Card className="h-full flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-card border border-border hover:border-primary/50">
        <div className="relative w-full aspect-[4/3]"> {/* Aspect ratio for image consistency */}
          <Image
            src={category.imagePath}
            alt={category.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={category.imageHint}
          />
        </div>
        <CardContent className="p-3 text-center flex-grow flex flex-col justify-center"> {/* Reduced padding from p-4 to p-3 */}
          <p className="text-xs text-muted-foreground mb-1">{universityName}</p>
          <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors"> {/* Reduced font size from text-base to text-sm */}
            {category.name}
          </h3>
        </CardContent>
      </Card>
    </Link>
  );
};

export default JournalPublicationCard;
