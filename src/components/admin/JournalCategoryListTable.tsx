
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { JournalCategory } from '@prisma/client';
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
import { BookIcon, Pencil, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddJournalCategoryDialog from './dialogs/AddJournalCategoryDialog';
import EditJournalCategoryDialog from './dialogs/EditJournalCategoryDialog';
import DeleteJournalCategoryDialog from './dialogs/DeleteJournalCategoryDialog';

export default function JournalCategoryListTable() {
  const [categories, setCategories] = useState<JournalCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [authToken, setAuthToken] = useState<string | null>(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<JournalCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<JournalCategory | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      setAuthToken(token);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    if (!authToken) {
      setError("Not authenticated");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/journal-categories', {
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [authToken, toast]);

  useEffect(() => {
    if (authToken) {
      fetchCategories();
    }
  }, [authToken, fetchCategories]);

  const handleSuccess = () => {
    fetchCategories();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl lg:text-3xl font-headline font-bold text-primary">Journal Categories</CardTitle>
          <CardDescription>View and manage journal categories.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
     return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8 text-destructive">
          <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
          <p>{error}</p>
          <Button onClick={fetchCategories} variant="outline" className="mt-4">Retry</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-grow">
              <CardTitle className="text-xl md:text-2xl lg:text-3xl font-headline font-bold text-primary">Journal Categories</CardTitle>
              <CardDescription>View and manage journal categories.</CardDescription>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
              <BookIcon className="mr-2 h-4 w-4" /> Add New Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="min-w-[800px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[350px]">Name</TableHead>
                  <TableHead>ISSN</TableHead>
                  <TableHead>Start Year</TableHead>
                  <TableHead>Abbreviation</TableHead>
                  <TableHead className="text-right w-[100px] sm:w-[130px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">
                        {category.name}
                        <p className="text-xs text-muted-foreground line-clamp-2 font-normal">{category.description}</p>
                      </TableCell>
                      <TableCell>{category.issn || 'N/A'}</TableCell>
                      <TableCell>{category.startYear || 'N/A'}</TableCell>
                      <TableCell>{category.abbreviation || 'N/A'}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="outline" size="icon" className="h-7 w-7" title="Edit Category" onClick={() => setEditingCategory(category)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="destructive" size="icon" className="h-7 w-7" title="Delete Category" onClick={() => setDeletingCategory(category)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      No journal categories found. Add one to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {isAddDialogOpen && (
        <AddJournalCategoryDialog
            isOpen={isAddDialogOpen}
            onClose={() => setIsAddDialogOpen(false)}
            onSuccess={handleSuccess}
            authToken={authToken || ''}
        />
      )}
      {editingCategory && (
          <EditJournalCategoryDialog
              category={editingCategory}
              isOpen={!!editingCategory}
              onClose={() => setEditingCategory(null)}
              onSuccess={handleSuccess}
              authToken={authToken || ''}
          />
      )}
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
