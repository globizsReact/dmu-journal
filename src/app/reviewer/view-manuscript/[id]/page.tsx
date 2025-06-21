
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Manuscript } from '@prisma/client';
import { journalCategories } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertTriangle, CheckCircle, ArrowLeft, User, Mail, Building, FileTextIcon, CalendarDays, Sparkles, Tag, FileIcon, BookUp, ShieldOff, PlayCircle } from 'lucide-react';
import { format, isValid } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import ReviewerDashboardSidebar from '@/components/reviewer/ReviewerDashboardSidebar';

interface ManuscriptDetails extends Manuscript {
  submittedBy?: {
    fullName: string | null;
    email: string | null;
  } | null;
  coAuthors?: { title: string; givenName: string; lastName: string; email: string; affiliation: string; country: string }[];
}

type ManuscriptStatus = 'Submitted' | 'In Review' | 'Accepted' | 'Published' | 'Suspended';
type ReviewerActionStatus = 'In Review' | 'Accepted' | 'Suspended';

export default function ReviewerManuscriptDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const manuscriptId = params.id as string;
  const { toast } = useToast();

  const [manuscript, setManuscript] = useState<ManuscriptDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<ReviewerActionStatus | null>(null);
  const [authToken, setAuthToken] = useState<string | undefined>(undefined);
  
  const [reviewerName, setReviewerName] = useState("Reviewer");
  const activeTab = 'assignedManuscripts'; // Keep assigned manuscripts tab active

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      const name = localStorage.getItem('authorName');
      setAuthToken(token || null);
      if (name) setReviewerName(name);
    }
  }, []);

  const handleSidebarNav = (tab: string) => {
    router.push('/reviewer/dashboard');
  };

  const fetchManuscriptDetails = useCallback(async () => {
    if (!manuscriptId || !authToken) {
      if (!authToken && authToken !== undefined) {
         setError("Authentication token not available.");
         setIsLoading(false);
      }
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/reviewer/manuscripts/${manuscriptId}`, {
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
    if (manuscriptId && authToken !== undefined) {
      fetchManuscriptDetails();
    }
  }, [manuscriptId, authToken, fetchManuscriptDetails]);


  const handleUpdateStatus = async (newStatus: ReviewerActionStatus) => {
    if (!manuscript || !authToken) return;
    setLoadingStatus(newStatus);
    try {
      const response = await fetch(`/api/reviewer/manuscripts/${manuscriptId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update status: ${response.status}`);
      }
      const updatedManuscript = await response.json();
      setManuscript(updatedManuscript);
      toast({
        title: "Status Updated",
        description: `Manuscript status changed to ${newStatus}.`,
        variant: 'default',
      });
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err.message || "Could not update manuscript status.",
        variant: "destructive",
      });
    } finally {
      setLoadingStatus(null);
    }
  };

  const getJournalName = (journalId: string) => {
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
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const renderContent = () => {
    if (isLoading) {
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
            <Button onClick={() => router.push('/reviewer/dashboard')} variant="outline" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
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
            <p>The requested manuscript could not be found.</p>
            <Button onClick={() => router.push('/reviewer/dashboard')} variant="outline" className="mt-4">
               <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
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
                  Submitted by: {manuscript.submittedBy?.fullName || 'N/A'} on {formatDisplayDate(manuscript.submittedAt)}
                  </CardDescription>
              </div>
              <Button onClick={() => router.push('/reviewer/dashboard')} variant="outline" size="sm" className="w-full sm:w-auto">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
              </Button>
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
              <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">{manuscript.abstract}</p>
            </section>
            
            <Separator />
            <section className="pt-4">
                <h3 className="text-md font-semibold text-primary mb-3">Review Actions</h3>
                 {manuscript.status === 'Published' ? (
                     <p className="text-emerald-600 font-semibold">This manuscript has already been published.</p>
                 ) : (
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button onClick={() => handleUpdateStatus('In Review')} disabled={!!loadingStatus || manuscript.status === 'In Review'} className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                            {loadingStatus === 'In Review' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlayCircle className="mr-2 h-4 w-4" />}
                            Mark as In Review
                        </Button>
                        <Button onClick={() => handleUpdateStatus('Accepted')} disabled={!!loadingStatus} className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
                            {loadingStatus === 'Accepted' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                            Accept Manuscript
                        </Button>
                        <Button onClick={() => handleUpdateStatus('Suspended')} disabled={!!loadingStatus} className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto">
                            {loadingStatus === 'Suspended' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldOff className="mr-2 h-4 w-4" />}
                            Suspend Manuscript
                        </Button>
                    </div>
                )}
            </section>

        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1 container mx-auto py-8 px-4 md:px-6 lg:px-8">
        <ReviewerDashboardSidebar
          reviewerName={reviewerName}
          activeTab={activeTab}
          onTabChange={handleSidebarNav}
        />
        <main className="flex-1 lg:ml-8 mt-8 lg:mt-0">
          {renderContent()}
        </main>
      </div>
      <Footer />
    </div>
  );
}
