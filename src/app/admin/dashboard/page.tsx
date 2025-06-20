
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import AdminDashboardSidebar from '@/components/admin/AdminDashboardSidebar';
import ManuscriptListTable from '@/components/admin/ManuscriptListTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast'; // Import useToast

export default function AdminDashboardPage() {
  const [adminName, setAdminName] = useState("Loading...");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard'); // Default to 'dashboard' overview
  const router = useRouter();
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const { toast } = useToast(); // Initialize useToast

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isAuthorLoggedIn') === 'true';
      const storedName = localStorage.getItem('authorName'); 
      const role = localStorage.getItem('userRole');
      
      setUserRole(role);

      if (!isLoggedIn) {
        router.push('/submit'); 
        return;
      }
      
      if (role !== 'admin' && role !== 'reviewer') {
        toast({ // Use the imported toast
            title: "Access Denied",
            description: "You do not have permission to view this page.",
            variant: "destructive",
        });
        router.push('/author/dashboard'); 
        return;
      }

      if (storedName) {
        setAdminName(storedName);
      } else {
        setAdminName("Admin/Reviewer User"); 
      }
      setIsLoadingAuth(false);

      const handleAuthChange = () => {
        const updatedIsLoggedIn = localStorage.getItem('isAuthorLoggedIn') === 'true';
        const updatedRole = localStorage.getItem('userRole');
        if (!updatedIsLoggedIn || (updatedRole !== 'admin' && updatedRole !== 'reviewer')) {
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
  }, [router, toast]); // Add toast to dependency array

  if (isLoadingAuth) {
    return (
        <div className="flex flex-col min-h-screen bg-muted">
            <Header />
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
                <p>Verifying access...</p>
            </div>
            <Footer />
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1 container mx-auto py-8 px-4 md:px-6 lg:px-8">
        <AdminDashboardSidebar 
          adminName={adminName} 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <main className="flex-1 lg:ml-8 mt-8 lg:mt-0">
          {activeTab === 'dashboard' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl font-headline font-bold text-primary">Admin Dashboard Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Welcome, {adminName}! This is the main admin overview page.</p>
                <p className="mt-4 text-muted-foreground">Future content like statistics, user management, journal management, etc., will go here.</p>
              </CardContent>
            </Card>
          )}
          {activeTab === 'viewManuscripts' && <ManuscriptListTable />}
          {/* Add more views for other tabs as needed */}
        </main>
      </div>
      <Footer />
    </div>
  );
}
