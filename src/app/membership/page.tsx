
'use client';

import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BadgeCheck, Banknote, BookOpen } from 'lucide-react';

const SidebarLink = ({ children, href = "#" }: { children: React.ReactNode; href?: string }) => (
  <Link
    href={href}
    className="block py-2 px-3 text-foreground hover:bg-muted rounded-md transition-colors font-medium"
  >
    {children}
  </Link>
);

const heroImage = "https://images.pexels.com/photos/5905497/pexels-photo-5905497.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

const metadataItems = [
  "Join a community of scholars",
  "Access exclusive resources",
  "Support open access publishing",
];

const benefits = [
    {
        icon: BookOpen,
        title: "Access to Publications",
        description: "Receive complimentary access to all journal issues and archived content.",
    },
    {
        icon: BadgeCheck,
        title: "Publishing Discounts",
        description: "Enjoy reduced Article Processing Charges (APCs) on your manuscript submissions.",
    },
    {
        icon: Banknote,
        title: "Networking Opportunities",
        description: "Connect with peers and experts in your field through our sponsored events and forums.",
    }
]

export default function MembershipPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[350px] text-primary-foreground">
        <Image
          src={heroImage}
          alt={"Membership background"}
          fill
          sizes="100vw"
          className="absolute inset-0 z-0 object-cover"
          data-ai-hint={"library books"}
          priority
        />
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">
            Membership
          </h1>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm md:text-base">
            {metadataItems.map((item, index) => (
              <span key={index} className="opacity-90">
                {item}
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
              <SidebarLink href="/about">About Us</SidebarLink>
              <SidebarLink href="/membership">Membership</SidebarLink>
              <SidebarLink href="/support-center">Support Center</SidebarLink>
            </nav>
          </aside>

          {/* Right Content Pane */}
          <section className="w-full md:w-3/4 lg:w-4/5">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-6">
                Become a Member
            </h2>
            <div className="prose prose-sm sm:prose-base max-w-none font-body text-foreground/80 space-y-4">
                <p>
                    By becoming a member of the Dhanamanjuri University Journals community, you are joining a network of professionals dedicated to the advancement of research and scholarship. Our membership program is designed to support your work and provide valuable resources.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                    {benefits.map(benefit => {
                        const Icon = benefit.icon;
                        return (
                            <div key={benefit.title} className="text-center p-4">
                                <Icon className="w-12 h-12 text-primary mx-auto mb-3"/>
                                <h3 className="text-lg font-headline font-semibold text-foreground">{benefit.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{benefit.description}</p>
                            </div>
                        )
                    })}
                </div>

                <p>
                    For more information on membership tiers and how to join, please contact our administrative office through the details provided in our Support Center.
                </p>
                 <Button asChild className="mt-4">
                    <Link href="/support-center">Contact Us</Link>
                </Button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
