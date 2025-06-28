
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function EthicsPolicyPage() {
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
          Ethics Policy
        </h1>
        <div className="prose prose-sm sm:prose-base max-w-none font-body text-foreground/80 space-y-6">
          <section>
            <h2 className="text-2xl font-headline font-semibold text-primary/90">Commitment to Integrity</h2>
            <p>
              Dhanamanjuri University Journals (DMUJ) are committed to upholding the highest standards of publication ethics.
              We adhere to the principles outlined by organizations such as the Committee on Publication Ethics (COPE).
              Integrity, honesty, and transparency are paramount in all aspects of our publishing process.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-headline font-semibold text-primary/90">Authorship and Contributions</h2>
            <p>
              All listed authors must have made a significant intellectual contribution to the research and manuscript preparation.
              The corresponding author is responsible for ensuring all co-authors have approved the final manuscript and agree
              to its submission. Any changes to authorship post-submission must be approved by all authors.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-headline font-semibold text-primary/90">Plagiarism and Originality</h2>
            <p>
              Submissions must be original work and not previously published elsewhere, nor under consideration by another
              journal. DMUJ employs plagiarism detection software to screen all submissions. Manuscripts found to contain
              plagiarized content will be rejected. Proper citation and attribution of sources are mandatory.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-headline font-semibold text-primary/90">Data Sharing and Reproducibility</h2>
            <p>
              Authors are encouraged to share their data and make their research methods transparent to facilitate reproducibility.
              Specific data sharing policies may vary by journal and discipline.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-headline font-semibold text-primary/90">Conflicts of Interest</h2>
            <p>
              Authors, reviewers, and editors must disclose any potential conflicts of interest that could influence their
              judgment or the integrity of the publication process. This includes financial, personal, or professional relationships.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-headline font-semibold text-primary/90">Corrections and Retractions</h2>
            <p>
              DMUJ will issue corrections or retractions if significant errors or misconduct are identified post-publication,
              following COPE guidelines.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
