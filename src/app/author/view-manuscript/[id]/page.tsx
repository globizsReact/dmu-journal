
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Manuscript, JournalCategory } from '@prisma/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertTriangle, ArrowLeft, Mail, Building, FileTextIcon, Sparkles, Tag } from 'lucide-react';
import { format, isValid } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import DashboardSidebar from '@/components/author/DashboardSidebar';
import Link from 'next/link';
import TiptapRenderer from '@/components/shared/TiptapRenderer';

interface ManuscriptDetails extends Manuscript {
  submittedBy?: {
    fullName: string | null;
    email: string | null;
  } | null;
  coAuthors?: { title: string; givenName: string; lastName: string; email: string; affiliation: string; country: string }[];
}

type ManuscriptStatus = 'Submitted' | 'In Review' | 'Accepted' | 'Published' | 'Suspended' | 'Rejected';

const Breadcrumbs = ({ manuscriptTitle }: { manuscriptTitle: string }) => (
  <div className="text-sm text-muted-foreground flex items-center gap-1.5 flex-wrap">
    <Link href="/author/dashboard" className="hover:text-primary">Dashboard</Link>
    <span>/</span>
    <Link href="/author/dashboard" className="hover:text-primary">My Manuscripts</Link>
    <span>/</span>
    <span className="font-medium text-foreground truncate">{manuscriptTitle}</span>
  </div>
);


