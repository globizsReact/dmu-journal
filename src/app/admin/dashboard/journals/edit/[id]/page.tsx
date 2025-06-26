'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import JournalCategoryForm from '@/components/admin/forms/JournalCategoryForm';
import type { JournalCategory } from '@prisma/client';
import LoadingEditJournalCategoryPage from './loading';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import JournalCategoryPagesManager from '@/components/admin/JournalCategoryPagesManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Breadcrumbs = ({ categoryName }: { categoryName: string }) => (
  <div className="text-sm text-muted-foreground flex items-center gap-1.5 flex-wrap">
    <Link href="/admin/dashboard" className="hover:text-primary">Admin</Link>
    <span>/</span>
    <Link href="/admin/dashboard/journals" className="hover:text-primary">Journals</Link>
    <span>/</span>
    <span className="font-medium text-foreground truncate">{categoryName}</span>
  </div>
);


export default function EditJournalCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<JournalCategory | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      setAuthToken(token);
    }
  }, []);

  const fetchCategory = useCallback(async (token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/journal-categories/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch category data.');
      }
      const data = await response.json();
      setCategory(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (authToken && id) {
      fetchCategory(authToken);
    }
  }, [authToken, id, fetchCategory]);


  const handleSubmit = async (values: any) => {
    if (!authToken) {
      toast({ title: 'Error', description: "Not authenticated.", variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/journal-categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update category.');
      
      toast({ title: 'Success', description: 'Journal category updated successfully.' });
      router.push('/admin/dashboard/journals');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingEditJournalCategoryPage />;
  }

  if (error) {
    return (
        <Card className="border-destructive">
            <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2"><AlertTriangle /> Error Loading Category</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{error}</p>
            </CardContent>
        </Card>
    );
  }

  if (!category || !authToken) {
    return <div>Category not found or you are not authorized.</div>;
  }

  return (
     <div className="space-y-4">
        <div className="space-y-2">
            <Button asChild variant="outline" size="sm" className="w-fit">
                <Link href="/admin/dashboard/journals">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Journals
                </Link>
            </Button>
            <Breadcrumbs categoryName={category.name} />
        </div>
        
        <Tabs defaultValue="details" className="w-full">
            <TabsList>
                <TabsTrigger value="details">Journal Details</TabsTrigger>
                <TabsTrigger value="pages">Manage Pages</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-4">
                <JournalCategoryForm
                    initialData={category}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    authToken={authToken}
                />
            </TabsContent>
            <TabsContent value="pages" className="mt-4">
                 <Card>
                     <CardHeader>
                        <JournalCategoryPagesManager.Title />
                     </CardHeader>
                     <CardContent className="p-6 pt-0">
                        <JournalCategoryPagesManager.Content 
                            journalCategoryId={id} 
                            authToken={authToken} 
                        />
                     </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
