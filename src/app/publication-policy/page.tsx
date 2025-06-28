
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PublicationPolicyPage() {
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
          Publication Policy
        </h1>
        <div className="prose prose-sm sm:prose-base max-w-none font-body text-foreground/80 space-y-6">
          <section>
            <h2 className="text-2xl font-headline font-semibold text-primary/90">Peer Review Process</h2>
            <p>
              All manuscripts submitted to Dhanamanjuri University Journals undergo a rigorous double-blind peer review
              process. Submissions are first assessed by the editorial team for suitability and adherence to journal
              guidelines. Manuscripts that pass this initial screening are then sent to at least two independent
              reviewers who are experts in the field. Reviewers provide detailed feedback and recommendations,
              which form the basis for the editorial decision (accept, minor revisions, major revisions, or reject).
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-headline font-semibold text-primary/90">Open Access</h2>
            <p>
              Dhanamanjuri University Journals are committed to promoting the widest possible dissemination of research.
              Many of our journals operate on an open access model, ensuring that published articles are freely available
              to the global academic community and the public. Specific open access policies, including any applicable
              Article Processing Charges (APCs), are detailed on individual journal pages.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-headline font-semibold text-primary/90">Copyright and Licensing</h2>
            <p>
              Authors retain copyright of their work published in DMUJ. Articles are typically published under a
              Creative Commons license (e.g., CC BY), which allows for broad reuse with proper attribution.
              Specific licensing terms are outlined during the submission process and on the article's publication page.
            </p>
          </section>
           <section>
            <h2 className="text-2xl font-headline font-semibold text-primary/90">Archiving</h2>
            <p>
              To ensure long-term access and preservation of scholarly content, DMUJ utilizes digital archiving solutions.
              Published articles are deposited in recognized academic repositories and digital archives.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
