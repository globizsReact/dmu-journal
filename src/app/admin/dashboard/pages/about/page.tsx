
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import TiptapEditor from '@/components/admin/forms/TiptapEditor';
import { getPlainTextFromTiptapJson } from '@/lib/tiptapUtils';
import { Loader2, AlertTriangle, Save, FileUp, CheckCircle } from 'lucide-react';
import LoadingAboutPageEditor from './loading';
import Image from 'next/image';
import { toPublicUrl } from '@/lib/urlUtils';

const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const pageSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  content: z.any().refine((value) => {
    const text = getPlainTextFromTiptapJson(value);
    return text.length >= 10;
  }, { message: "Content must contain at least 10 characters of text." }),
  coverImagePath: z.string().optional(),
  coverImageHint: z.string().optional(),
});

type PageFormValues = z.infer<typeof pageSchema>;

export default function EditAboutPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const { toast } = useToast();
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: '',
      content: { type: 'doc', content: [{ type: 'paragraph' }] },
      coverImagePath: '',
      coverImageHint: '',
    },
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      setAuthToken(token);
    }
  }, []);

  const fetchPageContent = useCallback(async (token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/pages/about', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch page data.');
      }
      const data = await response.json();
      form.reset(data);
      if(data.coverImagePath) {
        setImagePreview(data.coverImagePath);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [form]);

  useEffect(() => {
    if (authToken) {
      fetchPageContent(authToken);
    }
  }, [authToken, fetchPageContent]);
  
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

  const handleSubmit = async (values: PageFormValues) => {
    if (!authToken) {
      toast({ title: 'Error', description: "Not authenticated.", variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/pages/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update page.');
      
      toast({ title: 'Success', description: "'About Us' page updated successfully." });
      form.reset(data); // reset with the saved data
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingAboutPageEditor />;
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2"><AlertTriangle /> Error Loading Page</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl font-headline font-bold text-primary">Manage 'About Us' Page</CardTitle>
        <CardDescription>Update the content for the public "About Us" page.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>Page Title</FormLabel>
                <FormControl><Input {...field} disabled={isSubmitting} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="content" render={({ field }) => (
              <FormItem>
                <FormLabel>Page Content</FormLabel>
                <FormControl>
                  <TiptapEditor content={field.value} onChange={field.onChange} isSubmitting={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <fieldset className="border p-4 rounded-md">
                <legend className="text-lg font-headline font-semibold text-primary px-2">Cover Photo</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-4">
                        <FormField control={form.control} name="coverImagePath" render={() => (
                        <FormItem>
                            <FormLabel>Upload Image</FormLabel>
                             <FormControl>
                                <Button type="button" variant="outline" asChild disabled={isUploading || isSubmitting} className="w-full mt-2">
                                <label htmlFor="image-upload" className="cursor-pointer flex items-center gap-2">
                                    <FileUp className="w-4 h-4" />
                                    {isUploading ? 'Uploading...' : 'Choose Cover Photo'}
                                </label>
                                </Button>
                            </FormControl>
                            <Input id="image-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" disabled={isUploading || isSubmitting}/>
                            {fileName && (
                                <div className="mt-2 text-sm flex items-center gap-2 text-muted-foreground">
                                    {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {uploadSuccess && <CheckCircle className="w-4 h-4 text-green-500" />}
                                    {uploadError && <AlertTriangle className="w-4 h-4 text-destructive" />}
                                    <span className="truncate">{fileName}</span>
                                </div>
                            )}
                            <FormMessage />
                        </FormItem>
                        )} />
                        <FormField control={form.control} name="coverImageHint" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image Hint</FormLabel>
                                <FormControl><Input {...field} value={field.value ?? ''} placeholder="e.g., university campus" disabled={isSubmitting || isUploading} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                     <div>
                        <FormLabel>Preview</FormLabel>
                        {imagePreview ? (
                            <div className="mt-2 aspect-video w-full relative rounded-md overflow-hidden border">
                                <Image src={toPublicUrl(imagePreview)} alt="Image Preview" fill sizes="33vw" className="object-cover" />
                            </div>
                        ) : (
                            <div className="mt-2 aspect-video w-full flex items-center justify-center bg-muted rounded-md">
                                <p className="text-sm text-muted-foreground">No image uploaded</p>
                            </div>
                        )}
                    </div>
                </div>
            </fieldset>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="submit" disabled={isSubmitting || isUploading}>
                {(isSubmitting || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
