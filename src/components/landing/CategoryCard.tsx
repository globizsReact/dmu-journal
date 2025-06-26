import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import type { JournalCategory } from '@/lib/types';

interface CategoryCardProps {
  category: JournalCategory;
  animationDelay?: string;
}

const CategoryCard = ({ category, animationDelay = "0s" }: CategoryCardProps) => {
  const Icon = category.icon;
  return (
    <Link href={`/category/${category.slug}`} className="group block animate-slide-in-up" style={{ animationDelay }}>
      <Card className="h-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-card">
        <CardHeader className="p-0">
          <div className="relative w-full h-48">
            <Image
              src={category.imagePath}
              alt={category.name}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-500 group-hover:scale-110"
              data-ai-hint={category.imageHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
             <div className="absolute top-4 right-4 bg-background/80 p-2 rounded-full shadow-md">
              <Icon className="w-6 h-6 text-primary" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <CardTitle className="text-2xl font-headline mb-2 text-primary group-hover:text-accent transition-colors">
            {category.name}
          </CardTitle>
          <CardDescription className="text-foreground/70 font-body line-clamp-3">
            {category.description}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CategoryCard;
