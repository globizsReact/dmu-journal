
'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import AdminDashboardSidebar from '@/components/admin/AdminDashboardSidebar';
import { Loader2 } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster"; // Added for admin-specific toasts if needed

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminName, setAdminName] = useState("Admin"); // Default or load from storage
  const [activeTab, setActiveTab] = useState<string>('dashboard'); // Manage active tab for sidebar
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      const role = localStorage.getItem('userRole');
      const name = localStorage.getItem('authorName');

      if (token && role === 'admin') {
        setIsAdmin(true);
        if (name) setAdminName(name);
      } else {
        router.push('/submit'); // Or your main login page
      }
      setIsLoading(false);

      // Handle auth changes from other tabs/windows if necessary
      const handleAuthChange = () => {
        const updatedToken = localStorage.getItem('authToken');
        const updatedRole = localStorage.getItem('userRole');
        if (!updatedToken || updatedRole !== 'admin') {
          setIsAdmin(false);
          router.push('/submit');
        } else {
            const updatedName = localStorage.getItem('authorName');
            if (updatedName) setAdminName(updatedName);
        }
      };
      window.addEventListener('authChange', handleAuthChange);
      return () => {
        window.removeEventListener('authChange', handleAuthChange);
      };
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-muted">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Verifying admin access...</p>
      </div>
    );
  }

  if (!isAdmin) {
    // This case should ideally be handled by the redirect in useEffect,
    // but as a fallback or if the redirect hasn't completed.
    return (
       <div className="flex h-screen items-center justify-center bg-muted">
        <p className="text-lg text-destructive">Access Denied. Redirecting...</p>
      </div>
    );
  }

  // Note: The activeTab state should ideally be managed by the actual page
  // or a more sophisticated state management solution if it needs to persist across layout re-renders
  // or be influenced by routing. For simplicity, it's here but might need refinement.
  // A simple way is to derive it from the current path.
  // For now, child pages will set their own active tab view, the sidebar can get its activeTab from props.

  return (
    <html lang="en">
      <head>
        {/* You can include specific meta tags or links for the admin section here */}
        <title>Admin Dashboard - DMUJ</title>
         <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Poltawski+Nowy:wght@400&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-muted text-foreground">
        <div className="flex min-h-screen">
          <AdminDashboardSidebar
            adminName={adminName}
            activeTab={activeTab} // This will need to be dynamic based on current page/route
            onTabChange={setActiveTab} // This might need to trigger navigation
          />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
