
"use client"; 

import * as React from 'react';
import type { ReactNode } from 'react';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import ArticleListItemCard from '@/components/category/ArticleListItemCard';
import ViewFilters from '@/components/category/ViewFilters';
import { getCategoryBySlug, getJournalsByCategoryId } from '@/lib/data';
import type { JournalCategory, JournalEntry } from '@/lib/types';
import { ArrowLeft, Home, Info, FileText, Shield, Users, BookOpen, LayoutList } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

type TabKey = 'OVERVIEW' | 'ABOUT_DMUJ' | 'PUBLICATION_POLICY' | 'ETHICS_POLICY' | 'AUTHORS_SECTION' | 'JOURNAL_ISSUES';

// ForwardRef for TabButton to get its DOM element for measurements
const TabButton = React.forwardRef<
  HTMLButtonElement,
  {
    onClick: () => void;
    isActive: boolean;
    label: string;
    icon: React.ElementType;
  }
>(({ onClick, isActive, label, icon: Icon }, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md",
        "transition-colors hover:text-primary",
        isActive ? "font-semibold text-primary" : "text-foreground"
      )}
      role="tab"
      aria-selected={isActive}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
});
TabButton.displayName = 'TabButton';


// Content Components for Tabs (remain unchanged, but ensure they are correctly defined as before)
const AboutDMUJContent = () => (
  <div className="prose lg:prose-xl max-w-none font-body text-foreground/80 space-y-4 py-8">
    <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-6">
      About DMUJ
    </h2>
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
);

const PublicationPolicyContent = () => (
  <div className="prose lg:prose-xl max-w-none font-body text-foreground/80 space-y-6 py-8">
    <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-6">
      Publication Policy
    </h2>
    <section>
      <h3 className="text-2xl font-headline font-semibold text-primary/90 !mb-2">Peer Review Process</h3>
      <p>
        All manuscripts submitted to Dhanamanjuri University Journals undergo a rigorous double-blind peer review
        process. Submissions are first assessed by the editorial team for suitability and adherence to journal
        guidelines. Manuscripts that pass this initial screening are then sent to at least two independent
        reviewers who are experts in the field. Reviewers provide detailed feedback and recommendations,
        which form the basis for the editorial decision (accept, minor revisions, major revisions, or reject).
      </p>
    </section>
    <section>
      <h3 className="text-2xl font-headline font-semibold text-primary/90 !mb-2">Open Access</h3>
      <p>
        Dhanamanjuri University Journals are committed to promoting the widest possible dissemination of research.
        Many of our journals operate on an open access model, ensuring that published articles are freely available
        to the global academic community and the public. Specific open access policies, including any applicable
        Article Processing Charges (APCs), are detailed on individual journal pages.
      </p>
    </section>
    <section>
      <h3 className="text-2xl font-headline font-semibold text-primary/90 !mb-2">Copyright and Licensing</h3>
      <p>
        Authors retain copyright of their work published in DMUJ. Articles are typically published under a
        Creative Commons license (e.g., CC BY), which allows for broad reuse with proper attribution.
        Specific licensing terms are outlined during the submission process and on the article's publication page.
      </p>
    </section>
     <section>
      <h3 className="text-2xl font-headline font-semibold text-primary/90 !mb-2">Archiving</h3>
      <p>
        To ensure long-term access and preservation of scholarly content, DMUJ utilizes digital archiving solutions.
        Published articles are deposited in recognized academic repositories and digital archives.
      </p>
    </section>
  </div>
);

