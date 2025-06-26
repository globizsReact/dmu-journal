
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { JournalCategory } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookIcon, Pencil, Trash2, Loader2, ArrowUp, ArrowDown, MoreVertical, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DeleteJournalCategoryDialog from './dialogs/DeleteJournalCategoryDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { getPlainTextFromTiptapJson } from '@/lib/tiptapUtils';

export default function JournalCategoryListTable() {
  const [categories, setCategories] = useState<JournalCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [authToken, setAuthToken] = useState<string | null>(null);

  const [deletingCategory, setDeletingCategory] = useState<JournalCategory | null>(null);
  const [isSavingOrder, setIsSavingOrder] = useState(false);


  const fetchCategories = useCallback(async (token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/journal-categories', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userRole');
                localStorage.removeItem('authorName');
                window.dispatchEvent(new CustomEvent('authChange'));
            }
            return;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      setAuthToken(token);
      if (token) {
        fetchCategories(token);
      } else {
        setError("Not authenticated");
        setIsLoading(false);
      }
    }
  }, [fetchCategories]);
  
  const saveOrder = async (orderedCategories: JournalCategory[]) => {
    if (!authToken) {
        toast({ title: 'Error', description: "Authentication token not found.", variant: 'destructive' });
        return;
    }
    setIsSavingOrder(true);
    const orderedIds = orderedCategories.map((item) => item.id);
    try {
      const response = await fetch('/api/admin/journal-categories/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ orderedIds }),
      });
      if (!response.ok) {
        throw new Error('Failed to save new order.');
      }
      toast({ title: 'Success', description: 'Category order saved successfully.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      // Revert by refetching from server
      if (authToken) fetchCategories(authToken);
    } finally {
        setIsSavingOrder(false);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === categories.length - 1) return;

    const newCategories = Array.from(categories);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const [movedItem] = newCategories.splice(index, 1);
    newCategories.splice(targetIndex, 0, movedItem);

    setCategories(newCategories); // Optimistic UI update
    saveOrder(newCategories);
  };


  const handleSuccess = () => {
    if (authToken) fetchCategories(authToken);
  };


  const renderTableBody = () => {
    if (isLoading) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }
    if (error) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center text-destructive">{error}</TableCell>
          </TableRow>
        </TableBody>
      );
    }
    if (categories.length === 0) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center">
              No journal categories found. Add one to get started.
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }
    return (
        <TableBody>
            {categories.map((category, index) => (
                <TableRow key={category.id}>
                    <TableCell className="font-medium">
                        {category.name}
                        <p className="text-xs text-muted-foreground line-clamp-2 font-normal">
                          {getPlainTextFromTiptapJson(category.description)}
                        </p>
                    </TableCell>
                    <TableCell>{category.issn || 'N/A'}</TableCell>
                    <TableCell>{category.startYear || 'N/A'}</TableCell>
                    <TableCell>{category.abbreviation || 'N/A'}</TableCell>
                    <TableCell className="text-right space-x-1">
                        <Button variant="outline" size="icon" className="h-7 w-7" title="Move Up" onClick={() => handleMove(index, 'up')} disabled={index === 0 || isSavingOrder}>
                            <ArrowUp className="w-3.5 h-3.5" />
                        </Button>
                         <Button variant="outline" size="icon" className="h-7 w-7" title="Move Down" onClick={() => handleMove(index, 'down')} disabled={index === categories.length - 1 || isSavingOrder}>
                            <ArrowDown className="w-3.5 h-3.5" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-7 w-7 p-0" disabled={isSavingOrder}>
                                    <span className="sr-only">Open menu</span>
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild className="cursor-pointer">
                                  <Link href={`/admin/dashboard/journals/view/${category.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    <span>View</span>
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="cursor-pointer">
                                  <Link href={`/admin/dashboard/journals/edit/${category.id}`}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    <span>Edit</span>
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setDeletingCategory(category)} className="cursor-pointer text-destructive focus:text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Delete</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
  };


  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-grow">
              <CardTitle className="text-xl md:text-2xl lg:text-3xl font-headline font-bold text-primary">Journal Categories</CardTitle>
              <CardDescription>Use the arrow buttons to change the display order on the homepage.</CardDescription>
            </div>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/admin/dashboard/journals/new">
                <BookIcon className="mr-2 h-4 w-4" /> Add New Category
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto border rounded-lg">
            <Table className="min-w-[900px]">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[300px]">Name</TableHead>
                        <TableHead>ISSN</TableHead>
                        <TableHead>Start Year</TableHead>
                        <TableHead>Abbreviation</TableHead>
                        <TableHead className="text-right w-[180px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                {renderTableBody()}
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {deletingCategory && (
          <DeleteJournalCategoryDialog
              category={deletingCategory}
              isOpen={!!deletingCategory}
              onClose={() => setDeletingCategory(null)}
              onSuccess={handleSuccess}
              authToken={authToken || ''}
          />
      )}
    </>
  );
}
