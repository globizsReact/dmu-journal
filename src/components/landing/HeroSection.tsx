import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { journalCategories } from '@/lib/data'; // For linking to the first category

const HeroSection = () => {
  const firstCategorySlug = journalCategories[0]?.slug || '';

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-background to-secondary/30 animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-5xl md:text-6xl font-headline font-bold text-primary leading-tight">
              Unlock Your Thoughts,
              <br />
              <span className="text-accent">Pen Your Universe.</span>
            </h1>
            <p className="text-lg text-foreground/80 font-body max-w-md">
              MemoirVerse is your personal sanctuary to capture life's moments,
              reflections, and creative sparks. Start your journey of
              self-discovery today.
            </p>
            <div className="flex space-x-4">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transform hover:scale-105 transition-transform duration-300">
                <Link href={firstCategorySlug ? `/category/${firstCategorySlug}` : "/"}>Explore Journals</Link>
              </Button>
              {/* <Button variant="outline" size="lg">Learn More</Button> */}
            </div>
          </div>
          <div className="relative h-96 md:h-[500px] animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
            {/* Overlapping images */}
            <div className="absolute top-0 left-0 w-3/4 h-3/4 rounded-lg shadow-2xl overflow-hidden transform rotate-[-3deg] hover:rotate-[-1deg] hover:scale-105 transition-all duration-500">
              <Image
                src="https://placehold.co/600x450.png"
                alt="Journaling inspiration"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
                data-ai-hint="notebook pen"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-2/3 h-2/3 rounded-lg shadow-2xl overflow-hidden transform rotate-[4deg] hover:rotate-[2deg] hover:scale-105 transition-all duration-500">
              <Image
                src="https://placehold.co/500x375.png"
                alt="Creative writing desk"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
                data-ai-hint="vintage desk"
              />
            </div>
             <div className="absolute top-1/4 left-1/3 w-1/2 h-1/2 rounded-full shadow-2xl overflow-hidden transform scale-90 hover:scale-100 transition-all duration-500 opacity-70 hover:opacity-90">
              <Image
                src="https://placehold.co/400x400.png"
                alt="Nature inspiration"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
                data-ai-hint="mountain landscape"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
