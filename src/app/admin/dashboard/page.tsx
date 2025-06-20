
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Removed Header and Footer imports as they are not used in the new admin layout
import ManuscriptListTable from '@/components/admin/ManuscriptListTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdminDashboardSidebar from '@/components/admin/AdminDashboardSidebar'; // For types, might be removed if layout provides context

// This page will now be rendered within AdminLayout.tsx

export default function AdminDashboardPage() {
  const [adminName, setAdminName] = useState("Loading...");
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // Still useful for page-specific content loading
  const [activeView, setActiveView] = useState<'overview' | 'manuscripts'>('overview');
  const router = useRouter();
  const { toast } = useToast();

  // The primary auth check is now in AdminLayout.tsx
  // This useEffect can focus on fetching user-specific details for the dashboard content
  // or ensuring the role is still valid if a direct navigation occurs.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('userRole');
      const name = localStorage.getItem('authorName');

      if (role !== 'admin') {
        // This should ideally be caught by AdminLayout, but as a safeguard:
        toast({
            title: "Access Denied",
            description: "You do not have permission to view this page. Admin access required.",
            variant: "destructive",
        });
        router.push('/submit'); // Or home page
        return;
      }

      if (name) {
        setAdminName(name);
      } else {
        setAdminName("Admin User");
      }
      setIsLoadingAuth(false);

      // Update activeView based on current path or internal state
      // For now, we handle this with buttons/sidebar clicks.
      // Example: if path is /admin/dashboard/manuscripts, setActiveView('manuscripts')
      // This can be done by passing the activeTab from AdminLayout, or page reading its own path
    }
  }, [router, toast]);
  
  // This function will be passed to AdminDashboardSidebar now via AdminLayout
  // The AdminLayout will need to manage a shared state or use routing to set active views.
  // For this example, we'll manage it internally in this page, but AdminLayout's sidebar will control it.
  const handleTabChange = (tabKey: string) => {
    if (tabKey === 'dashboard') {
      setActiveView('overview');
    } else if (tabKey === 'viewManuscripts') {
      setActiveView('manuscripts');
    }
    // Potentially update URL here for deep linking if using routing for tabs
    // router.push(`/admin/dashboard?view=${tabKey}`);
  };


  // Loading state for this specific page's content, after layout has confirmed admin access
  if (isLoadingAuth) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
        <p>Loading dashboard content...</p>
      </div>
    );
  }

  return (
    // The AdminDashboardSidebar is now part of AdminLayout.
    // The main tag here represents the content area to the right of the sidebar.
    <>
      {activeView === 'overview' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-headline font-bold text-primary">Admin Dashboard Overview</CardTitle>
            <CardDescription>Welcome, {adminName}! This is the central hub for managing journals, users, and submissions.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              From here, you can:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
              <li>View and manage all submitted manuscripts.</li>
              <li>Oversee user accounts (authors, reviewers, editors). (Future Feature)</li>
              <li>Manage journal categories and settings. (Future Feature)</li>
              <li>View site statistics and reports. (Future Feature)</li>
            </ul>
            <p className="mt-6 font-semibold text-primary">
              Select an option from the sidebar to get started.
            </p>
          </CardContent>
        </Card>
      )}
      {activeView === 'manuscripts' && <ManuscriptListTable />}
      {/* 
        Future sections:
        {activeView === 'users' && <UserManagementTable />}
        {activeView === 'journals' && <JournalManagementPanel />}
      */}
    </>
  );
}
