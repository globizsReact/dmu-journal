
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface HeroSectionProps {
  title: string;
  subtitle: string;
}

const HeroSection = ({ title, subtitle }: HeroSectionProps) => {
  return (
    <section className="py-20 md:py-28 bg-primary text-primary-foreground text-center">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-headline font-bold text-accent leading-tight mb-6">
          {title}
        </h1>
        <p className="text-md md:text-lg text-primary-foreground/90 font-body max-w-3xl mx-auto lg:whitespace-nowrap">
          {subtitle}
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
