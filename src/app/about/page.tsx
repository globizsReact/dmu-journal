
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronRight } from 'lucide-react';

const metadataItems = [
  "Abbreviation: J. Biophys. Struct. Biol.",
  "Language: English",
  "ISSN: 2141-2200",
  "DOI: 10.5897/JBSB",
  "Start Year: 2009",
  "Published Articles: 25",
];

const SidebarLink = ({ children, href = "#" }: { children: React.ReactNode; href?: string }) => (
  <Link
    href={href}
    className="block py-2 px-3 text-foreground hover:bg-muted rounded-md transition-colors font-medium"
  >
    {children}
  </Link>
);

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[350px] text-primary-foreground">
        <Image
          src="https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="About Us Background"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
          data-ai-hint="university campus"
          priority
        />
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">
            About Us
          </h1>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm md:text-base">
            {metadataItems.map((item, index) => (
              <span key={index} className="opacity-90">
                {item}
                {index < metadataItems.length - 1 && <span className="mx-1 hidden md:inline">|</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Sub-Navigation Bar */}
      <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 h-14 flex items-center justify-center">
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Separator orientation="vertical" className="h-5 bg-border" />
            <Link href="/submit" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Call For Paper Submission For 2025
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Left Sidebar */}
          <aside className="w-full md:w-1/4 lg:w-1/5">
            <h2 className="text-xl font-headline font-semibold text-primary mb-4 px-3">About Us</h2>
            <nav className="space-y-1">
              <SidebarLink href="#">About Us</SidebarLink>
              <SidebarLink href="#">Membership</SidebarLink>
              <SidebarLink href="#">Support Center</SidebarLink>
            </nav>
          </aside>

          {/* Right Content Pane */}
          <section className="w-full md:w-3/4 lg:w-4/5">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-6">
              About Us
            </h2>
            <div className="space-y-6 text-foreground/80 font-body">
              <p>
                Welcome to the official platform of the Dhanamanjuri University Journals, a multidisciplinary initiative dedicated to fostering academic excellence, scholarly innovation, and impactful research. As a state university rooted in the rich intellectual heritage of Manipur, Dhanamanjuri University is committed to promoting cutting-edge research across a wide spectrum of disciplines through its peer-reviewed academic journals.
              </p>
              <p>
                Our journals serve as a dynamic forum for scholars, researchers, practitioners, and policymakers, offering a space for the critical exchange of ideas, empirical discoveries, and theoretical advancements. We currently publish specialized journals in the following domains:
              </p>
              <ul className="list-none space-y-3 pl-0">
                <li className="flex items-start">
                  <ChevronRight className="w-5 h-5 text-primary mr-2 mt-1 shrink-0" />
                  <span><strong className="text-foreground">Sciences</strong> – advancing knowledge in core and applied scientific disciplines.</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-5 h-5 text-primary mr-2 mt-1 shrink-0" />
                  <span><strong className="text-foreground">Humanities & Social Sciences</strong> – exploring human culture, behavior, and social systems.</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-5 h-5 text-primary mr-2 mt-1 shrink-0" />
                  <span><strong className="text-foreground">Business & Applied Research</strong> – bridging the gap between theory and real-world business practice.</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-5 h-5 text-primary mr-2 mt-1 shrink-0" />
                  <span><strong className="text-foreground">Legal Studies</strong> – promoting justice, policy insight, and legal scholarship.</span>
                </li>
              </ul>
              <p>
                Each journal is guided by a team of esteemed academics and follows strict ethical guidelines, including double-blind peer review, plagiarism prevention, and adherence to UGC norms and international standards. We are committed to publishing original, relevant, and transformative research that contributes meaningfully to academic discourse and societal progress.
              </p>
              <p>
                By integrating regional perspectives with global standards, Dhanamanjuri University Journals aim to empower knowledge creation, support interdisciplinary collaboration, and shape the future of research in India and beyond.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
