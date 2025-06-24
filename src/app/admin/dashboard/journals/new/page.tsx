'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import JournalCategoryForm from '@/components/admin/forms/JournalCategoryForm';

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
    <JournalCategoryForm
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      authToken={authToken}
    />
  );
}
