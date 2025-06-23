
'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FlaskConical, Library, Briefcase, Scale } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const iconMap = {
  FlaskConical: <FlaskConical className="w-4 h-4 mr-2" />,
  Library: <Library className="w-4 h-4 mr-2" />,
  Briefcase: <Briefcase className="w-4 h-4 mr-2" />,
  Scale: <Scale className="w-4 h-4 mr-2" />,
};
type IconName = keyof typeof iconMap;

const categorySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  iconName: z.enum(Object.keys(iconMap) as [IconName, ...IconName[]], { required_error: 'An icon is required.' }),
  imagePath: z.string().min(1, 'Image path is required (e.g., /images/j1.png).'),
  imageHint: z.string().min(1, 'Image hint is required (e.g., science lab).'),
  abbreviation: z.string().optional(),
  language: z.string().optional(),
  issn: z.string().optional(),
  doiBase: z.string().optional(),
  startYear: z.coerce.number().optional(),
  displayIssn: z.string().optional(),
  copyrightYear: z.coerce.number().optional(),
});

type AddCategoryFormValues = z.infer<typeof categorySchema>;

interface AddJournalCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  authToken: string;
}

export default function AddJournalCategoryDialog({ isOpen, onClose, onSuccess, authToken }: AddJournalCategoryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<AddCategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '', description: '', imagePath: '/images/j1.png', imageHint: '', language: 'English' },
  });

  const onSubmit = async (values: AddCategoryFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/journal-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create category.');
      
      toast({ title: 'Success', description: 'Journal category added successfully.' });
      onSuccess();
      form.reset();
      onClose();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Journal Category</DialogTitle>
          <DialogDescription>
            Fill in the details for the new journal category.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="h-[60vh] p-4">
              <div className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                 <FormField control={form.control} name="iconName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl><SelectTrigger>{field.value ? <div className="flex items-center">{iconMap[field.value as IconName]} {field.value}</div> : "Select an icon"}</SelectTrigger></FormControl>
                      <SelectContent>
                        {Object.keys(iconMap).map(iconName => (
                          <SelectItem key={iconName} value={iconName}>
                            <div className="flex items-center">{iconMap[iconName as IconName]} {iconName}</div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="imagePath" render={({ field }) => (
                    <FormItem><FormLabel>Image Path</FormLabel><FormControl><Input {...field} placeholder="/images/j1.png" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="imageHint" render={({ field }) => (
                    <FormItem><FormLabel>Image Hint</FormLabel><FormControl><Input {...field} placeholder="science lab" /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="issn" render={({ field }) => (
                  <FormItem><FormLabel>ISSN</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="startYear" render={({ field }) => (
                    <FormItem><FormLabel>Start Year</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="copyrightYear" render={({ field }) => (
                    <FormItem><FormLabel>Copyright Year</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="mt-6 pt-4 border-t">
              <DialogClose asChild><Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button></DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Category
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
