
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label'; // Not strictly needed if using FormLabel
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { journalCategories } from '@/lib/data';
import { Loader2 } from 'lucide-react';

const manuscriptDetailsSchema = z.object({
  journalId: z.string().min(1, { message: 'Please select a journal.' }),
  isSpecialReview: z.boolean().optional(),
  articleTitle: z.string().min(5, { message: 'Article title must be at least 5 characters.' }).max(250, { message: 'Article title cannot exceed 250 characters.' }),
  abstract: z.string().min(20, { message: 'Abstract must be at least 20 characters.' }).max(5000, { message: 'Abstract cannot exceed 5000 characters.' }),
  keywords: z.string().min(3, { message: 'Please provide at least one keyword (e.g., keyword1, keyword2).' }).max(200, { message: 'Keywords cannot exceed 200 characters.' }),
});

export type ManuscriptDetailsData = z.infer<typeof manuscriptDetailsSchema>;

interface ManuscriptDetailsFormProps {
  onValidatedNext: (data: ManuscriptDetailsData) => void;
  initialData?: ManuscriptDetailsData | null;
  isSubmitting: boolean; // Added prop
}

export default function ManuscriptDetailsForm({ onValidatedNext, initialData, isSubmitting }: ManuscriptDetailsFormProps) {
  const form = useForm<ManuscriptDetailsData>({
    resolver: zodResolver(manuscriptDetailsSchema),
    defaultValues: initialData || {
      journalId: '',
      isSpecialReview: false,
      articleTitle: '',
      abstract: '',
      keywords: '',
    },
  });

  function onSubmit(data: ManuscriptDetailsData) {
    onValidatedNext(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Step 1: Manuscript Details</h3>
        
        <FormField
          control={form.control}
          name="journalId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select A Journal <span className="text-destructive">*</span></FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a journal" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {journalCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isSpecialReview"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="isSpecialReview"
                  disabled={isSubmitting}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel htmlFor="isSpecialReview" className="cursor-pointer">
                  Is Special Review?
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="articleTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Article Title <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Enter the title of your article" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="abstract"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Abstract <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide a brief summary of your article (max 5000 characters)"
                  className="min-h-[150px]"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Key Words <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Enter keywords, separated by commas" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
}
