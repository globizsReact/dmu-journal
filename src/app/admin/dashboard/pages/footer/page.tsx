
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, AlertTriangle, Save, PlusCircle, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import LoadingFooterSettingsPage from './loading';

const linkSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  href: z.string().min(1, 'URL is required'),
  target: z.string().optional(),
});

const footerSchema = z.object({
  authorLinks: z.array(linkSchema).optional(),
  reviewerLinks: z.array(linkSchema).optional(),
  quickLinks: z.array(linkSchema).optional(),
  contactPhone: z.string().optional(),
  contactAddress: z.string().optional(),
  contactEmail: z.string().email({ message: "Invalid email" }).optional().or(z.literal('')),
});

type FooterFormValues = z.infer<typeof footerSchema>;

const LinkFieldArray = ({ control, name, title, disabled }: { control: any, name: "authorLinks" | "reviewerLinks" | "quickLinks", title: string, disabled: boolean }) => {
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <fieldset className="border p-4 rounded-md space-y-4">
      <legend className="text-lg font-headline font-semibold text-primary px-2">{title}</legend>
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-4 items-end">
          <FormField control={control} name={`${name}.${index}.label`} render={({ field }) => (
            <FormItem className="flex-grow"><FormLabel>Label</FormLabel><FormControl><Input {...field} disabled={disabled} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name={`${name}.${index}.href`} render={({ field }) => (
            <FormItem className="flex-grow"><FormLabel>URL</FormLabel><FormControl><Input {...field} disabled={disabled} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name={`${name}.${index}.target`} render={({ field }) => (
            <FormItem className="flex flex-row items-end space-x-2 pb-2">
                <FormControl>
                    <Checkbox
                        checked={field.value === '_blank'}
                        onCheckedChange={(checked) => field.onChange(checked ? '_blank' : '')}
                        disabled={disabled}
                    />
                </FormControl>
                <div className="space-y-1 leading-none">
                    <FormLabel>New Tab</FormLabel>
                </div>
            </FormItem>
           )} />
          <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} disabled={disabled}><Trash2 className="h-4 w-4" /></Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => append({ label: '', href: '', target: '' })} disabled={disabled}>
        <PlusCircle className="mr-2 h-4 w-4" /> Add Link
      </Button>
    </fieldset>
  );
}

export default function EditFooterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FooterFormValues>({
    resolver: zodResolver(footerSchema),
    defaultValues: {
      authorLinks: [],
      reviewerLinks: [],
      quickLinks: [],
      contactPhone: '',
      contactAddress: '',
      contactEmail: '',
    },
  });

  const fetchFooterContent = useCallback(async (token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/pages/footer', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          toast({ title: "Session Expired", description: "Please log in again.", variant: "destructive" });
          if (typeof window !== 'undefined') {
              localStorage.removeItem('authToken');
              localStorage.removeItem('userRole');
              localStorage.removeItem('authorName');
              window.dispatchEvent(new CustomEvent('authChange'));
          }
          return;
        }
        throw new Error('Failed to fetch footer data.');
      }
      const data = await response.json();
      form.reset(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [form, toast]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setAuthToken(token);
    if (token) {
      fetchFooterContent(token);
    } else {
        setIsLoading(false);
        setError("Not authenticated");
    }
  }, [fetchFooterContent]);

  const handleSubmit = async (values: FooterFormValues) => {
    if (!authToken) return;
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/pages/footer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update footer.');
      toast({ title: 'Success', description: "Footer settings updated successfully." });
      form.reset(data);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <LoadingFooterSettingsPage />;
  if (error) return <Card className="border-destructive"><CardHeader><CardTitle className="text-destructive flex items-center gap-2"><AlertTriangle /> Error</CardTitle></CardHeader><CardContent><p>{error}</p></CardContent></Card>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Footer Settings</CardTitle>
        <CardDescription>Update the links and contact information in the site footer.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <LinkFieldArray control={form.control} name="authorLinks" title="Author Links" disabled={isSubmitting} />
            <LinkFieldArray control={form.control} name="reviewerLinks" title="Reviewer Links" disabled={isSubmitting} />
            <LinkFieldArray control={form.control} name="quickLinks" title="Quick Links" disabled={isSubmitting} />

            <fieldset className="border p-4 rounded-md space-y-4">
                <legend className="text-lg font-headline font-semibold text-primary px-2">Contact Info</legend>
                 <FormField control={form.control} name="contactPhone" render={({ field }) => (
                    <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="contactAddress" render={({ field }) => (
                    <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="contactEmail" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>
                )} />
            </fieldset>

            <div className="flex justify-end gap-3 pt-4"><Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}<Save className="mr-2 h-4 w-4" /> Save Changes</Button></div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
