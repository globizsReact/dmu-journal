
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import ReviewerDashboardSidebar from '@/components/reviewer/ReviewerDashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, Clock, CheckSquare } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface ReviewerStatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  colorClass?: string;
}

const ReviewerStatCard: React.FC<ReviewerStatCardProps> = ({ title, value, icon: Icon, description, colorClass = "text-primary" }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-5 w-5 ${colorClass}`} />
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold ${colorClass}`}>{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </CardContent>
  </Card>
);


const ReviewerDashboardView = () => {
    // Since we cannot fetch real data without schema changes, we'll use placeholder data.
  const placeholderStats = {
    totalAssigned: 12,
    pendingReviews: 3,
    completedReviews: 9,
  };
    return (
     <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl lg:text-3xl font-headline font-bold text-primary">Reviewer Dashboard</CardTitle>
          <CardDescription>Welcome! Here you can manage your assigned reviews.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Monitor your review tasks and access manuscripts assigned to you for peer review.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ReviewerStatCard 
          title="Total Assigned Manuscripts" 
          value={placeholderStats.totalAssigned} 
          icon={FileText}
          description="All manuscripts assigned to you."
          colorClass="text-blue-500"
        />
        <ReviewerStatCard 
          title="Pending Reviews" 
          value={placeholderStats.pendingReviews} 
          icon={Clock}
          description="Manuscripts awaiting your review."
          colorClass="text-orange-500"
        />
        <ReviewerStatCard 
          title="Completed Reviews" 
          value={placeholderStats.completedReviews} 
          icon={CheckSquare}
          description="Manuscripts you have reviewed."
          colorClass="text-green-500"
        />
      </div>

       <Card>
        <CardHeader>
            <CardTitle className="text-lg md:text-xl font-headline text-primary">Your Tasks</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">
            The "Assigned Manuscripts" section is where you'll find articles to review.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
            (Full functionality for manuscript review is coming soon and requires database schema updates.)
            </p>
        </CardContent>
      </Card>

    </div>
    )
}

const AssignedManuscriptsView = () => {
    return (
         <Card>
            <CardHeader>
                <CardTitle className="text-2xl md:text-3xl font-headline font-bold text-primary">Assigned Manuscripts</CardTitle>
                <CardDescription>This feature is coming soon.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-center text-muted-foreground py-8">
                    Once the functionality to assign manuscripts to reviewers is implemented, you will see your assigned reviews here.
                </p>
            </CardContent>
        </Card>
    )
}

const GuidelinesView = () => {
    return (
         <Card>
            <CardHeader>
                <CardTitle className="text-2xl md:text-3xl font-headline font-bold text-primary">Reviewer Guidelines</CardTitle>
                <CardDescription>Policies and instructions for conducting a peer review.</CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none">
                <h3>Confidentiality</h3>
                <p>Manuscripts are confidential materials. Do not discuss the manuscript with anyone outside the editorial process.</p>
                <h3>Constructive Feedback</h3>
                <p>Provide constructive, specific, and actionable feedback to help the author improve their work.</p>
                <h3>Timeliness</h3>
                <p>Please submit your review by the deadline to ensure a timely decision process for the author.</p>
            </CardContent>
        </Card>
    )
}


export default function ReviewerDashboardPage() {
  const [reviewerName, setReviewerName] = useState("Loading...");
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      const role = localStorage.getItem('userRole');
      const name = localStorage.getItem('authorName');
      
      if (!token || role !== 'reviewer') {
        router.push('/submit'); 
      } else {
        setReviewerName(name || "Reviewer");
      }
    }
  }, [router]);

  if (reviewerName === "Loading...") {
    // This is a minimal client-side loader. The main skeleton is handled by loading.tsx
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-3">Verifying session...</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1 container mx-auto py-8 px-4 md:px-6 lg:px-8">
        <ReviewerDashboardSidebar 
          reviewerName={reviewerName} 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <main className="flex-1 lg:ml-8 mt-8 lg:mt-0">
          {activeTab === 'dashboard' && <ReviewerDashboardView />}
          {activeTab === 'assignedManuscripts' && <AssignedManuscriptsView />}
          {activeTab === 'guidelines' && <GuidelinesView />}
        </main>
      </div>
      <Footer />
    </div>
  );
}
