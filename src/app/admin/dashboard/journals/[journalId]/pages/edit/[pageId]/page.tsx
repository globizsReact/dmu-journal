
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import JournalPageForm from '@/components/admin/forms/JournalPageForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import LoadingAboutPageEditor from '@/app/admin/dashboard/pages/about/loading';

interface JournalPageData {
  id: string;
  title: string;
  content: any;
  parentId: string | null;
}

export default function EditJournalPage() {
  const params = useParams();
  const router = useRouter();
  const { journalId, pageId } = params;
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageData, setPageData] = useState<JournalPageData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [availableParents, setAvailableParents] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      setAuthToken(token);
    }
  }, []);

  const fetchPageData = useCallback(async (token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const [pageRes, parentsRes] = await Promise.all([
        fetch(`/api/admin/journal-pages/${pageId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`/api/admin/journal-pages?journalCategoryId=${journalId}`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      if (!pageRes.ok) throw new Error('Failed to fetch page data.');
      const pageResult = await pageRes.json();
      setPageData(pageResult);
      
      if (!parentsRes.ok) throw new Error('Failed to fetch potential parent pages.');
      const parentsResult = await parentsRes.json();
      // A page cannot be its own parent or a child of its own children.
      setAvailableParents(parentsResult.filter((p: any) => p.id !== pageId && !p.parentId));

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [pageId, journalId]);

  useEffect(() => {
    if (authToken) {
      fetchPageData(authToken);
    }
  }, [authToken, fetchPageData]);

  const handleSubmit = async (values: any) => {
    if (!authToken) {
      toast({ title: 'Error', description: "Not authenticated.", variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/journal-pages/${pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update page.');
      
      toast({ title: 'Success', description: 'Page updated successfully.' });
      router.push(`/admin/dashboard/journals/view/${journalId}?tab=pages`);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <LoadingAboutPageEditor />;
  if (error) return <Card className="border-destructive"><CardHeader><CardTitle className="text-destructive flex items-center gap-2"><AlertTriangle /> Error Loading Page</CardTitle></CardHeader><CardContent><p>{error}</p></CardContent></Card>;
  if (!pageData) return <div>Page not found.</div>

  return (
    <div className="space-y-4">
      <Button asChild variant="outline" size="sm" className="w-fit">
        <Link href={`/admin/dashboard/journals/view/${journalId}?tab=pages`}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Journal Pages
        </Link>
      </Button>
      <JournalPageForm
        initialData={pageData}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        journalId={journalId as string}
        parentPages={availableParents}
      />
    </div>
  );
}
