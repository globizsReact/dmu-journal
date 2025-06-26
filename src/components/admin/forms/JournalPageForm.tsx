
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import TiptapEditor from './TiptapEditor';
import { getPlainTextFromTiptapJson } from '@/lib/tiptapUtils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const pageSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  content: z.any().refine((value) => {
    const text = getPlainTextFromTiptapJson(value);
    return text.length >= 10;
  }, { message: "Content must contain at least 10 characters of text." }),
  parentId: z.string().optional(),
});
type PageFormValues = z.infer<typeof pageSchema>;

interface JournalPageFormProps {
  initialData?: { title: string; content: any; parentId: string | null };
  onSubmit: (values: PageFormValues) => Promise<void>;
  isSubmitting: boolean;
  journalId: string;
  parentPages: { id: string, title: string }[];
}

export default function JournalPageForm({ initialData, onSubmit, isSubmitting, journalId, parentPages }: JournalPageFormProps) {
  const router = useRouter();
  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || { type: 'doc', content: [{ type: 'paragraph' }] },
      parentId: initialData?.parentId || undefined,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl font-headline font-bold text-primary">
          {initialData ? 'Edit Page' : 'Create New Page'}
        </CardTitle>
        <CardDescription>
          Fill in the details for this journal page.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem><FormLabel>Page Title</FormLabel><FormControl><Input {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>
            )} />
            
             <FormField control={form.control} name="parentId" render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Page (Optional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select a parent page (for sub-menus)" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="none">No Parent (Top-level)</SelectItem>
                    {parentPages.map(parent => (
                      <SelectItem key={parent.id} value={parent.id}>{parent.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="content" render={({ field }) => (
              <FormItem><FormLabel>Page Content</FormLabel><FormControl><TiptapEditor content={field.value} onChange={field.onChange} isSubmitting={isSubmitting} /></FormControl><FormMessage /></FormItem>
            )} />
            
            <div className="flex justify-end gap-3 pt-6 border-t mt-6">
              <Button type="button" variant="outline" onClick={() => router.push(`/admin/dashboard/journals/edit/${journalId}`)} disabled={isSubmitting}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {initialData ? 'Save Changes' : 'Create Page'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
