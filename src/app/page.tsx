
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import HeroSection from '@/components/landing/HeroSection';
import JournalPublicationCard from '@/components/landing/JournalPublicationCard';
import { journalCategories } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const universityName = "Dhanamanjuri University";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection />

        <section className="py-8 bg-secondary text-secondary-foreground text-center">
          <div className="container mx-auto px-4">
            <p className="text-lg md:text-xl font-semibold">
              CALL FOR PAPER SUBMISSION FOR 2025
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
              <Button
                asChild
                size="lg"
                className="bg-[#1A8A6D] hover:bg-[#166F57] text-white px-8"
              >
                <Link href="/journals">View All Journals</Link>
              </Button>
              <div className="relative w-full md:w-auto md:max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search By Article"
                  className="pl-10 pr-4 py-2 w-full"
                />
              </div>
            </div>

            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">
                {universityName} Journals Portal
              </h2>
              <p className="text-md text-foreground/70 mt-2 font-body">
                Driven By Knowledge. Defined By Research.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 lg:max-w-3xl lg:mx-auto">
              {journalCategories.map((category) => (
                <JournalPublicationCard
                  key={category.id}
                  category={category}
                  universityName={universityName}
                />
              ))}
            </div>

            <div className="mt-16 text-center">
              <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10 px-10">
                <Link href="/faq">SEE FAQ</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
