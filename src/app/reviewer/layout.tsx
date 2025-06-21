'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import ReviewerDashboardSidebar from '@/components/reviewer/ReviewerDashboardSidebar';
import { Loader2, Menu as MenuIcon } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster";
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ReviewerLayoutProps {
  children: ReactNode;
}

export default function ReviewerLayout({ children }: ReviewerLayoutProps) {
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isAuthenticatedReviewer, setIsAuthenticatedReviewer] = useState(false);
  const [reviewerName, setReviewerName] = useState("Reviewer");
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let isMounted = true;
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      const role = localStorage.getItem('userRole');
      const name = localStorage.getItem('authorName');

      if (token && role === 'reviewer') {
        if(isMounted) {
          setIsAuthenticatedReviewer(true);
          if (name) setReviewerName(name);
        }
      } else {
        if(isMounted) setIsAuthenticatedReviewer(false);
        router.push('/submit'); 
      }
      if(isMounted) setIsLoadingSession(false);

      const handleAuthChange = () => {
        const updatedToken = localStorage.getItem('authToken');
        const updatedRole = localStorage.getItem('userRole');
        if (updatedToken && updatedRole === 'reviewer') {
          if(isMounted) setIsAuthenticatedReviewer(true);
          const updatedName = localStorage.getItem('authorName');
          if (updatedName && isMounted) setReviewerName(updatedName);
        } else {
          if(isMounted) setIsAuthenticatedReviewer(false);
          router.push('/submit');
        }
      };
      window.addEventListener('authChange', handleAuthChange);
      return () => {
        isMounted = false;
        window.removeEventListener('authChange', handleAuthChange);
      };
    }
  }, [router]);

  useEffect(() => {
    setIsMobileSheetOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('authorName');
        localStorage.removeItem('isAuthorLoggedIn');
        window.dispatchEvent(new CustomEvent('authChange'));
        setIsMobileSheetOpen(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'R';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  if (isLoadingSession || !isAuthenticatedReviewer) {
    return (
      <html lang="en">
        <head>
            <title>Loading Reviewer Panel - DMU Journal</title>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Poltawski+Nowy:wght@400&display=swap" rel="stylesheet" />
        </head>
        <body className="font-body antialiased bg-muted text-foreground">
            <div className="flex h-screen items-center justify-center bg-muted">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-lg">Verifying session...</p>
            </div>
            <Toaster />
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        <title>Reviewer Dashboard - DMU Journal</title>
         <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Poltawski+Nowy:wght@400&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-card px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="md:hidden">
              <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
                  <SheetTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                          <MenuIcon className="h-4 w-4" />
                          <span className="sr-only">Open Menu</span>
                      </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="p-0 w-64"
                    aria-labelledby="reviewer-sidebar-title"
                  >
                      <ReviewerDashboardSidebar
                          reviewerName={reviewerName}
                          onLogout={handleLogout}
                          onLinkClick={() => setIsMobileSheetOpen(false)}
                          isMobileSheet={true}
                      />
                  </SheetContent>
              </Sheet>
            </div>
             <h1 className="text-md font-semibold text-primary hidden sm:block">Reviewer Dashboard</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground hidden sm:inline">{reviewerName}</span>
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://placehold.co/40x40.png" alt={reviewerName} data-ai-hint="placeholder avatar" />
              <AvatarFallback>{getInitials(reviewerName)}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="flex min-h-[calc(100vh-3.5rem)]">
          <div className="hidden md:block">
            <ReviewerDashboardSidebar
              reviewerName={reviewerName}
              onLogout={handleLogout}
            />
          </div>

          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-auto bg-muted">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
