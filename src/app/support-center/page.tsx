
'use client';

import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Phone, Mail, MapPin } from 'lucide-react';

const SidebarLink = ({ children, href = "#" }: { children: React.ReactNode; href?: string }) => (
  <Link
    href={href}
    className="block py-2 px-3 text-foreground hover:bg-muted rounded-md transition-colors font-medium"
  >
    {children}
  </Link>
);

const heroImage = "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

const metadataItems = [
  "Dedicated Support Team",
  "Technical Assistance",
  "General Inquiries",
];

const contactInfo = [
    {
        icon: Phone,
        title: "Phone",
        value: "+91 123 456 7890",
        href: "tel:+911234567890",
    },
    {
        icon: Mail,
        title: "Email",
        value: "support@dmujournals.ac.in",
        href: "mailto:support@dmujournals.ac.in",
    },
    {
        icon: MapPin,
        title: "Address",
        value: "Dhanamanjuri University, Imphal, Manipur, India",
    }
]

export default function SupportCenterPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[350px] text-primary-foreground">
        <Image
          src={heroImage}
          alt={"Support Center background"}
          fill
          sizes="100vw"
          className="absolute inset-0 z-0 object-cover"
          data-ai-hint={"team meeting collaboration"}
          priority
        />
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">
            Support Center
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
                Get In Touch
            </h2>
            <div className="prose prose-sm sm:prose-base max-w-none font-body text-foreground/80 space-y-4">
                <p>
                    Our support team is available to assist you with any questions or issues you may have. Whether you need help with a manuscript submission, have a query about your membership, or require technical assistance with the website, we are here to help.
                </p>
                <div className="not-prose space-y-6 pt-6">
                    {contactInfo.map(item => {
                        const Icon = item.icon;
                        return (
                             <div key={item.title} className="flex items-start gap-4">
                                <div className="p-3 bg-muted rounded-full">
                                    <Icon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                                    {item.href ? (
                                         <a href={item.href} className="text-md text-muted-foreground hover:text-primary transition-colors">{item.value}</a>
                                    ) : (
                                        <p className="text-md text-muted-foreground">{item.value}</p>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
