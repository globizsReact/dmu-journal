'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// ManuscriptListTable is no longer conditionally rendered here.
// Navigation to the manuscript list will be handled by the sidebar linking to /admin/dashboard/manuscripts.

export default function AdminDashboardPage() {
  const [adminName, setAdminName] = useState("Admin User"); 

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const name = localStorage.getItem('authorName'); // Assuming admin's name is stored here
        if (name) {
            setAdminName(name);
        }
    }
  }, []);

  // The logic for showManuscripts and conditionally rendering ManuscriptListTable
  // has been removed. This page will now solely be the overview.
  // The ManuscriptListTable will be on its own page: /admin/dashboard/manuscripts

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
          <li>View and manage all submitted manuscripts (Navigate via sidebar).</li>
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
