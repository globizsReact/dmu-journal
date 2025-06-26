
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import TiptapEditor from '../forms/TiptapEditor';
import { getPlainTextFromTiptapJson } from '@/lib/tiptapUtils';

interface FaqItem {
  id: string;
  question: string;
  answer: any;
}

const itemSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters.'),
  answer: z.any().refine((value) => {
    const text = getPlainTextFromTiptapJson(value);
    return text.length >= 10;
  }, { message: "Answer must contain at least 10 characters of text." }),
});

type ItemFormValues = z.infer<typeof itemSchema>;

interface AddEditFaqItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  authToken: string;
  item: FaqItem | null;
  categoryId: string | null;
}

export default function AddEditFaqItemDialog({ isOpen, onClose, onSuccess, authToken, item, categoryId }: AddEditFaqItemDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const isEditing = !!item;

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      question: '',
      answer: { type: 'doc', content: [{ type: 'paragraph' }] },
    },
  });

  useEffect(() => {
    if (isOpen) {
        if (item) {
            form.reset({ question: item.question, answer: item.answer });
        } else {
            form.reset({ question: '', answer: { type: 'doc', content: [{ type: 'paragraph' }] } });
        }
    }
  }, [item, isOpen, form]);

  const onSubmit = async (values: ItemFormValues) => {
    setIsSubmitting(true);
    const url = isEditing ? `/api/admin/faq/items/${item.id}` : '/api/admin/faq/items';
    const method = isEditing ? 'PUT' : 'POST';
    const body = isEditing ? values : { ...values, categoryId };

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Failed to ${isEditing ? 'update' : 'create'} item.`);
      
      toast({ title: 'Success', description: `FAQ item ${isEditing ? 'updated' : 'created'} successfully.` });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit' : 'Add'} FAQ Item</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the question and answer.' : 'Create a new question and answer item.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl><Input {...field} disabled={isSubmitting} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer</FormLabel>
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
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Save Changes' : 'Create Item'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
