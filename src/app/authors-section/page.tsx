
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AuthorsSectionPage() {
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
          Authors Section
        </h1>
        <div className="prose lg:prose-xl max-w-none font-body text-foreground/80 space-y-6">
          <section>
            <h2 className="text-2xl font-headline font-semibold text-primary/90">Submission Guidelines</h2>
            <p>
              Authors wishing to submit their manuscripts to Dhanamanjuri University Journals (DMUJ) should carefully
              review the specific guidelines for the target journal. General guidelines include manuscript formatting,
              word limits, citation styles (e.g., APA, MLA, Chicago), and requirements for figures and tables.
              Submissions are typically made through our online submission portal.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-headline font-semibold text-primary/90">Manuscript Preparation</h2>
            <p>
              Manuscripts should be well-structured, clearly written in English, and free of grammatical errors.
              Ensure that the research methodology is sound and the findings are presented logically.
              Include an abstract, keywords, introduction, methods, results, discussion, and conclusion, as appropriate
              for the article type. Anonymize the manuscript for double-blind peer review by removing author-identifying
              information from the main text and properties.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-headline font-semibold text-primary/90">Copyright and Permissions</h2>
            <p>
              Authors are responsible for obtaining necessary permissions for any copyrighted material (e.g., figures, tables)
              reproduced from other sources. Upon acceptance, authors will typically be asked to sign a copyright agreement
              or a license-to-publish form.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-headline font-semibold text-primary/90">Review Process</h2>
            <p>
              Familiarize yourself with our peer review process. Authors will receive feedback from reviewers and the
              editorial team. Prompt and thorough responses to reviewer comments are crucial for timely publication.
            </p>
          </section>
           <section>
            <h2 className="text-2xl font-headline font-semibold text-primary/90">Contact Information</h2>
            <p>
              For any queries regarding submissions or the publication process, please contact the editorial office
              of the respective journal. Contact details can be found on each journal's dedicated page.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