const EthicsPolicyContent = () => (
  <div className="prose lg:prose-xl max-w-none font-body text-foreground/80 space-y-6 py-8">
    <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-6">
      Ethics Policy
    </h2>
    <section>
      <h3 className="text-2xl font-headline font-semibold text-primary/90 !mb-2">Commitment to Integrity</h3>
      <p>
        Dhanamanjuri University Journals (DMUJ) are committed to upholding the highest standards of publication ethics.
        We adhere to the principles outlined by organizations such as the Committee on Publication Ethics (COPE).
        Integrity, honesty, and transparency are paramount in all aspects of our publishing process.
      </p>
    </section>
    <section>
      <h3 className="text-2xl font-headline font-semibold text-primary/90 !mb-2">Authorship and Contributions</h3>
      <p>
        All listed authors must have made a significant intellectual contribution to the research and manuscript preparation.
        The corresponding author is responsible for ensuring all co-authors have approved the final manuscript and agree
        to its submission. Any changes to authorship post-submission must be approved by all authors.
      </p>
    </section>
    <section>
      <h3 className="text-2xl font-headline font-semibold text-primary/90 !mb-2">Plagiarism and Originality</h3>
      <p>
        Submissions must be original work and not previously published elsewhere, nor under consideration by another
        journal. DMUJ employs plagiarism detection software to screen all submissions. Manuscripts found to contain
        plagiarized content will be rejected. Proper citation and attribution of sources are mandatory.
      </p>
    </section>
    <section>
      <h3 className="text-2xl font-headline font-semibold text-primary/90 !mb-2">Data Sharing and Reproducibility</h3>
      <p>
        Authors are encouraged to share their data and make their research methods transparent to facilitate reproducibility.
        Specific data sharing policies may vary by journal and discipline.
      </p>
    </section>
    <section>
      <h3 className="text-2xl font-headline font-semibold text-primary/90 !mb-2">Conflicts of Interest</h3>
      <p>
        Authors, reviewers, and editors must disclose any potential conflicts of interest that could influence their
        judgment or the integrity of the publication process. This includes financial, personal, or professional relationships.
      </p>
    </section>
    <section>
      <h3 className="text-2xl font-headline font-semibold text-primary/90 !mb-2">Corrections and Retractions</h3>
      <p>
        DMUJ will issue corrections or retractions if significant errors or misconduct are identified post-publication,
        following COPE guidelines.
      </p>
    </section>
  </div>
);

const AuthorsSectionContent = () => (
  <div className="prose lg:prose-xl max-w-none font-body text-foreground/80 space-y-6 py-8">
    <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-6">
      Authors Section
    </h2>
    <section>
      <h3 className="text-2xl font-headline font-semibold text-primary/90 !mb-2">Submission Guidelines</h3>
      <p>
        Authors wishing to submit their manuscripts to Dhanamanjuri University Journals (DMUJ) should carefully
        review the specific guidelines for the target journal. General guidelines include manuscript formatting,
        word limits, citation styles (e.g., APA, MLA, Chicago), and requirements for figures and tables.
        Submissions are typically made through our online submission portal.
      </p>
    </section>
    <section>
      <h3 className="text-2xl font-headline font-semibold text-primary/90 !mb-2">Manuscript Preparation</h3>
      <p>
        Manuscripts should be well-structured, clearly written in English, and free of grammatical errors.
        Ensure that the research methodology is sound and the findings are presented logically.
        Include an abstract, keywords, introduction, methods, results, discussion, and conclusion, as appropriate
        for the article type. Anonymize the manuscript for double-blind peer review by removing author-identifying
        information from the main text and properties.
      </p>
    </section>
    <section>
      <h3 className="text-2xl font-headline font-semibold text-primary/90 !mb-2">Copyright and Permissions</h3>
      <p>
        Authors are responsible for obtaining necessary permissions for any copyrighted material (e.g., figures, tables)
        reproduced from other sources. Upon acceptance, authors will typically be asked to sign a copyright agreement
        or a license-to-publish form.
      </p>
    </section>
    <section>
      <h3 className="text-2xl font-headline font-semibold text-primary/90 !mb-2">Review Process</h3>
      <p>
        Familiarize yourself with our peer review process. Authors will receive feedback from reviewers and the
        editorial team. Prompt and thorough responses to reviewer comments are crucial for timely publication.
      </p>
    </section>
     <section>
      <h3 className="text-2xl font-headline font-semibold text-primary/90 !mb-2">Contact Information</h3>
      <p>
        For any queries regarding submissions or the publication process, please contact the editorial office
        of the respective journal. Contact details can be found on each journal's dedicated page.
      </p>
    </section>
  </div>
);

const CategoryIssuesContent = ({ category }: { category: JournalCategory | null }) => (
  <div className="prose lg:prose-xl max-w-none font-body text-foreground/80 space-y-4 py-8">
    <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-6">
      Journal Issues for {category?.name || 'this category'}
    </h2>
    <p>
      This page will list all the past and current journal issues for <strong>{category?.name || 'this category'}</strong>.
      Each issue could be presented with its volume number, issue number, publication date, and a link to view
      the articles contained within that specific issue.
    </p>
    <p>
      Currently, detailed issue listings are under development. Please check back later for updates.
    </p>
    <p>
      Future enhancements could include:
    </p>
    <ul className="list-disc pl-5 space-y-1">
      <li>A searchable and filterable list of issues.</li>
      <li>Table of contents for each issue.</li>
      <li>Links to download full issues if available.</li>
      <li>Details of special issues or thematic collections.</li>
    </ul>
  </div>
);