export default function AuthorManuscriptDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const manuscriptId = params.id as string;
  const { toast } = useToast();

  const [manuscript, setManuscript] = useState<ManuscriptDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | undefined>(undefined);
  
  const [authorName, setAuthorName] = useState("Author");
  const activeTab = 'myManuscript';
  const [journalCategories, setJournalCategories] = useState<JournalCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      const token = localStorage.getItem('authToken');
      const name = localStorage.getItem('authorName');
      setAuthToken(token || null);
      if (name) setAuthorName(name);

      // Fetch categories
      try {
        const response = await fetch('/api/public/journal-categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setJournalCategories(data);
      } catch (err: any) {
        console.error("Error fetching categories:", err);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    if (typeof window !== 'undefined') {
      fetchInitialData();
    }
  }, []);

  const handleSidebarNav = (tab: string) => {
    // This is a simplified navigation. It sends the user back to the main dashboard.
    // A more advanced implementation might use query params to select the tab.
    router.push('/author/dashboard');
  };

  const fetchManuscriptDetails = useCallback(async () => {
    if (!manuscriptId || !authToken) {
      if (!authToken && authToken !== undefined) { // only set error if auth check has completed and failed
         setError("Authentication token not available for fetching details.");
         setIsLoading(false);
      }
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/author/manuscripts/${manuscriptId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch manuscript: ${response.status}`);
      }
      const data: ManuscriptDetails = await response.json();
      setManuscript(data);
    } catch (err: any) {
      console.error("Error fetching manuscript details:", err);
      toast({ title: "Error", description: err.message || "An unexpected error occurred.", variant: "destructive" });
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [manuscriptId, authToken, toast]); 

  useEffect(() => {
    if (manuscriptId && authToken) {
      fetchManuscriptDetails();
    } else if (manuscriptId && authToken === null) {
      setError("Authentication token not found. Please log in to view your manuscript.");
      setIsLoading(false);
    }
  }, [manuscriptId, authToken, fetchManuscriptDetails]);


  const getJournalName = (journalId: string) => {
    if (isLoadingCategories) return '...';
    const category = journalCategories.find(cat => cat.id === journalId);
    return category ? category.name : 'Unknown Journal';
  };

  const formatDisplayDate = (dateString: string | Date | null | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return isValid(date) ? format(date, 'MMMM d, yyyy, h:mm a') : 'Invalid Date';
    } catch {
      return 'Error formatting date';
    }
  };
  
  const statusBadgeColor = (status: ManuscriptStatus) => {
    switch (status) {
      case 'Submitted': return 'bg-blue-500 hover:bg-blue-600';
      case 'In Review': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'Accepted': return 'bg-green-500 hover:bg-green-600';
      case 'Published': return 'bg-emerald-600 hover:bg-emerald-700';
      case 'Suspended': return 'bg-orange-500 hover:bg-orange-600';
      case 'Rejected': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const renderContent = () => {
    if (isLoading) {
      // The loading.tsx file will be rendered by Next.js, 
      // but this can be a fallback for client-side loading state changes
      return (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      );
    }

    if (error) {
      return (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2"><AlertTriangle size={24} /> Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      );
    }

    if (!manuscript) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Manuscript Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The requested manuscript could not be found or you may not have permission to view it.</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="shadow-lg">
        <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                <div className="flex-grow">
                    <CardTitle className="text-xl md:text-2xl lg:text-3xl font-headline text-primary mb-1">{manuscript.articleTitle}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                    Submitted on: {formatDisplayDate(manuscript.submittedAt)}
                    </CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <section className="p-4 border rounded-md bg-muted/30">
            <h3 className="text-lg font-semibold text-primary mb-3">Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                <p className="font-medium text-muted-foreground flex items-center"><FileTextIcon className="w-4 h-4 mr-2 text-sky-600" />Journal Category</p>
                <p>{getJournalName(manuscript.journalCategoryId)}</p>
                </div>
                <div>
                <p className="font-medium text-muted-foreground flex items-center"><Tag className="w-4 h-4 mr-2 text-purple-600" />Current Status</p>
                <Badge className={cn(statusBadgeColor(manuscript.status as ManuscriptStatus), "text-white")}>{manuscript.status}</Badge>
                </div>
                <div>
                <p className="font-medium text-muted-foreground flex items-center"><Sparkles className="w-4 h-4 mr-2 text-yellow-600" />Special Review</p>
                <p>{manuscript.isSpecialReview ? 'Yes' : 'No'}</p>
                </div>
            </div>
            </section>

            <Separator />

            <section>
              <h3 className="text-lg md:text-xl font-headline font-semibold text-primary mb-2">Abstract</h3>
              <TiptapRenderer
                jsonContent={manuscript.abstract}
                className="prose prose-sm sm:prose-base max-w-none font-body text-foreground/80"
              />
            </section>
            
            {manuscript.keywords && (
            <section>
                <h3 className="text-md font-semibold text-primary mb-1">Keywords</h3>
                <p className="text-sm text-foreground/70">{manuscript.keywords}</p>
            </section>
            )}
            
            <Separator />

            {manuscript.coAuthors && manuscript.coAuthors.length > 0 && (
                <section>
                    <h3 className="text-lg md:text-xl font-headline font-semibold text-primary mb-3">Co-Author(s)</h3>
                    <div className="space-y-4">
                        {manuscript.coAuthors.map((author, index) => (
                            <div key={index} className="p-3 border rounded-md bg-card shadow-sm">
                                <p className="font-semibold text-primary/90 text-md">{author.title} {author.givenName} {author.lastName}</p>
                                <p className="text-xs text-muted-foreground flex items-center"><Mail className="w-3.5 h-3.5 mr-1.5"/>{author.email}</p>
                                <p className="text-xs text-muted-foreground flex items-center"><Building className="w-3.5 h-3.5 mr-1.5"/>{author.affiliation} ({author.country})</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <Separator />
            
            <section>
                <h3 className="text-lg font-semibold text-primary mb-3">Submitted Files</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-foreground/80">
                    {manuscript.manuscriptFileName && <li><strong className="text-foreground">Manuscript:</strong> {manuscript.manuscriptFileName}</li>}
                    {manuscript.coverLetterFileName && <li><strong className="text-foreground">Cover Letter:</strong> {manuscript.coverLetterFileName}</li>}
                    {manuscript.supplementaryFilesName && <li><strong className="text-foreground">Supplementary Files:</strong> {manuscript.supplementaryFilesName}</li>}
                </ul>
            </section>

        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1 container mx-auto py-8 px-4 md:px-6 lg:px-8">
        <DashboardSidebar
          authorName={authorName}
          activeTab={activeTab}
          onTabChange={handleSidebarNav}
        />
        <main className="flex-1 lg:ml-8 mt-8 lg:mt-0">
          {manuscript && !isLoading && !error && (
            <div className="mb-6 space-y-4">
               <Button onClick={() => router.push('/author/dashboard')} variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Manuscripts
              </Button>
              <Breadcrumbs manuscriptTitle={manuscript.articleTitle} />
            </div>
          )}
          {renderContent()}
        </main>
      </div>
      <Footer />
    </div>
  );
}
