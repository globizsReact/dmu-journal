
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

interface FaqCategory {
  id: string;
  title: string;
}

const categorySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface AddEditFaqCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  authToken: string;
  category: FaqCategory | null;
}

export default function AddEditFaqCategoryDialog({ isOpen, onClose, onSuccess, authToken, category }: AddEditFaqCategoryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const isEditing = !!category;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: '',
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({ title: category.title });
    } else {
      form.reset({ title: '' });
    }
  }, [category, form, isOpen]);

  const onSubmit = async (values: CategoryFormValues) => {
    setIsSubmitting(true);
    const url = isEditing ? `/api/admin/faq/categories/${category.id}` : '/api/admin/faq/categories';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Failed to ${isEditing ? 'update' : 'create'} category.`);
      
      toast({ title: 'Success', description: `Category ${isEditing ? 'updated' : 'created'} successfully.` });
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit' : 'Add'} FAQ Category</DialogTitle>
          <DialogDescription>
            {isEditing ? `Update the title for the category.` : 'Create a new category to group FAQ items.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Title</FormLabel>
                  <FormControl><Input {...field} disabled={isSubmitting} /></FormControl>
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
                {isEditing ? 'Save Changes' : 'Create Category'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
