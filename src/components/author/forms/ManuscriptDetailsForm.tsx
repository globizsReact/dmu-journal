
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Loader2 } from 'lucide-react';
import type { JournalCategory } from '@prisma/client';
import TiptapEditor from '@/components/admin/forms/TiptapEditor';
import { getPlainTextFromTiptapJson } from '@/lib/tiptapUtils';

const manuscriptDetailsSchema = z.object({
  journalId: z.string().min(1, { message: 'Please select a journal.' }),
  isSpecialReview: z.boolean().optional(),
  articleTitle: z.string().min(5, { message: 'Article title must be at least 5 characters.' }).max(250, { message: 'Article title cannot exceed 250 characters.' }),
  abstract: z.any().refine((value) => {
    const text = getPlainTextFromTiptapJson(value);
    return text.length >= 20;
  }, { message: "Abstract must contain at least 20 characters of text." }).refine((value) => {
    const text = getPlainTextFromTiptapJson(value);
    return text.length <= 5000;
  }, { message: "Abstract cannot exceed 5000 characters." }),
  keywords: z.string().min(3, { message: 'Please provide at least one keyword (e.g., keyword1, keyword2).' }).max(200, { message: 'Keywords cannot exceed 200 characters.' }),
});

export type ManuscriptDetailsData = z.infer<typeof manuscriptDetailsSchema>;

interface ManuscriptDetailsFormProps {
  onValidatedNext: (data: ManuscriptDetailsData) => void;
  initialData?: ManuscriptDetailsData | null;
  isSubmitting: boolean;
}

export default function ManuscriptDetailsForm({ onValidatedNext, initialData, isSubmitting }: ManuscriptDetailsFormProps) {
  const [categories, setCategories] = useState<JournalCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/public/journal-categories');
        if (!response.ok) throw new Error('Failed to load journals');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const form = useForm<ManuscriptDetailsData>({
    resolver: zodResolver(manuscriptDetailsSchema),
    defaultValues: initialData || {
      journalId: '',
      isSpecialReview: false,
      articleTitle: '',
      abstract: { type: 'doc', content: [{ type: 'paragraph' }] },
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
                disabled={isSubmitting || isLoadingCategories}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingCategories ? "Loading journals..." : "Select a journal"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {!isLoadingCategories && categories.map((category) => (
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
                <TiptapEditor
                  content={field.value}
                  onChange={field.onChange}
                  isSubmitting={isSubmitting}
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
          <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" disabled={isSubmitting || isLoadingCategories}>
            {(isSubmitting || isLoadingCategories) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
}
