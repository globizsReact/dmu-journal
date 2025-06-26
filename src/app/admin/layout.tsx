
'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminDashboardSidebar from '@/components/admin/AdminDashboardSidebar';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import { Loader2, Menu as MenuIcon } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster";
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isAuthenticatedAdmin, setIsAuthenticatedAdmin] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      const role = localStorage.getItem('userRole');
      const name = localStorage.getItem('authorName');

      if (token && role === 'admin') {
        setIsAuthenticatedAdmin(true);
        if (name) setAdminName(name);
      } else {
        setIsAuthenticatedAdmin(false);
      }
      setIsLoadingSession(false);

      const handleAuthChange = () => {
        const updatedToken = localStorage.getItem('authToken');
        const updatedRole = localStorage.getItem('userRole');
        if (updatedToken && updatedRole === 'admin') {
          setIsAuthenticatedAdmin(true);
          const updatedName = localStorage.getItem('authorName');
          if (updatedName) setAdminName(updatedName);
        } else {
          setIsAuthenticatedAdmin(false);
        }
      };
      window.addEventListener('authChange', handleAuthChange);
      return () => {
        window.removeEventListener('authChange', handleAuthChange);
      };
    }
  }, []);

  useEffect(() => {
    setIsMobileSheetOpen(false);
  }, [pathname]);


  const handleLoginSuccess = () => {
    setIsAuthenticatedAdmin(true);
    const name = localStorage.getItem('authorName');
    if (name) setAdminName(name);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('authorName');
        window.dispatchEvent(new CustomEvent('authChange'));
        setIsMobileSheetOpen(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  if (isLoadingSession) {
    return (
      <html lang="en">
        <head>
            <title>Loading Admin Panel - DMU Journal</title>
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

  if (!isAuthenticatedAdmin) {
    return (
       <html lang="en">
        <head>
            <title>Admin Login - DMU Journal</title>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Poltawski+Nowy:wght@400&display=swap" rel="stylesheet" />
        </head>
        <body className="font-body antialiased bg-muted text-foreground">
            <AdminLoginForm onLoginSuccess={handleLoginSuccess} />
            <Toaster />
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        <title>Admin Dashboard - DMU Journal</title>
         <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Poltawski+Nowy:wght@400&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground overflow-hidden">
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
                    aria-labelledby="admin-sidebar-title"
                  >
                      {/* Visually hidden title for accessibility as required by Radix Dialog (Sheet) */}
                      <SheetTitle className="sr-only">Admin Navigation Menu</SheetTitle>
                      <AdminDashboardSidebar
                          adminName={adminName}
                          onLogout={handleLogout}
                          onLinkClick={() => setIsMobileSheetOpen(false)}
                          isMobileSheet={true}
                      />
                  </SheetContent>
              </Sheet>
            </div>
             <h1 className="text-md font-semibold text-primary hidden sm:block">Admin Dashboard</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground hidden sm:inline">{adminName}</span>
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://placehold.co/40x40.png" alt={adminName} data-ai-hint="placeholder avatar" />
              <AvatarFallback>{getInitials(adminName)}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="flex h-[calc(100vh-3.5rem)]">
          <div className="hidden md:block">
            <AdminDashboardSidebar
              adminName={adminName}
              onLogout={handleLogout}
            />
          </div>

          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto bg-muted">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
    
