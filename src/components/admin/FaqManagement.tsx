
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, PlusCircle, Pencil, Trash2, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddEditFaqCategoryDialog from './dialogs/AddEditFaqCategoryDialog';
import AddEditFaqItemDialog from './dialogs/AddEditFaqItemDialog';
import DeleteFaqCategoryDialog from './dialogs/DeleteFaqCategoryDialog';
import DeleteFaqItemDialog from './dialogs/DeleteFaqItemDialog';
import { getPlainTextFromTiptapJson } from '@/lib/tiptapUtils';
import { Badge } from '@/components/ui/badge';
import TiptapRenderer from '../shared/TiptapRenderer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  id: string;
  question: string;
  answer: any;
  order: number;
}

interface FaqCategory {
  id: string;
  title: string;
  order: number;
  items: FaqItem[];
}

export default function FaqManagement() {
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const { toast } = useToast();

  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FaqCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<FaqCategory | null>(null);
  
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FaqItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<FaqItem | null>(null);
  const [currentItemParentCategory, setCurrentItemParentCategory] = useState<string | null>(null);

  const [isSavingOrder, setIsSavingOrder] = useState(false);


  const fetchFaqs = useCallback(async (token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/public/faq', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch FAQs');
      const data: FaqCategory[] = await response.json();
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setAuthToken(token);
    if (token) fetchFaqs(token);
    else setIsLoading(false);
  }, [fetchFaqs]);
  
  const handleSuccess = () => {
    if (authToken) fetchFaqs(authToken);
  };
  
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setIsCategoryDialogOpen(true);
  };
  
  const handleOpenEditCategory = (category: FaqCategory) => {
    setEditingCategory(category);
    setIsCategoryDialogOpen(true);
  };
  
  const handleOpenAddItem = (categoryId: string) => {
    setEditingItem(null);
    setCurrentItemParentCategory(categoryId);
    setIsItemDialogOpen(true);
  };

  const handleOpenEditItem = (item: FaqItem, categoryId: string) => {
    setEditingItem(item);
    setCurrentItemParentCategory(categoryId);
    setIsItemDialogOpen(true);
  };
  
  const saveOrder = async (type: 'category' | 'item', orderedItems: {id: string}[]) => {
     if (!authToken) {
        toast({ title: 'Error', description: "Authentication token not found.", variant: 'destructive' });
        return;
    }
    setIsSavingOrder(true);
    const orderedIds = orderedItems.map(item => item.id);

    try {
        const response = await fetch('/api/admin/faq/reorder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
            body: JSON.stringify({ type, orderedIds }),
        });
        if (!response.ok) throw new Error(`Failed to save new ${type} order.`);
        toast({ title: 'Success', description: `${type.charAt(0).toUpperCase() + type.slice(1)} order saved.` });
    } catch (error: any) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        if (authToken) fetchFaqs(authToken); // Revert on error
    } finally {
        setIsSavingOrder(false);
    }
  }

  const handleMoveCategory = (index: number, direction: 'up' | 'down') => {
    const newCategories = Array.from(categories);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const [movedItem] = newCategories.splice(index, 1);
    newCategories.splice(targetIndex, 0, movedItem);
    setCategories(newCategories); // Optimistic update
    saveOrder('category', newCategories);
  };

  const handleMoveItem = (catIndex: number, itemIndex: number, direction: 'up' | 'down') => {
    const newCategories = JSON.parse(JSON.stringify(categories));
    const items = newCategories[catIndex].items;
    const targetIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
    const [movedItem] = items.splice(itemIndex, 1);
    items.splice(targetIndex, 0, movedItem);
    setCategories(newCategories); // Optimistic update
    saveOrder('item', items);
  };


  if (isLoading) {
    return <div className="flex justify-center items-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  if (error) {
    return <div className="text-center py-10 text-destructive"><AlertTriangle className="mx-auto h-8 w-8 mb-2" /> {error}</div>;
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row justify-between items-start">
          <div>
            <CardTitle>Manage FAQs</CardTitle>
            <CardDescription>Add, edit, or remove frequently asked questions.</CardDescription>
          </div>
          <Button onClick={handleOpenAddCategory}><PlusCircle className="mr-2 h-4 w-4" /> Add New Category</Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {categories.map((category, catIndex) => (
            <div key={category.id} className="p-4 border rounded-lg bg-muted/50">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                   <div className="flex flex-col gap-1">
                     <button onClick={() => handleMoveCategory(catIndex, 'up')} disabled={catIndex === 0 || isSavingOrder} className="disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
                     <button onClick={() => handleMoveCategory(catIndex, 'down')} disabled={catIndex === categories.length - 1 || isSavingOrder} className="disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
                   </div>
                  <h3 className="text-lg font-semibold text-primary">{category.title}</h3>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenAddItem(category.id)}><PlusCircle className="mr-2 h-4 w-4" /> Add Item</Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenEditCategory(category)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setDeletingCategory(category)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
              
              <Accordion type="single" collapsible className="w-full space-y-2 pl-4">
                {category.items.length > 0 ? category.items.map((item, itemIndex) => (
                   <AccordionItem key={item.id} value={item.id} className="bg-card border border-border rounded-md shadow-sm overflow-hidden">
                       <div className="flex items-center pr-4">
                          <AccordionTrigger className="flex-1 px-4 py-3 text-left text-md font-medium text-foreground hover:bg-muted/50 transition-colors">
                              {item.question}
                          </AccordionTrigger>
                          <div className="flex flex-col gap-0.5 ml-2">
                            <button onClick={() => handleMoveItem(catIndex, itemIndex, 'up')} disabled={itemIndex === 0 || isSavingOrder} className="disabled:opacity-30"><ArrowUp className="h-3 w-3" /></button>
                            <button onClick={() => handleMoveItem(catIndex, itemIndex, 'down')} disabled={itemIndex === category.items.length - 1 || isSavingOrder} className="disabled:opacity-30"><ArrowDown className="h-3 w-3" /></button>
                          </div>
                          <div className="flex items-center gap-1 ml-4">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleOpenEditItem(item, category.id)}><Pencil className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setDeletingItem(item)}><Trash2 className="h-3.5 w-3.5" /></Button>
                          </div>
                       </div>
                       <AccordionContent className="px-6 pb-4 pt-0">
                           <TiptapRenderer jsonContent={item.answer} className="prose prose-sm max-w-none font-body text-foreground/80 mt-2 border-t pt-2" />
                       </AccordionContent>
                   </AccordionItem>
                )) : <p className="text-sm text-muted-foreground text-center py-4">No items in this category yet.</p>}
              </Accordion>
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Dialogs */}
      <AddEditFaqCategoryDialog
        isOpen={isCategoryDialogOpen}
        onClose={() => setIsCategoryDialogOpen(false)}
        onSuccess={handleSuccess}
        authToken={authToken || ''}
        category={editingCategory}
      />
      <AddEditFaqItemDialog
        isOpen={isItemDialogOpen}
        onClose={() => setIsItemDialogOpen(false)}
        onSuccess={handleSuccess}
        authToken={authToken || ''}
        item={editingItem}
        categoryId={currentItemParentCategory}
      />
      <DeleteFaqCategoryDialog
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onSuccess={handleSuccess}
        authToken={authToken || ''}
        category={deletingCategory}
      />
      <DeleteFaqItemDialog
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onSuccess={handleSuccess}
        authToken={authToken || ''}
        item={deletingItem}
      />
    </>
  );
}
