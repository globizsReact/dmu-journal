
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import JournalPageForm from '@/components/admin/forms/JournalPageForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewJournalPage() {
  const router = useRouter();
  const params = useParams();
  const journalId = params.journalId as string;
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [availableParents, setAvailableParents] = useState<{ id: string; title: string }[]>([]);

  const fetchParentPages = useCallback(async (token: string) => {
    try {
        const response = await fetch(`/api/admin/journal-pages?journalCategoryId=${journalId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch parent pages');
        const data = await response.json();
        setAvailableParents(data.filter((p: any) => !p.parentId)); // Only top-level pages can be parents
    } catch (error) {
        console.error('Failed to load parent pages', error);
        toast({ title: "Error", description: "Could not load parent pages for selection.", variant: "destructive" });
    }
  }, [journalId, toast]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      setAuthToken(token);
      if (token) {
        fetchParentPages(token);
      }
    }
  }, [fetchParentPages]);

  const handleSubmit = async (values: any) => {
    if (!authToken) {
      toast({ title: 'Error', description: "Not authenticated.", variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/journal-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ ...values, journalId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create page.');
      
      toast({ title: 'Success', description: 'Page created successfully.' });
      router.push(`/admin/dashboard/journals/view/${journalId}?tab=pages`);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button asChild variant="outline" size="sm" className="w-fit">
        <Link href={`/admin/dashboard/journals/view/${journalId}?tab=pages`}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Journal Pages
        </Link>
      </Button>
      <JournalPageForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        journalId={journalId}
        parentPages={availableParents}
      />
    </div>
  );
}