export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [category, setCategory] = useState<JournalCategory | null>(null);
  const [allCategoryJournals, setAllCategoryJournals] = useState<JournalEntry[]>([]);
  const [displayedEntries, setDisplayedEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<string>("Most Recent");
  const [activeTab, setActiveTab] = useState<TabKey>('OVERVIEW');
  
  const [underlineStyle, setUnderlineStyle] = useState({ width: 0, left: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const TABS_CONFIG: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: 'OVERVIEW', label: 'Overview', icon: LayoutList },
    { key: 'ABOUT_DMUJ', label: 'About DMUJ', icon: Info },
    { key: 'PUBLICATION_POLICY', label: 'Publication Policy', icon: FileText },
    { key: 'ETHICS_POLICY', label: 'Ethics Policy', icon: Shield },
    { key: 'AUTHORS_SECTION', label: 'Authors Section', icon: Users },
    { key: 'JOURNAL_ISSUES', label: 'Journal Issues', icon: BookOpen },
  ];

  useEffect(() => {
    if (slug) {
      const foundCategory = getCategoryBySlug(slug);
      if (foundCategory) {
        setCategory(foundCategory);
        const baseJournals = getJournalsByCategoryId(foundCategory.id);
        setAllCategoryJournals(baseJournals);
      } else {
        console.error("Category not found");
        setCategory(null);
        setAllCategoryJournals([]);
      }
      // Set loading to false after attempting to load category and journals
      const timer = setTimeout(() => setIsLoading(false), 200); // Simulate small delay
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (allCategoryJournals.length > 0) {
      let sortedJournals = [...allCategoryJournals];
      if (selectedView === "Most Recent") {
        sortedJournals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      } else if (selectedView === "Most View") {
        sortedJournals.sort((a, b) => (b.views || 0) - (a.views || 0));
      } else if (selectedView === "Most Shared") {
        sortedJournals.sort((a, b) => (b.shares || 0) - (a.shares || 0));
      }
      setDisplayedEntries(sortedJournals);
    } else {
      setDisplayedEntries([]);
    }
  }, [allCategoryJournals, selectedView]);


  useEffect(() => {
    if (isLoading || !category) {
      setUnderlineStyle({ width: 0, left: 0 }); // Reset or hide underline
      return;
    }

    const activeTabIndex = TABS_CONFIG.findIndex(tab => tab.key === activeTab);
    if (activeTabIndex !== -1 && tabRefs.current[activeTabIndex]) {
      const activeTabElement = tabRefs.current[activeTabIndex];
      // Use a timeout to ensure the DOM has settled for accurate measurements
      const timeoutId = setTimeout(() => {
        if (activeTabElement) { // Double check ref in case of quick changes
          setUnderlineStyle({
            width: activeTabElement.offsetWidth,
            left: activeTabElement.offsetLeft,
          });
        }
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [activeTab, category, isLoading, TABS_CONFIG]); // TABS_CONFIG is stable


  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        {/* Simplified skeleton for page structure before tabs are interactive */}
        <section className="py-10 md:py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <Skeleton className="h-6 w-1/4 mb-2" />
            <Skeleton className="h-10 md:h-12 w-3/4 md:w-1/2 mb-4" />
          </div>
        </section>
        <nav className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center md:justify-start items-center py-3 gap-4">
              <Skeleton className="h-8 w-20" /> {/* Home link skeleton */}
              {[...Array(5)].map((_, i) => ( // Skeletons for tab buttons
                <Skeleton key={i} className="h-8 w-24" />
              ))}
            </div>
          </div>
        </nav>
        <main className="flex-1 container mx-auto px-4 py-8">
           <Skeleton className="h-8 w-3/5 mb-4" />
           <Skeleton className="h-4 w-full mb-2" />
           <Skeleton className="h-4 w-full mb-2" />
           <Skeleton className="h-64 w-full mt-4" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl font-headline text-destructive mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-6">The journal category you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/" className="flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 mr-2" /> Go Back to Home
            </Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      {/* Hero/Title Section */}
      <section className="py-10 md:py-16 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 text-center md:text-left">
          <p className="text-lg font-medium opacity-90">Dhanamanjuri University</p>
          <h1 className="text-4xl md:text-5xl font-headline font-bold mt-1 mb-4">{category.name}</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm opacity-80">
            {category.abbreviation && <span>Abbreviation: {category.abbreviation}</span>}
            {category.language && <span>Language: {category.language}</span>}
            {category.issn && <span>ISSN: {category.issn}</span>}
            {category.doiBase && <span>DOI: {category.doiBase}</span>}
            {category.startYear && <span>Start Year: {category.startYear}</span>}
            {category.publishedArticlesCount && <span>Published Articles: {category.publishedArticlesCount}</span>}
          </div>
        </div>
      </section>

      {/* Tab Navigation Bar */}
      <nav className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center md:justify-start items-center py-1.5 gap-1">
            <Link href="/" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground hover:text-primary rounded-md transition-colors">
              <Home className="w-4 h-4" /> Home
            </Link>
            {/* Relative container for TABS_CONFIG and the animated underline */}
            <div className="relative flex items-center gap-1">
              {TABS_CONFIG.map((tabInfo, index) => (
                <TabButton
                  key={tabInfo.key}
                  ref={el => (tabRefs.current[index] = el)}
                  label={tabInfo.label}
                  icon={tabInfo.icon}
                  isActive={activeTab === tabInfo.key}
                  onClick={() => setActiveTab(tabInfo.key)}
                />
              ))}
              <div
                className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-in-out"
                style={{
                  width: `${underlineStyle.width}px`,
                  left: `${underlineStyle.left}px`,
                }}
              />
            </div>
          </div>
        </div>
      </nav>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {activeTab === 'OVERVIEW' && (
          <>
            <section className="mb-12">
              <h2 className="text-3xl font-headline text-primary mb-4">Scope Of The {category.name}</h2>
              {category.scope?.introduction && <p className="text-foreground/80 mb-4 font-body">{category.scope.introduction}</p>}
              {category.scope?.topics && category.scope.topics.length > 0 && (
                <ul className="list-disc list-inside space-y-1 mb-4 font-body text-foreground/80 pl-4">
                  {category.scope.topics.map(topic => <li key={topic}>{topic}</li>)}
                </ul>
              )}
              {category.scope?.conclusion && <p className="text-foreground/80 font-body">{category.scope.conclusion}</p>}
              {!category.scope && <p className="text-foreground/80 font-body">{category.description}</p>}
            </section>

            <ViewFilters selectedView={selectedView} onSelectView={setSelectedView} />
            
            <div className="space-y-8">
              {displayedEntries.length > 0 ? (
                displayedEntries.map((entry) => (
                  <ArticleListItemCard 
                    key={entry.id} 
                    entry={entry} 
                    categoryName={category.name}
                  />
                ))
              ) : (
                 allCategoryJournals.length > 0 && selectedView ? 
                  <p className="text-center text-muted-foreground py-8 text-lg">No journal entries found for the current filter.</p>
                  :
                  <p className="text-center text-muted-foreground py-8 text-lg">No journal entries found for this category currently.</p>
              )}
            </div>

            <div className="mt-12 text-center">
                <Button asChild variant="outline">
                    <Link href="/" className="inline-flex items-center">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to All Journals
                    </Link>
                </Button>
            </div>
          </>
        )}
        {activeTab === 'ABOUT_DMUJ' && <AboutDMUJContent />}
        {activeTab === 'PUBLICATION_POLICY' && <PublicationPolicyContent />}
        {activeTab === 'ETHICS_POLICY' && <EthicsPolicyContent />}
        {activeTab === 'AUTHORS_SECTION' && <AuthorsSectionContent />}
        {activeTab === 'JOURNAL_ISSUES' && <CategoryIssuesContent category={category} />}
      </main>

      {/* ISSN and Copyright Section */}
      {(category.displayIssn || category.copyrightYear) && (
        <section className="py-6 border-t border-border mt-12">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            {category.displayIssn && <p>{category.displayIssn}</p>}
            {category.copyrightYear && <p>&copy; {category.copyrightYear} DM University, All Rights Reserved.</p>}
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
}
    
