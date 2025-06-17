
'use client';

import { useState } from 'react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import DashboardSidebar from '@/components/author/DashboardSidebar';
import DashboardStatCard from '@/components/author/DashboardStatCard';
import type { DashboardStatCardProps } from '@/components/author/DashboardStatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const dashboardItems: DashboardStatCardProps[] = [
  { title: 'NEW SUBMISSION', value: '0', variant: 'default', viewAllHref: '#' },
  { title: 'MANUSCRIPTS IN REVIEW', value: '0', variant: 'info', viewAllHref: '#' },
  { title: 'ACCEPTED MANUSCRIPTS', value: '0', variant: 'default', viewAllHref: '#' },
  { 
    title: 'PAYMENTS DUE', 
    value: '$0.00', 
    variant: 'success', 
    viewAllHref: '#', 
    actionButton: { text: 'Pay Now', href: '#'} 
  },
  { title: 'PUBLISHED MANUSCRIPTS', value: '0', variant: 'info', viewAllHref: '#' },
  { title: 'SUSPENDED MANUSCRIPTS', value: '0', variant: 'default', viewAllHref: '#' },
  { title: 'WAIVER REQUESTS', value: '0', variant: 'default', viewAllHref: '#' },
];

// Placeholder components for tab content
const SubmitManuscriptView = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-2xl md:text-3xl font-headline font-bold text-primary">Submit New Manuscript</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-foreground/80">Detailed form and instructions for submitting a new manuscript will appear here. This section will guide authors through the process of uploading their research work, providing metadata, and agreeing to submission terms.</p>
    </CardContent>
  </Card>
);

const MyManuscriptView = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-2xl md:text-3xl font-headline font-bold text-primary">My Manuscripts</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-foreground/80">This section will display a list of all manuscripts submitted by the author, including their status (e.g., under review, revisions required, accepted, published). Authors will be able to track progress and access details for each submission.</p>
    </CardContent>
  </Card>
);

const EditProfileView = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-2xl md:text-3xl font-headline font-bold text-primary">View/Edit Profile</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-foreground/80">Authors will be able to view and update their personal information, institutional affiliations, contact details, and areas of expertise here. Maintaining an up-to-date profile is important for communication.</p>
    </CardContent>
  </Card>
);


export default function AuthorDashboardPage() {
  const authorName = "Dr. Santosh Sharma";
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  return (
    <div className="flex flex-col min-h-screen bg-muted">
      <Header />
      <div className="flex flex-1 container mx-auto py-8 px-4 md:px-6 lg:px-8">
        <DashboardSidebar 
          authorName={authorName} 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <main className="flex-1 lg:ml-8 mt-8 lg:mt-0">
          {activeTab === 'dashboard' && (
            <>
              <h1 className="text-3xl font-headline font-bold text-primary mb-8">Author Dashboard</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardItems.map((item) => (
                  <DashboardStatCard
                    key={item.title}
                    title={item.title}
                    value={item.value}
                    variant={item.variant}
                    viewAllHref={item.viewAllHref}
                    actionButton={item.actionButton}
                  />
                ))}
              </div>
              <div className="text-center mt-12 text-muted-foreground">
                <p>2025 Academic Journal</p>
              </div>
            </>
          )}
          {activeTab === 'submitManuscript' && <SubmitManuscriptView />}
          {activeTab === 'myManuscript' && <MyManuscriptView />}
          {activeTab === 'editProfile' && <EditProfileView />}
        </main>
      </div>
      <Footer />
    </div>
  );
}
