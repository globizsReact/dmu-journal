
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
      <Card className="h-full overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-card border border-border hover:border-primary/50">
        <div className="relative w-full aspect-[4/3]"> {/* Image and text container */}
          <Image
            src={category.imagePath}
            alt={category.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={category.imageHint}
          />
          {/* Gradient overlay for text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent pointer-events-none"></div>
          
          {/* Text content positioned over the image */}
          <CardContent className="absolute inset-0 p-3 flex flex-col justify-end text-primary-foreground">
            <p className="text-xs opacity-90 mb-0.5">{universityName}</p>
            <h3 className="text-sm font-poltawski group-hover:underline leading-tight">
              {category.name}
            </h3>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
};

export default JournalPublicationCard;
