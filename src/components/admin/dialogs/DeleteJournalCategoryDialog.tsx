
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { JournalCategory } from '@prisma/client';

interface DeleteJournalCategoryDialogProps {
  category: JournalCategory | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  authToken: string;
}

export default function DeleteJournalCategoryDialog({
  category,
  isOpen,
  onClose,
  onSuccess,
  authToken,
}: DeleteJournalCategoryDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!category) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/journal-categories/${category.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` },
      });

      if (response.ok) {
        toast({ title: 'Success', description: 'Category deleted successfully.' });
        onSuccess();
        onClose();
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete category.');
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!category) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the category "{category.name}"?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
