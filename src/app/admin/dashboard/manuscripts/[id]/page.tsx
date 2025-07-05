
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Manuscript, JournalCategory } from '@prisma/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertTriangle, CheckCircle, XCircle, ArrowLeft, User, Mail, Building, FileTextIcon, CalendarDays, Sparkles, Tag, FileIcon, BookUp, ShieldOff, Eye } from 'lucide-react';
import { format, isValid } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import TiptapRenderer from '@/components/shared/TiptapRenderer';
import Image from 'next/image';
import { toPublicUrl } from '@/lib/urlUtils';
import Link from 'next/link';

interface ManuscriptDetails extends Manuscript {
  submittedBy?: {
    fullName: string | null;
    email: string | null;
  } | null;
  coAuthors?: { title: string; givenName: string; lastName: string; email: string; affiliation: string; country: string }[];
}

type ManuscriptStatus = 'Submitted' | 'In Review' | 'Accepted' | 'Published' | 'Suspended';


export default function ManuscriptDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const manuscriptId = params.id as string;
  const { toast } = useToast();

  const [manuscript, setManuscript] = useState<ManuscriptDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<ManuscriptStatus | null>(null);
  const [authToken, setAuthToken] = useState<string | undefined>(undefined); // Initialize as undefined
  const [journalCategories, setJournalCategories] = useState<JournalCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      const token = localStorage.getItem('authToken');
      setAuthToken(token || null); // Set to null if not found, to distinguish from initial undefined

      // Fetch categories
      try {
        const response = await fetch('/api/public/journal-categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setJournalCategories(data);
      } catch (err: any) {
        console.error("Error fetching journal categories:", err);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    if (typeof window !== 'undefined') {
      fetchInitialData();
    }
  }, []);

  const fetchManuscriptDetails = useCallback(async () => {
    // Guard clause: ensure manuscriptId and authToken (state) are present.
    if (!manuscriptId || !authToken) {
      if (!authToken) {
         setError("Authentication token not available for fetching details.");
         setIsLoading(false);
      }
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/manuscripts/${manuscriptId}`, {
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
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [manuscriptId, authToken]); 

  useEffect(() => {
    if (manuscriptId && authToken) {
      fetchManuscriptDetails();
    } else if (manuscriptId && authToken === null) {
      setError("Authentication token not found. Cannot load manuscript.");
      setIsLoading(false);
    }
  }, [manuscriptId, authToken, fetchManuscriptDetails]);


  const handleUpdateStatus = async (newStatus: ManuscriptStatus) => {
    if (!manuscript || !authToken) return;
    setLoadingStatus(newStatus);
    try {
      const response = await fetch(`/api/admin/manuscripts/${manuscriptId}`, {
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
    if (isLoadingCategories) return '...';
    const category = journalCategories.find(cat => cat.id === journalId);
    return category ? category.name : 'Unknown Journal';
  };
  
  const getFileNameFromUrl = (url: string) => {
    try {
      return new URL(url).pathname.split('/').pop() || 'file';
    } catch {
      return url;
    }
  }

  const formatDisplayDate = (dateString: string | Date | null | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return isValid(date) ? format(date, 'MMMM d, yyyy, h:mm a') : 'Invalid Date';
    } catch {
      return 'Error formatting date';
    }
  };

  if (isLoading && authToken !== null) { // Show loading only if token isn't explicitly null (which means error state)
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="flex justify-center items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg text-muted-foreground">Loading manuscript details...</p>
        </CardContent>
      </Card>
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
          <Button onClick={() => router.back()} variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!manuscript && !isLoading) { // Added !isLoading to prevent showing "Not Found" during initial load
    return (
      <Card>
        <CardHeader>
          <CardTitle>Manuscript Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The requested manuscript could not be found or you may not have permission to view it.</p>
          <Button onClick={() => router.back()} variant="outline" className="mt-4">
             <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // If manuscript is null but we are still in initial undefined authToken state, don't render main content yet.
  if (!manuscript) return null;


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

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
            <div className="flex-grow">
                <CardTitle className="text-xl md:text-2xl lg:text-3xl font-headline text-primary mb-1">{manuscript.articleTitle}</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                Submitted by: {manuscript.submittedBy?.fullName || 'N/A'} ({manuscript.submittedBy?.email || 'N/A'})
                </CardDescription>
            </div>
            <Button onClick={() => router.push('/admin/dashboard/manuscripts')} variant="outline" size="sm" className="w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
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
              <p className="font-medium text-muted-foreground flex items-center"><CalendarDays className="w-4 h-4 mr-2 text-orange-600" />Submitted At</p>
              <p>{formatDisplayDate(manuscript.submittedAt)}</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground flex items-center"><Sparkles className="w-4 h-4 mr-2 text-yellow-600" />Special Review</p>
              <p>{manuscript.isSpecialReview ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground flex items-center"><FileIcon className="w-4 h-4 mr-2 text-indigo-600" />Manuscript File</p>
               {manuscript.manuscriptFileName ? (
                 <Button asChild variant="link" className="p-0 h-auto text-sm text-foreground hover:text-primary">
                    <Link href={toPublicUrl(manuscript.manuscriptFileName)} target="_blank" rel="noopener noreferrer">
                      View PDF <Eye className="w-3.5 h-3.5 ml-1.5" />
                    </Link>
                  </Button>
               ) : <p className="truncate">N/A</p>}
            </div>
             {manuscript.coverLetterFileName && (
                <div>
                    <p className="font-medium text-muted-foreground flex items-center"><FileIcon className="w-4 h-4 mr-2 text-pink-600" />Cover Letter</p>
                    <p className="truncate">{getFileNameFromUrl(manuscript.coverLetterFileName)}</p>
                </div>
            )}
            {manuscript.supplementaryFilesName && (
                <div>
                    <p className="font-medium text-muted-foreground flex items-center"><FileIcon className="w-4 h-4 mr-2 text-teal-600" />Supplementary File</p>
                    {manuscript.supplementaryFilesName ? (
                      <Button asChild variant="link" className="p-0 h-auto text-sm text-foreground hover:text-primary">
                        <Link href={toPublicUrl(manuscript.supplementaryFilesName)} target="_blank" rel="noopener noreferrer">
                          View PDF <Eye className="w-3.5 h-3.5 ml-1.5" />
                        </Link>
                      </Button>
                    ) : <p className="truncate">N/A</p>}
                </div>
            )}
          </div>
        </section>

        <Separator />
        
        {manuscript.thumbnailImagePath && (
            <>
                <section>
                    <h3 className="text-lg font-semibold text-primary mb-3">Cover Letter Image</h3>
                    <div className="relative w-full max-w-sm aspect-video rounded-md overflow-hidden border">
                        <Image
                            src={toPublicUrl(manuscript.thumbnailImagePath)}
                            alt="Manuscript thumbnail"
                            fill
                            sizes="(max-width: 640px) 100vw, 33vw"
                            className="object-cover"
                            data-ai-hint={manuscript.thumbnailImageHint || "journal thumbnail"}
                        />
                    </div>
                </section>
                <Separator />
            </>
        )}

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
        <section className="pt-4">
            <h3 className="text-md font-semibold text-primary mb-3">Actions</h3>
            <div className="flex flex-col sm:flex-row gap-3">
            {manuscript.status === 'Submitted' || manuscript.status === 'In Review' ? (
                <>
                    <Button onClick={() => handleUpdateStatus('Accepted')} disabled={!!loadingStatus} className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
                        {loadingStatus === 'Accepted' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                        Accept
                    </Button>
                    <Button onClick={() => handleUpdateStatus('Suspended')} disabled={!!loadingStatus} className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto">
                        {loadingStatus === 'Suspended' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldOff className="mr-2 h-4 w-4" />}
                        Suspend
                    </Button>
                </>
            ) : manuscript.status === 'Accepted' ? (
                <>
                    <Button onClick={() => handleUpdateStatus('Published')} disabled={!!loadingStatus} className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto">
                        {loadingStatus === 'Published' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BookUp className="mr-2 h-4 w-4" />}
                        Publish
                    </Button>
                    <Button onClick={() => handleUpdateStatus('Suspended')} disabled={!!loadingStatus} className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto">
                        {loadingStatus === 'Suspended' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldOff className="mr-2 h-4 w-4" />}
                        Suspend
                    </Button>
                </>
            ) : manuscript.status === 'Published' ? (
                <p className="text-emerald-600 font-semibold">This manuscript has been published.</p>
            ) : manuscript.status === 'Suspended' ? (
                <p className="text-orange-600 font-semibold">This manuscript has been suspended.</p>
            ) : null}
            </div>
        </section>

      </CardContent>
    </Card>
  );
}
