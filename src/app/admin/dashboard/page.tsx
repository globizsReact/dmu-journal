
'use client';

import { useState, useEffect } from 'react';
// useRouter and useToast might be needed for actions within the page, but not for initial auth
// import { useRouter } from 'next/navigation';
// import { useToast } from '@/hooks/use-toast';

import ManuscriptListTable from '@/components/admin/ManuscriptListTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
// AdminDashboardSidebar is now part of AdminLayout

// This page will now be rendered within AdminLayout.tsx
// AdminLayout handles the authentication and shows AdminLoginForm if not authenticated.
// So, this page can assume it's only rendered if the user is an authenticated admin.

export default function AdminDashboardPage() {
  // The activeView state is now primarily managed by URL segments or query params,
  // and the AdminLayout's sidebar will use these for active link highlighting.
  // For simplicity, we can still use local state if the content switching happens
  // purely client-side without URL changes, but URL-based is more robust for deep linking.

  // This component now assumes it's rendered *after* AdminLayout confirms admin access.
  // So, no need for isLoadingAuth here. If specific content inside this page needs loading,
  // that can be handled with its own loading state.

  const [adminName, setAdminName] = useState("Admin User"); // Or fetch if needed

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const name = localStorage.getItem('authorName'); // Assuming admin's name is stored here
        if (name) {
            setAdminName(name);
        }
    }
  }, [])


  // The ManuscriptListTable itself handles its data fetching and loading/error states.
  // This page could act as a container for different views.
  // For now, let's show the overview or manuscripts based on a simplified local state or future routing.
  // This 'activeView' would be better controlled by the URL path in a full app, e.g., /admin/dashboard/overview vs /admin/dashboard/manuscripts

  // For now, let's assume the path will determine what's shown or we default to overview.
  // If window.location.pathname includes '/manuscripts', show ManuscriptListTable
  // This is a simple example; Next.js routing features (nested routes) are better.
  const [showManuscripts, setShowManuscripts] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // This is a simple client-side check. For robust routing, use Next.js nested routes
      // e.g. /admin/dashboard/manuscripts would render a ManuscriptsPage component.
      if (window.location.pathname.includes('/admin/dashboard/manuscripts')) {
        setShowManuscripts(true);
      } else {
        setShowManuscripts(false);
      }
    }
  }, []);


  // If the parent AdminLayout is still loading the session, it will show its own loader.
  // If AdminLayout determined the user is not an admin, it shows AdminLoginForm.
  // Thus, when this component renders, we are an authenticated admin.

  if (showManuscripts) {
    return <ManuscriptListTable />;
  }

  // Default to overview
  return (
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
  );
}
