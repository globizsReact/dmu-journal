import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { JournalEntry } from '@/lib/types';
import { CalendarDays, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';


interface JournalCardProps {
  entry: JournalEntry;
   animationDelay?: string;
}

const JournalCard = ({ entry, animationDelay = "0s" }: JournalCardProps) => {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slide-in-up bg-card" style={{ animationDelay }}>
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-primary group-hover:text-accent transition-colors">
          {entry.title}
        </CardTitle>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <CalendarDays className="w-4 h-4 mr-2" />
          <time dateTime={entry.date}>{format(new Date(entry.date), 'MMMM d, yyyy')}</time>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-foreground/80 font-body line-clamp-4">
          {entry.excerpt}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Button asChild variant="link" className="text-accent hover:text-accent/80 p-0">
          <Link href={`/journal/${entry.id}`} className="flex items-center">
            Read More <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JournalCard;
