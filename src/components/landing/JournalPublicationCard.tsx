
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import type { JournalCategory } from '@prisma/client';
import { toPublicUrl } from '@/lib/urlUtils';

interface JournalPublicationCardProps {
  category: JournalCategory;
  universityName: string;
}

const JournalPublicationCard = ({ category, universityName }: JournalPublicationCardProps) => {
  return (
    <Link href={`/category/${category.slug}`} className="group block h-full">
      <Card className="h-full flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-card rounded-none">
        <div className="relative w-full aspect-video"> {/* Image and text container */}
          <Image
            src={toPublicUrl(category.imagePath)}
            alt={category.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-1600 ease-in-out group-hover:scale-125"
            data-ai-hint={category.imageHint}
          />
          {/* Gradient overlay for text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent pointer-events-none"></div>
          
          {/* Text content positioned over the image */}
          <CardContent className="absolute inset-0 p-3 flex flex-col justify-center items-center text-center text-primary-foreground">
            <p className="text-xs opacity-90 mb-0.5">{universityName}</p>
            <h3 className="text-2xl font-poltawski leading-tight">
              {category.name}
            </h3>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
};

export default JournalPublicationCard;
