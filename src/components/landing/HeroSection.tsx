import { Button } from '@/components/ui/button';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="py-20 md:py-28 bg-primary text-primary-foreground text-center">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-headline font-bold text-accent leading-tight mb-4">
          Accelerating Discovery
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/90 font-body max-w-3xl mx-auto">
          By Embracing Open Access, Academic Journals Drives Faster Dissemination Of Rigorous And Impactful Research.
        </p>
        {/* Optional: Add a CTA button if needed in hero, though design shows it below */}
        {/* 
        <div className="mt-8">
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/submit">Submit Your Paper</Link>
          </Button>
        </div>
        */}
      </div>
    </section>
  );
};

export default HeroSection;
