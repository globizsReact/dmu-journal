
'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
import { BookIcon, Pencil, Trash2, Loader2, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddJournalCategoryDialog from './dialogs/AddJournalCategoryDialog';
import EditJournalCategoryDialog from './dialogs/EditJournalCategoryDialog';
import DeleteJournalCategoryDialog from './dialogs/DeleteJournalCategoryDialog';
import { DragDropContext, Droppable, Draggable, type DropResult } from 'react-beautiful-dnd';

// A custom hook to address a known issue with react-beautiful-dnd in React 18 strict mode.
const useStrictDroppable = (initialEnabled: boolean) => {
    const [enabled, setEnabled] = useState(initialEnabled);
    useEffect(() => {
        let animationFrame: number;
        if (!initialEnabled) {
            animationFrame = requestAnimationFrame(() => setEnabled(true));
        }
        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
            if (!initialEnabled) {
                setEnabled(false);
            }
        };
    }, [initialEnabled]);
    return [enabled];
};

export default function JournalCategoryListTable() {
  const [categories, setCategories] = useState<JournalCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [authToken, setAuthToken] = useState<string | null>(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<JournalCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<JournalCategory | null>(null);

  const [isBrowser, setIsBrowser] = useState(false);
  useEffect(() => {
    setIsBrowser(true); // Ensures this component only renders on the client
  }, []);

  const fetchCategories = useCallback(async (token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/journal-categories', {
        headers: { 'Authorization': `Bearer ${token}` },
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

  const handleSuccess = () => {
    if (authToken) fetchCategories(authToken);
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCategories(items); // Optimistic UI update

    const orderedIds = items.map((item) => item.id);
    try {
      if (!authToken) throw new Error("Authentication token not found.");
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
      if (authToken) fetchCategories(authToken); // Revert by refetching from server
    }
  };

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
          </TableCell>
        </TableRow>
      );
    }
    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center text-destructive">{error}</TableCell>
        </TableRow>
      );
    }
    if (categories.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center">
            No journal categories found. Add one to get started.
          </TableCell>
        </TableRow>
      );
    }
    return (
        <Droppable droppableId="categories">
            {(provided) => (
                <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                    {categories.map((category, index) => (
                        <Draggable key={category.id} draggableId={category.id} index={index}>
                            {(provided) => (
                                <TableRow ref={provided.innerRef} {...provided.draggableProps}>
                                    <TableCell {...provided.dragHandleProps} className="w-12 cursor-grab" title="Drag to reorder">
                                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                                    </TableCell>
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
                            )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                </TableBody>
            )}
        </Droppable>
    );
  };


  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-grow">
              <CardTitle className="text-xl md:text-2xl lg:text-3xl font-headline font-bold text-primary">Journal Categories</CardTitle>
              <CardDescription>Drag and drop rows to change the display order on the homepage.</CardDescription>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
              <BookIcon className="mr-2 h-4 w-4" /> Add New Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto border rounded-lg">
            {isBrowser ? (
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Table className="min-w-[800px]">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12"></TableHead>
                                <TableHead className="w-[350px]">Name</TableHead>
                                <TableHead>ISSN</TableHead>
                                <TableHead>Start Year</TableHead>
                                <TableHead>Abbreviation</TableHead>
                                <TableHead className="text-right w-[100px] sm:w-[130px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        {renderTableBody()}
                    </Table>
                </DragDropContext>
            ) : (
                // Render a placeholder or skeleton on the server
                <Table className="min-w-[800px]">
                     <TableHeader>
                        <TableRow>
                            <TableHead className="w-12"></TableHead>
                            <TableHead className="w-[350px]">Name</TableHead>
                            <TableHead>ISSN</TableHead>
                            <TableHead>Start Year</TableHead>
                            <TableHead>Abbreviation</TableHead>
                            <TableHead className="text-right w-[100px] sm:w-[130px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                     <TableBody>
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                            </TableCell>
                        </TableRow>
                     </TableBody>
                </Table>
            )}
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
