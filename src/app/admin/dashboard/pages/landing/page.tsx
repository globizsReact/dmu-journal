
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, AlertTriangle, Save } from 'lucide-react';
import LoadingAboutPageEditor from './loading';

const landingPageSchema = z.object({
  heroTitle: z.string().min(3, 'Hero title must be at least 3 characters.'),
  heroSubtitle: z.string().min(10, 'Hero subtitle must be at least 10 characters.'),
  journalSectionTitle: z.string().min(3, 'Journal section title must be at least 3 characters.'),
  journalSectionSubtitle: z.string().min(3, 'Journal section subtitle must be at least 3 characters.'),
});

type LandingPageFormValues = z.infer<typeof landingPageSchema>;

export default function EditLandingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<LandingPageFormValues>({
    resolver: zodResolver(landingPageSchema),
    defaultValues: {
      heroTitle: '',
      heroSubtitle: '',
      journalSectionTitle: '',
      journalSectionSubtitle: '',
    },
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      setAuthToken(token);
    }
  }, []);

  const fetchPageContent = useCallback(async (token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/pages/landing', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch page data.');
      }
      const data = await response.json();
      form.reset(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [form]);

  useEffect(() => {
    if (authToken) {
      fetchPageContent(authToken);
    }
  }, [authToken, fetchPageContent]);

  const handleSubmit = async (values: LandingPageFormValues) => {
    if (!authToken) {
      toast({ title: 'Error', description: "Not authenticated.", variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/pages/landing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update page.');
      
      toast({ title: 'Success', description: "Landing page content updated successfully." });
      form.reset(data);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingAboutPageEditor />;
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2"><AlertTriangle /> Error Loading Page</CardTitle>
        </CardHeader>
        <CardContent><p>{error}</p></CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl font-headline font-bold text-primary">Manage Landing Page</CardTitle>
        <CardDescription>Update the content for the public homepage.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <fieldset className="border p-4 rounded-md">
                <legend className="text-lg font-headline font-semibold text-primary px-2">Hero Section</legend>
                <div className="space-y-4 pt-2">
                    <FormField control={form.control} name="heroTitle" render={({ field }) => (
                        <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="heroSubtitle" render={({ field }) => (
                        <FormItem><FormLabel>Subtitle</FormLabel><FormControl><Textarea {...field} disabled={isSubmitting} rows={3} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
            </fieldset>
            
            <fieldset className="border p-4 rounded-md">
                <legend className="text-lg font-headline font-semibold text-primary px-2">Journal Section</legend>
                <div className="space-y-4 pt-2">
                    <FormField control={form.control} name="journalSectionTitle" render={({ field }) => (
                        <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="journalSectionSubtitle" render={({ field }) => (
                        <FormItem><FormLabel>Subtitle</FormLabel><FormControl><Input {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
            </fieldset>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
