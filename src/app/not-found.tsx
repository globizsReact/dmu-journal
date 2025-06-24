
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4">
        <div className="mb-6">
          {/* A friendly SVG illustration for the 404 page */}
          <svg width="250" height="150" viewBox="0 0 300 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text 
              x="50%" 
              y="55%" 
              dominantBaseline="middle" 
              textAnchor="middle" 
              fontSize="120" 
              fontWeight="bold" 
              className="fill-muted-foreground opacity-20 font-headline"
            >
              404
            </text>
            <g transform="translate(190 25) scale(1.5)">
                <path 
                    d="M17.5 10.5C17.5 14.366 14.366 17.5 10.5 17.5C6.63401 17.5 3.5 14.366 3.5 10.5C3.5 6.63401 6.63401 3.5 10.5 3.5C14.366 3.5 17.5 6.63401 17.5 10.5Z" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth="2"
                />
                <path d="M22 22L15.5 15.5" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round"/>
            </g>
             <text 
              x="50%" 
              y="55%" 
              dominantBaseline="central" 
              textAnchor="middle" 
              fontSize="20" 
              fontWeight="600" 
              className="fill-destructive font-body"
            >
              PAGE NOT FOUND
            </text>
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-3">
          Oops! This Page is Lost
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Button asChild size="lg">
          <Link href="/" className="inline-flex items-center">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back to Homepage
          </Link>
        </Button>
      </main>
      <Footer />
    </div>
  );
}
