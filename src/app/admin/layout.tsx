
'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import AdminDashboardSidebar from '@/components/admin/AdminDashboardSidebar';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import { Loader2 } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isAuthenticatedAdmin, setIsAuthenticatedAdmin] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const [activeTab, setActiveTab] = useState<string>('dashboard'); // For sidebar, might be controlled by path
  const router = useRouter();

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

  const handleLoginSuccess = () => {
    setIsAuthenticatedAdmin(true);
    const name = localStorage.getItem('authorName');
    if (name) setAdminName(name);
    router.replace(window.location.pathname); 
  };
  
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('authorName');
        window.dispatchEvent(new CustomEvent('authChange'));
    }
  };

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
      <body className="font-body antialiased bg-muted text-foreground">
        <div className="flex min-h-screen">
          <AdminDashboardSidebar
            adminName={adminName}
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            onLogout={handleLogout}
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
