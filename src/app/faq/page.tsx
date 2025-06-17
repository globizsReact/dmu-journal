
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const metadataItems = [
  "Abbreviation: J. Biophys. Struct. Biol.",
  "Language: English",
  "ISSN: 2141-2200",
  "DOI: 10.5897/JBSB",
  "Start Year: 2009",
  "Published Articles: 25",
];

const faqSections = [
  {
    title: "For Authors",
    items: [
      {
        question: "How Do I Submit A Manuscript?",
        answer: "To submit a manuscript, please navigate to the 'Submit Manuscript' section in your author dashboard. Follow the instructions provided, upload your manuscript file, and fill in the required metadata. Ensure your manuscript adheres to our formatting guidelines.",
      },
      {
        question: "How Do I Check Status Of A Manuscript?",
        answer: "You can check the status of your submitted manuscript by logging into your author dashboard and visiting the 'My Manuscripts' section. The current status (e.g., Under Review, Revisions Required, Accepted) will be displayed next to each submission.",
      },
      {
        question: "How To Send A Message To The Editorial Office?",
        answer: "You can send a message to the editorial office through the contact form available on the journal's specific page or via the contact details provided in the 'Contact Us' section of our website.",
      },
      {
        question: "How Do I Send A Message To Help Desk?",
        answer: "For technical support or help desk inquiries, please visit our 'Support Center' page where you can find contact options or a form to submit your query.",
      },
      {
        question: "How Do I Change My Password Or Update My Profile?",
        answer: "To change your password or update your profile information, log in to your author dashboard and look for the 'View/Edit Profile' section. You will find options to update your personal details and change your password there.",
      },
      {
        question: "How Do I Make Payment?",
        answer: "On the left side menu on the Author's page, click the 'Make Payment' button. A list of payments due would be loaded. Please note, this only displays if you have outstanding payments.",
      }
    ],
  },
  {
    title: "For Editors",
    items: [
      {
        question: "How Do I Become An Editor?",
        answer: "If you are interested in becoming an editor for one of our journals, please visit the 'Editorial Board' section on the respective journal's page for information on how to apply or express your interest. Typically, this involves submitting your CV and a cover letter.",
      },
      {
        question: "How Do I Change My Password Or Update My Profile?",
        answer: "Visit this page to access the login page for editors. Once logged in, you should find options to manage your profile and password settings within your editor dashboard.",
      },
      {
        question: "How Do I Download Original Manuscript, Revised Manuscript, And Reviewers Comments?",
        answer: "As an editor, you can download manuscripts and reviewer comments from the editorial management system. After logging in, navigate to the assigned manuscript to find download links for all relevant files.",
      },
      {
        question: "How Do I Make A Decision On A Manuscript?",
        answer: "After reviewing the manuscript and the comments from reviewers, you can submit your editorial decision (e.g., Accept, Reject, Revisions Required) through the editorial management system. Clear instructions are usually provided within the system.",
      },
    ],
  },
  {
    title: "For Reviewers",
    items: [
      {
        question: "How Do I Join The Editorial Board?",
        answer: "To join the editorial board or become a reviewer, please check the 'Join Us' or 'Reviewer Guidelines' section on our website. You may need to submit an application or register your areas of expertise.",
      },
      {
        question: "How Can I Send A Message To The Editorial Office?",
        answer: "Click here to view a list of mail addresses for all editorial offices. Alternatively, use the contact forms available on the journal websites.",
      },
      {
        question: "How Do I Submit My Evaluation Of A Manuscript?",
        answer: "When you are invited to review a manuscript, you will receive instructions and a link to our peer review system. You can submit your evaluation, comments, and recommendation through this system.",
      },
      {
        question: "I Have Been Invited To Review A Manuscript, How Do I Login Into The System?",
        answer: "The invitation email you received should contain a link and credentials to log into the peer review system. If you have trouble logging in, please contact the editorial office for assistance.",
      },
    ],
  },
];


const SidebarLink = ({ children, href = "#" }: { children: React.ReactNode; href?: string }) => (
  <Link
    href={href}
    className="block py-2 px-3 text-foreground hover:bg-muted rounded-md transition-colors font-medium"
  >
    {children}
  </Link>
);

export default function FAQPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[350px] text-primary-foreground">
        <Image
          src="https://placehold.co/1200x350.png"
          alt="FAQ Background"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
          data-ai-hint="library abstract"
          priority
        />
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">
            FAQ
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
          <div className="flex items-center space-x-4 md:space-x-6">
            <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Separator orientation="vertical" className="h-5 bg-border" />
            <Link href="/submit" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Call For Paper Submission For 2025
            </Link>
            <Separator orientation="vertical" className="h-5 bg-border hidden md:block" />
            <Link href="/journals" className="text-sm font-medium text-foreground hover:text-primary transition-colors hidden md:block">
              Journal Issues
            </Link>
            <Separator orientation="vertical" className="h-5 bg-border hidden md:block" />
             <Link href="/publication-policy" className="text-sm font-medium text-foreground hover:text-primary transition-colors hidden md:block">
              Publication
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Left Sidebar */}
          <aside className="w-full md:w-1/4 lg:w-1/5">
            <h2 className="text-xl font-headline font-semibold text-primary mb-4 px-3">Quick Links</h2>
            <nav className="space-y-1">
              <SidebarLink href="/journals">Journals</SidebarLink>
              <SidebarLink href="/about">About Us</SidebarLink>
              <SidebarLink href="#">Membership</SidebarLink>
              <SidebarLink href="#">Support Center</SidebarLink>
            </nav>
          </aside>

          {/* Right Content Pane - Accordion */}
          <section className="w-full md:w-3/4 lg:w-4/5">
            {faqSections.map((section) => (
              <div key={section.title} className="mb-10">
                <h2 className="text-2xl md:text-3xl font-headline font-bold text-primary mb-6">
                  {section.title}
                </h2>
                <Accordion type="single" collapsible className="w-full space-y-3">
                  {section.items.map((item, index) => (
                    <AccordionItem key={index} value={`item-${section.title.replace(/\s+/g, '-')}-${index}`} className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
                      <AccordionTrigger className="px-6 py-4 text-left text-md font-medium text-foreground hover:bg-muted/50 transition-colors">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4 pt-0 text-foreground/80 font-body">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
