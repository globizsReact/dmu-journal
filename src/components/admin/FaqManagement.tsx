
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, PlusCircle, Pencil, Trash2, ArrowUp, ArrowDown, GripVertical, FileUp, CheckCircle, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddEditFaqCategoryDialog from './dialogs/AddEditFaqCategoryDialog';
import AddEditFaqItemDialog from './dialogs/AddEditFaqItemDialog';
import DeleteFaqCategoryDialog from './dialogs/DeleteFaqCategoryDialog';
import DeleteFaqItemDialog from './dialogs/DeleteFaqItemDialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TiptapRenderer from '../shared/TiptapRenderer';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { toPublicUrl } from '@/lib/urlUtils';

// --- Interfaces & Types ---
interface FaqItem { id: string; question: string; answer: any; order: number; }
interface FaqCategory { id: string; title: string; order: number; items: FaqItem[]; }

const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const pageSettingsSchema = z.object({
  coverImagePath: z.string().optional(),
  coverImageHint: z.string().optional(),
});
type PageSettingsFormValues = z.infer<typeof pageSettingsSchema>;

// --- Component: PageSettings ---
function FaqPageSettings({ authToken, initialData }: { authToken: string, initialData: PageSettingsFormValues | null }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.coverImagePath || null);

  const form = useForm<PageSettingsFormValues>({
    resolver: zodResolver(pageSettingsSchema),
    defaultValues: initialData || { coverImagePath: '', coverImageHint: '' },
  });

  useEffect(() => {
    form.reset(initialData || { coverImagePath: '', coverImageHint: '' });
    setImagePreview(initialData?.coverImagePath || null);
  }, [initialData, form]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !authToken) return;
    if (file.size > MAX_FILE_SIZE_BYTES) {
        toast({ title: "File Too Large", description: `Cover image must be less than ${MAX_FILE_SIZE_MB}MB.`, variant: "destructive" });
        return;
    }
    setIsUploading(true);
    setUploadSuccess(false);
    setUploadError(null);
    setFileName(file.name);
    form.setValue('coverImagePath', '');
    setImagePreview(URL.createObjectURL(file));

    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('/api/admin/uploads/presigned-url', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` },
            body: formData,
        });
        const { publicUrl, error } = await response.json();
        if (!response.ok) throw new Error(error || 'Failed to upload file.');
        form.setValue('coverImagePath', publicUrl, { shouldValidate: true });
        setUploadSuccess(true);
    } catch (error: any) {
        setUploadError(error.message);
        toast({ title: 'Upload Failed', description: error.message, variant: 'destructive' });
        setImagePreview(form.getValues('coverImagePath'));
    } finally {
        setIsUploading(false);
    }
  };

  const onSubmit = async (values: PageSettingsFormValues) => {
    setIsSubmitting(true);
    try {
        const response = await fetch('/api/admin/pages/faq', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
            body: JSON.stringify(values),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to update page settings.');
        toast({ title: 'Success', description: 'FAQ page settings updated successfully.' });
    } catch (error: any) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>FAQ Page Settings</CardTitle>
        <CardDescription>Manage the cover photo for the public FAQ page.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <fieldset className="border p-4 rounded-md">
              <legend className="text-lg font-headline font-semibold text-primary px-2">Cover Photo</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-4">
                  <FormField control={form.control} name="coverImagePath" render={() => (
                    <FormItem>
                      <FormLabel>Upload Image</FormLabel>
                      <FormControl>
                          <Button type="button" variant="outline" asChild disabled={isUploading || isSubmitting} className="w-full mt-2"><label htmlFor="image-upload" className="cursor-pointer flex items-center gap-2"><FileUp className="w-4 h-4" />{isUploading ? 'Uploading...' : 'Choose Cover Photo'}</label></Button>
                      </FormControl>
                      <Input id="image-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" disabled={isUploading || isSubmitting}/>
                      {fileName && (<div className="mt-2 text-sm flex items-center gap-2 text-muted-foreground">{isUploading && <Loader2 className="w-4 h-4 animate-spin" />}{uploadSuccess && <CheckCircle className="w-4 h-4 text-green-500" />}{uploadError && <AlertTriangle className="w-4 h-4 text-destructive" />}<span className="truncate">{fileName}</span></div>)}
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="coverImageHint" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image Hint</FormLabel>
                      <FormControl><Input {...field} value={field.value ?? ''} placeholder="e.g., person thinking, question marks" disabled={isSubmitting || isUploading} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div>
                  <FormLabel>Preview</FormLabel>
                  {imagePreview ? (<div className="mt-2 aspect-video w-full relative rounded-md overflow-hidden border"><Image src={toPublicUrl(imagePreview)} alt="Image Preview" fill sizes="33vw" className="object-cover" /></div>) : (<div className="mt-2 aspect-video w-full flex items-center justify-center bg-muted rounded-md"><p className="text-sm text-muted-foreground">No image uploaded</p></div>)}
                </div>
              </div>
            </fieldset>
            <div className="flex justify-end pt-4"><Button type="submit" disabled={isSubmitting || isUploading}>{(isSubmitting || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}<Save className="mr-2 h-4 w-4" /> Save Settings</Button></div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// --- Component: FaqManagement ---
export default function FaqManagement() {
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [pageSettings, setPageSettings] = useState<PageSettingsFormValues | null>(null);
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
      const response = await fetch('/api/public/faq', { headers: { 'Authorization': `Bearer ${token}` } });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            toast({ title: "Session Expired", description: "Please log in again.", variant: "destructive" });
            if (typeof window !== 'undefined') {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userRole');
                localStorage.removeItem('authorName');
                window.dispatchEvent(new CustomEvent('authChange'));
            }
            return;
        }
        throw new Error('Failed to fetch FAQs');
      }
      const data = await response.json();
      setCategories(data.faqData);
      setPageSettings(data.pageSettings);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setAuthToken(token);
    if (token) fetchFaqs(token);
    else setIsLoading(false);
  }, [fetchFaqs]);
  
  const handleSuccess = () => { if (authToken) fetchFaqs(authToken); };
  const handleOpenAddCategory = () => { setEditingCategory(null); setIsCategoryDialogOpen(true); };
  const handleOpenEditCategory = (category: FaqCategory) => { setEditingCategory(category); setIsCategoryDialogOpen(true); };
  const handleOpenAddItem = (categoryId: string) => { setEditingItem(null); setCurrentItemParentCategory(categoryId); setIsItemDialogOpen(true); };
  const handleOpenEditItem = (item: FaqItem, categoryId: string) => { setEditingItem(item); setCurrentItemParentCategory(categoryId); setIsItemDialogOpen(true); };
  
  const saveOrder = async (type: 'category' | 'item', orderedItems: {id: string}[]) => {
     if (!authToken) { toast({ title: 'Error', description: "Authentication token not found.", variant: 'destructive' }); return; }
    setIsSavingOrder(true);
    const orderedIds = orderedItems.map(item => item.id);
    try {
        const response = await fetch('/api/admin/faq/reorder', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` }, body: JSON.stringify({ type, orderedIds }) });
        if (!response.ok) throw new Error(`Failed to save new ${type} order.`);
        toast({ title: 'Success', description: `${type.charAt(0).toUpperCase() + type.slice(1)} order saved.` });
    } catch (error: any) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        if (authToken) fetchFaqs(authToken);
    } finally {
        setIsSavingOrder(false);
    }
  }

  const handleMoveCategory = (index: number, direction: 'up' | 'down') => {
    const newCategories = Array.from(categories);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const [movedItem] = newCategories.splice(index, 1);
    newCategories.splice(targetIndex, 0, movedItem);
    setCategories(newCategories);
    saveOrder('category', newCategories);
  };

  const handleMoveItem = (catIndex: number, itemIndex: number, direction: 'up' | 'down') => {
    const newCategories = JSON.parse(JSON.stringify(categories));
    const items = newCategories[catIndex].items;
    const targetIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
    const [movedItem] = items.splice(itemIndex, 1);
    items.splice(targetIndex, 0, movedItem);
    setCategories(newCategories);
    saveOrder('item', items);
  };

  if (isLoading) { return <div className="flex justify-center items-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>; }
  if (error) { return <div className="text-center py-10 text-destructive"><AlertTriangle className="mx-auto h-8 w-8 mb-2" /> {error}</div>; }

  return (
    <>
      {authToken && <FaqPageSettings authToken={authToken} initialData={pageSettings} />}
      <Card>
        <CardHeader className="flex flex-row justify-between items-start">
          <div>
            <CardTitle>Manage FAQ Content</CardTitle>
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
      <AddEditFaqCategoryDialog isOpen={isCategoryDialogOpen} onClose={() => setIsCategoryDialogOpen(false)} onSuccess={handleSuccess} authToken={authToken || ''} category={editingCategory}/>
      <AddEditFaqItemDialog isOpen={isItemDialogOpen} onClose={() => setIsItemDialogOpen(false)} onSuccess={handleSuccess} authToken={authToken || ''} item={editingItem} categoryId={currentItemParentCategory}/>
      <DeleteFaqCategoryDialog isOpen={!!deletingCategory} onClose={() => setDeletingCategory(null)} onSuccess={handleSuccess} authToken={authToken || ''} category={deletingCategory}/>
      <DeleteFaqItemDialog isOpen={!!deletingItem} onClose={() => setDeletingItem(null)} onSuccess={handleSuccess} authToken={authToken || ''} item={deletingItem}/>
    </>
  );
}
