
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, PlusCircle, Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


interface Page {
  id: string;
  title: string;
  order: number;
  slug: string;
  parentId: string | null;
  children: Page[];
}

interface JournalCategoryPagesManagerProps {
  journalCategoryId: string;
  authToken: string;
}

export default function JournalCategoryPagesManager({ journalCategoryId, authToken }: JournalCategoryPagesManagerProps) {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [deletingPage, setDeletingPage] = useState<Page | null>(null);

  const fetchPages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/journal-pages?journalCategoryId=${journalCategoryId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      if (!response.ok) throw new Error('Failed to fetch pages');
      const data = await response.json();
      setPages(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [journalCategoryId, authToken]);

  useEffect(() => {
    if (journalCategoryId && authToken) {
      fetchPages();
    }
  }, [journalCategoryId, authToken, fetchPages]);

  const saveOrder = async (orderedPages: Page[]) => {
    setIsSavingOrder(true);
    const simplifiedOrder = orderedPages.flatMap(p => [
      { id: p.id, order: p.order },
      ...p.children.map(c => ({ id: c.id, order: c.order })),
    ]);

    try {
        const response = await fetch('/api/admin/journal-pages/reorder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
            body: JSON.stringify({ orderedItems: simplifiedOrder }),
        });
        if (!response.ok) throw new Error('Failed to save new order.');
        toast({ title: 'Success', description: 'Page order saved.' });
        fetchPages(); // Refetch to confirm order
    } catch (error: any) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        fetchPages(); // Revert on error
    } finally {
        setIsSavingOrder(false);
    }
  };

  const handleMove = (item: Page, parentList: Page[], index: number, direction: 'up' | 'down') => {
    const newList = [...parentList];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newList.length) return;

    [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];

    const updatedOrderList = newList.map((p, i) => ({ ...p, order: i }));

    // Find which top-level page this belongs to and update its children
    if (item.parentId) {
        const parentPageIndex = pages.findIndex(p => p.id === item.parentId);
        if (parentPageIndex > -1) {
            const newPages = [...pages];
            newPages[parentPageIndex] = { ...newPages[parentPageIndex], children: updatedOrderList };
            setPages(newPages);
            saveOrder(newPages);
        }
    } else {
        setPages(updatedOrderList);
        saveOrder(updatedOrderList);
    }
  };

  const handleDelete = async () => {
    if (!deletingPage) return;
    try {
        const response = await fetch(`/api/admin/journal-pages/${deletingPage.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` },
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to delete page');
        }
        toast({ title: 'Success', description: 'Page deleted successfully.' });
        fetchPages();
    } catch (err: any) {
        toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
        setDeletingPage(null);
    }
  };


  const renderPageList = (pageList: Page[], parentList: Page[]) => (
    <ul className="space-y-2">
      {pageList.map((page, index) => (
        <li key={page.id} className="bg-card p-3 rounded-md shadow-sm border">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-1">
                <button onClick={() => handleMove(page, parentList, index, 'up')} disabled={index === 0 || isSavingOrder} className="disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
                <button onClick={() => handleMove(page, parentList, index, 'down')} disabled={index === parentList.length - 1 || isSavingOrder} className="disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
              </div>
              <div>
                <p className="font-medium text-foreground">{page.title}</p>
                <p className="text-xs text-muted-foreground">/{page.slug}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="icon" className="h-8 w-8"><Link href={`/admin/dashboard/journals/${journalCategoryId}/pages/edit/${page.id}`}><Pencil className="h-4 w-4" /></Link></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setDeletingPage(page)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
          {page.children && page.children.length > 0 && (
            <div className="pl-8 mt-2 pt-2 border-t">
              {renderPageList(page.children, page.children)}
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row justify-between items-start">
          <div>
            <CardTitle>Manage Journal Pages</CardTitle>
            <CardDescription>Add, edit, and organize pages for this journal category.</CardDescription>
          </div>
          <Button asChild><Link href={`/admin/dashboard/journals/${journalCategoryId}/pages/new`}><PlusCircle className="mr-2 h-4 w-4" /> Add Page</Link></Button>
        </CardHeader>
        <CardContent>
          {isLoading && <div className="flex justify-center items-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
          {error && <div className="text-center py-10 text-destructive"><AlertTriangle className="mx-auto h-8 w-8 mb-2" /> {error}</div>}
          {!isLoading && !error && (
            pages.length > 0 ? renderPageList(pages, pages) : <p className="text-center text-muted-foreground py-4">No pages created yet for this journal.</p>
          )}
        </CardContent>
      </Card>

       <AlertDialog open={!!deletingPage} onOpenChange={() => setDeletingPage(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the page "{deletingPage?.title}"? 
              {deletingPage?.children && deletingPage.children.length > 0 && " This will also delete all of its sub-pages."}
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
