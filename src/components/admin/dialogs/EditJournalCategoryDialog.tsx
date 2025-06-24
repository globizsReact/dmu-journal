
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import { Loader2, FlaskConical, Library, Briefcase, Scale, FileUp, CheckCircle, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { JournalCategory } from '@prisma/client';

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
  imagePath: z.string().min(1, 'An uploaded image is required.'),
  imageHint: z.string().min(1, 'Image hint is required (e.g., science lab).'),
  abbreviation: z.string().optional(),
  language: z.string().optional(),
  issn: z.string().optional(),
  doiBase: z.string().optional(),
  startYear: z.coerce.number().optional(),
  displayIssn: z.string().optional(),
  copyrightYear: z.coerce.number().optional(),
});

type EditCategoryFormValues = z.infer<typeof categorySchema>;

interface EditJournalCategoryDialogProps {
  category: JournalCategory;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  authToken: string;
}

export default function EditJournalCategoryDialog({ category, isOpen, onClose, onSuccess, authToken }: EditJournalCategoryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<EditCategoryFormValues>({
    resolver: zodResolver(categorySchema),
  });
  
  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name || '',
        description: category.description || '',
        iconName: category.iconName as IconName,
        imagePath: category.imagePath || '',
        imageHint: category.imageHint || '',
        abbreviation: category.abbreviation || '',
        language: category.language || '',
        issn: category.issn || '',
        doiBase: category.doiBase || '',
        displayIssn: category.displayIssn || '',
        startYear: category.startYear || undefined,
        copyrightYear: category.copyrightYear || undefined,
      });
    }
  }, [category, form]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadSuccess(false);
    setUploadError(null);
    setFileName(file.name);

    try {
      const presignedUrlResponse = await fetch('/api/admin/uploads/presigned-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });

      const { uploadUrl, publicUrl, error: presignedUrlError } = await presignedUrlResponse.json();
      if (!presignedUrlResponse.ok) throw new Error(presignedUrlError || 'Could not get an upload URL.');

      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      if (!uploadResponse.ok) throw new Error('Failed to upload file to S3.');
      
      form.setValue('imagePath', publicUrl);
      form.trigger('imagePath');
      setUploadSuccess(true);
      toast({ title: "Upload Successful", description: "Image replaced successfully." });

    } catch (error: any) {
      setUploadError(error.message);
      toast({ title: 'Upload Failed', description: error.message, variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };


  const onSubmit = async (values: EditCategoryFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/journal-categories/${category.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update category.');
      
      toast({ title: 'Success', description: 'Journal category updated successfully.' });
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Journal Category</DialogTitle>
          <DialogDescription>
            Modify the details for "{category.name}".
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="h-[60vh] p-4">
              <div className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="iconName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl><SelectTrigger>{field.value ? <div className="flex items-center">{iconMap[field.value as IconName]} {field.value}</div> : "Select an icon"}</SelectTrigger></FormControl>
                      <SelectContent>
                        {Object.keys(iconMap).map(iconName => (
                          <SelectItem key={iconName} value={iconName}><div className="flex items-center">{iconMap[iconName as IconName]} {iconName}</div></SelectItem>
                        ))}
                      </SelectContent>
                    </Select><FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="imagePath" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Category Thumbnail</FormLabel>
                        <FormControl>
                            <div>
                                <Button type="button" variant="outline" asChild disabled={isUploading || isSubmitting}>
                                    <label htmlFor="image-upload-edit" className="cursor-pointer flex items-center gap-2">
                                        <FileUp className="w-4 h-4" />
                                        {isUploading ? 'Uploading...' : 'Upload New Image'}
                                    </label>
                                </Button>
                                <Input id="image-upload-edit" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/jpg" disabled={isUploading || isSubmitting}/>
                            </div>
                        </FormControl>
                        <p className="text-xs text-muted-foreground mt-1">Current image: <span className="font-mono break-all">{field.value}</span></p>
                        {fileName && (
                            <div className="mt-2 text-sm flex items-center gap-2">
                            {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {uploadSuccess && <CheckCircle className="w-4 h-4 text-green-500" />}
                            {uploadError && <AlertCircle className="w-4 h-4 text-destructive" />}
                            <span className="truncate">{fileName}</span>
                            </div>
                        )}
                        <FormMessage />
                    </FormItem>
                )} />

                 <FormField control={form.control} name="imageHint" render={({ field }) => (
                  <FormItem><FormLabel>Image Hint</FormLabel><FormControl><Input {...field} placeholder="e.g., science lab, law books" /></FormControl><FormMessage /></FormItem>
                )} />
                
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
                 <FormField control={form.control} name="abbreviation" render={({ field }) => (
                  <FormItem><FormLabel>Abbreviation</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="language" render={({ field }) => (
                  <FormItem><FormLabel>Language</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="doiBase" render={({ field }) => (
                  <FormItem><FormLabel>DOI Base</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="displayIssn" render={({ field }) => (
                  <FormItem><FormLabel>Display ISSN</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </ScrollArea>
            <DialogFooter className="mt-6 pt-4 border-t">
              <DialogClose asChild><Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button></DialogClose>
              <Button type="submit" disabled={isSubmitting || isUploading}>
                {(isSubmitting || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
