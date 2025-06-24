
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import JournalCategoryForm from '@/components/admin/forms/JournalCategoryForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const Breadcrumbs = () => (
  <div className="text-sm text-muted-foreground flex items-center gap-1.5 flex-wrap">
    <Link href="/admin/dashboard" className="hover:text-primary">Admin</Link>
    <span>/</span>
    <Link href="/admin/dashboard/journals" className="hover:text-primary">Journals</Link>
    <span>/</span>
    <span className="font-medium text-foreground">New Category</span>
  </div>
);

export default function NewJournalCategoryPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      setAuthToken(token);
    }
  }, []);

  const handleSubmit = async (values: any) => {
    if (!authToken) {
      toast({ title: 'Error', description: "Not authenticated.", variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/journal-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create category.');
      
      toast({ title: 'Success', description: 'Journal category added successfully.' });
      router.push('/admin/dashboard/journals');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!authToken) {
    // You can return a loader or a message while waiting for the token
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
        <div className="space-y-2">
            <Button asChild variant="outline" size="sm" className="w-fit">
                <Link href="/admin/dashboard/journals">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Journals
                </Link>
            </Button>
            <Breadcrumbs />
        </div>
        <JournalCategoryForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        authToken={authToken}
        />
    </div>
  );
}
