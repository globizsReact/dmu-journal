
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutDmujPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <Button asChild variant="outline">
            <Link href="/" className="inline-flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Link>
          </Button>
        </div>
        <h1 className="text-4xl font-headline font-bold text-primary mb-6">
          About DMUJ
        </h1>
        <div className="prose lg:prose-xl max-w-none font-body text-foreground/80 space-y-4">
          <p>
            Welcome to the Dhanamanjuri University Journals (DMUJ) portal. This section provides comprehensive
            information about DMUJ, our mission, vision, and the overarching objectives that guide our commitment
            to fostering scholarly research and academic publishing excellence.
          </p>
          <p>
            DMUJ is dedicated to the dissemination of high-quality, peer-reviewed research across a diverse
            range of academic disciplines. We strive to support the academic community by providing a platform
            for researchers to share their findings, innovations, and insights with a global audience.
          </p>
          <p>
            Our core values include academic integrity, rigorous peer review, open access principles (where applicable),
            and the promotion of interdisciplinary collaboration. We aim to contribute significantly to the body of
            knowledge and support the intellectual development of scholars at all stages of their careers.
          </p>
          <p>
            Explore further to learn about our specific journals, editorial policies, and submission guidelines.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
