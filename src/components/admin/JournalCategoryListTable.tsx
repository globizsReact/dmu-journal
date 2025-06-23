
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
import { BookIcon, Pencil, Trash2, Loader2, AlertTriangle, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddJournalCategoryDialog from './dialogs/AddJournalCategoryDialog';
import EditJournalCategoryDialog from './dialogs/EditJournalCategoryDialog';
import DeleteJournalCategoryDialog from './dialogs/DeleteJournalCategoryDialog';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function JournalCategoryListTable() {
  const [categories, setCategories] = useState<JournalCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [authToken, setAuthToken] = useState<string | null>(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<JournalCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<JournalCategory | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex((c) => c.id === active.id);
      const newIndex = categories.findIndex((c) => c.id === over.id);
      const newOrder = arrayMove(categories, oldIndex, newIndex);
      
      setCategories(newOrder); // Optimistic UI update

      const orderedIds = newOrder.map((c) => c.id);
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
    }
  };

  const SortableRow = ({ category }: { category: JournalCategory }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({ id: category.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
    
    return (
      <TableRow ref={setNodeRef} style={style} {...attributes}>
        <TableCell className="w-12 cursor-grab" {...listeners}>
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
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Loading Categories...</CardTitle></CardHeader>
        <CardContent className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
     return (
      <Card>
        <CardHeader><CardTitle className="text-destructive">Error</CardTitle></CardHeader>
        <CardContent className="text-center py-8 text-destructive">{error}</CardContent>
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
              <CardDescription>Drag and drop rows to reorder them.</CardDescription>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
              <BookIcon className="mr-2 h-4 w-4" /> Add New Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
                <SortableContext items={categories.map(c => c.id)} strategy={verticalListSortingStrategy}>
                  <TableBody>
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <SortableRow key={category.id} category={category} />
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                          No journal categories found. Add one to get started.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </SortableContext>
              </Table>
            </DndContext>
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
