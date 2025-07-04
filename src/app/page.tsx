
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import HeroSection from '@/components/landing/HeroSection';
import JournalPublicationCard from '@/components/landing/JournalPublicationCard';
import GlobalSearchInput from '@/components/shared/GlobalSearchInput';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import type { JournalCategory } from '@prisma/client';

async function getCategories(): Promise<JournalCategory[]> {
    try {
        const categories = await prisma.journalCategory.findMany({
             orderBy: {
                order: 'asc'
            }
        });
        return categories;
    } catch (error) {
        console.error("Failed to fetch journal categories from DB:", error);
        return []; // Return empty array on error
    }
}

const defaultContent = {
  heroTitle: "Accelerating Discovery",
  heroSubtitle: "By Embracing Open Access, Academic Journals Drives Faster Dissemination Of Rigorous And Impactful Research.",
  journalSectionTitle: "Dhanamanjuri University Journals Portal",
  journalSectionSubtitle: "Driven By Knowledge. Defined By Research."
};

async function getLandingPageContent() {
  try {
    const pageData = await prisma.sitePage.findUnique({
      where: { slug: 'landing-page' },
    });
    if (pageData && typeof pageData.content === 'object' && pageData.content) {
      return { ...defaultContent, ...pageData.content as any };
    }
    return defaultContent;
  } catch (error) {
    console.error("Failed to fetch landing page content:", error);
    return defaultContent;
  }
}

export default async function HomePage() {
  const universityName = "Dhanamanjuri University";
  const [journalCategories, content] = await Promise.all([
    getCategories(),
    getLandingPageContent()
  ]);
  const nextYear = new Date().getFullYear() + 1;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection title={content.heroTitle} subtitle={content.heroSubtitle} />

        <section className="py-8 bg-secondary text-secondary-foreground text-center">
          <div className="container mx-auto px-4">
            <Link href="/submit" className="inline-block hover:underline focus:underline focus:outline-none">
                <p className="text-lg md:text-xl font-semibold">
                  CALL FOR PAPER SUBMISSION FOR {nextYear}
                </p>
            </Link>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center mb-10 gap-4 md:gap-6 lg:gap-8 lg:max-w-5xl lg:mx-auto md:justify-center">
              <div className="w-full md:flex-1">
                <GlobalSearchInput />
              </div>
              <div className="w-full md:w-auto mt-4 md:mt-0">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#1A8A6D] hover:bg-[#166F57] text-white px-8 w-full md:w-auto"
                >
                  <Link href="/journals">View All Journals</Link>
                </Button>
              </div>
            </div>

            <div className="text-center mb-12 lg:max-w-5xl lg:mx-auto">
              <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">
                {content.journalSectionTitle}
              </h2>
              <p className="text-md text-foreground/70 mt-2 font-body">
                {content.journalSectionSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 lg:max-w-5xl lg:mx-auto">
              {journalCategories.map((category, index) => (
                <JournalPublicationCard
                  key={category.id}
                  category={category}
                  universityName={universityName}
                  priority={index < 2}
                />
              ))}
            </div>

            <div className="mt-16 text-center">
              <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10 hover:text-primary px-10">
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
