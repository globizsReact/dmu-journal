
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import ReviewerDashboardSidebar from '@/components/reviewer/ReviewerDashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Clock, CheckSquare, Loader2, AlertTriangle, Eye } from 'lucide-react';
import type { Manuscript, JournalCategory } from '@prisma/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Stat Card component
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

// Dashboard View
const ReviewerDashboardView = ({ stats, isLoading }: { stats: any, isLoading: boolean }) => {
  const statItems = [
    { key: 'totalManuscripts', title: 'Total Manuscripts', value: isLoading ? '...' : stats?.totalManuscripts ?? 0, icon: FileText, colorClass: 'text-blue-500', description: "All manuscripts in the system." },
    { key: 'pendingReviews', title: 'Pending Reviews', value: isLoading ? '...' : stats?.pendingReviews ?? 0, icon: Clock, colorClass: 'text-orange-500', description: "Manuscripts awaiting review." },
    { key: 'completedReviews', title: 'Completed Reviews', value: isLoading ? '...' : stats?.completedReviews ?? 0, icon: CheckSquare, colorClass: 'text-green-500', description: "Reviewed or published manuscripts." },
  ];

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
        {statItems.map(item => (
          <ReviewerStatCard
            key={item.key}
            title={item.title}
            value={item.value}
            icon={item.icon}
            description={item.description}
            colorClass={item.colorClass}
          />
        ))}
      </div>

       <Card>
        <CardHeader>
            <CardTitle className="text-lg md:text-xl font-headline text-primary">Your Tasks</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">
              The "All Manuscripts" section contains articles for you to review.
            </p>
        </CardContent>
      </Card>
    </div>
  );
};


// All Manuscripts View
const ManuscriptsView = () => {
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [journalCategories, setJournalCategories] = useState<JournalCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
      const token = localStorage.getItem('authToken');
      setAuthToken(token);
      if (!token) setIsLoading(false);

      const fetchCategories = async () => {
        try {
          const res = await fetch('/api/public/journal-categories');
          if (!res.ok) throw new Error("Could not fetch categories");
          const data = await res.json();
          setJournalCategories(data);
        } catch (e) {
            console.error(e);
            toast({ title: 'Error', description: 'Could not load journal categories.', variant: 'destructive' });
        } finally {
          setIsLoadingCategories(false);
        }
      };
      fetchCategories();
  }, [toast]);

  const fetchManuscripts = useCallback(async (token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/reviewer/manuscripts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to fetch manuscripts");
      }
      const data = await response.json();
      setManuscripts(data);
    } catch (err: any) {
      setError(err.message);
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    if(authToken) {
      fetchManuscripts(authToken);
    }
  }, [authToken, fetchManuscripts]);
  
  const getJournalName = (journalId: string) => {
    if (isLoadingCategories) return '...';
    const category = journalCategories.find(cat => cat.id === journalId);
    return category ? category.name : 'Unknown Journal';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Loading All Manuscripts...</CardTitle></CardHeader>
        <CardContent className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary"/></CardContent>
      </Card>
    );
  }
  
  if (error) {
     return (
        <Card>
            <CardHeader><CardTitle className="text-destructive">Error</CardTitle></CardHeader>
            <CardContent className="text-center py-8 text-destructive">{error}</CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl font-headline font-bold text-primary">All Manuscripts</CardTitle>
        <CardDescription>
          Browse and manage all manuscripts in the system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {manuscripts.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No manuscripts found in the system.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Article Title</TableHead>
                <TableHead>Journal</TableHead>
                <TableHead>Submitted On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {manuscripts.map(ms => (
                <TableRow key={ms.id}>
                  <TableCell className="font-medium">{ms.articleTitle}</TableCell>
                  <TableCell>{getJournalName(ms.journalCategoryId)}</TableCell>
                  <TableCell>{format(new Date(ms.submittedAt), "dd MMM yyyy")}</TableCell>
                  <TableCell>
                      <span 
                          className={cn('px-2 py-1 text-xs font-semibold rounded-full', {
                            'bg-blue-100 text-blue-700': ms.status === 'Submitted',
                            'bg-yellow-100 text-yellow-700': ms.status === 'In Review',
                            'bg-green-100 text-green-700': ms.status === 'Accepted',
                            'bg-emerald-100 text-emerald-700': ms.status === 'Published',
                            'bg-orange-100 text-orange-700': ms.status === 'Suspended',
                            'bg-red-100 text-red-700': ms.status === 'Rejected',
                            'bg-gray-100 text-gray-700': !['Submitted', 'In Review', 'Accepted', 'Published', 'Suspended', 'Rejected'].includes(ms.status)
                          })}
                      >
                          {ms.status}
                      </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/reviewer/view-manuscript/${ms.id}`}> 
                        <Eye className="w-4 h-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Review</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};


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
    );
};


export default function ReviewerDashboardPage() {
  const [reviewerName, setReviewerName] = useState("Loading...");
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const router = useRouter();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [stats, setStats] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      const role = localStorage.getItem('userRole');
      const name = localStorage.getItem('authorName');
      
      if (!token || role !== 'reviewer') {
        router.push('/submit'); 
      } else {
        setReviewerName(name || "Reviewer");
        setAuthToken(token);
      }
    }
  }, [router]);
  
  const fetchStats = useCallback(async (token: string) => {
    setIsLoadingStats(true);
    try {
        const response = await fetch('/api/reviewer/stats', { headers: { 'Authorization': `Bearer ${token}` } });
        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || "Failed to fetch stats");
        }
        const data = await response.json();
        setStats(data);
    } catch (err: any) {
        toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
        setIsLoadingStats(false);
    }
  }, [toast]);

  useEffect(() => {
    if(authToken) {
        fetchStats(authToken);
    }
  }, [authToken, fetchStats]);


  if (reviewerName === "Loading...") {
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
          {activeTab === 'dashboard' && <ReviewerDashboardView stats={stats} isLoading={isLoadingStats} />}
          {activeTab === 'manuscripts' && <ManuscriptsView />}
          {activeTab === 'guidelines' && <GuidelinesView />}
        </main>
      </div>
      <Footer />
    </div>
  );
}
