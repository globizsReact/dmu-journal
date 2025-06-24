
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FlaskConical, Library, Briefcase, Scale, FileUp, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import type { JournalCategory } from '@prisma/client';
import TiptapEditor from './TiptapEditor';
import { getPlainTextFromTiptapJson } from '@/lib/tiptapUtils';

// --- Icon Mapping ---
const iconMap = {
  FlaskConical: <FlaskConical className="w-4 h-4 mr-2" />,
  Library: <Library className="w-4 h-4 mr-2" />,
  Briefcase: <Briefcase className="w-4 h-4 mr-2" />,
  Scale: <Scale className="w-4 h-4 mr-2" />,
};
type IconName = keyof typeof iconMap;

// --- File Size Limit ---
const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// --- Zod Schema ---
const categorySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  description: z.any().refine((value) => {
    const text = getPlainTextFromTiptapJson(value);
    return text.length >= 10;
  }, { message: "Description must contain at least 10 characters of text." }),
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
type CategoryFormValues = z.infer<typeof categorySchema>;

// --- Component Props ---
interface JournalCategoryFormProps {
  initialData?: JournalCategory;
  onSubmit: (values: CategoryFormValues) => Promise<void>;
  isSubmitting: boolean;
  authToken: string;
}

export default function JournalCategoryForm({ initialData, onSubmit, isSubmitting, authToken }: JournalCategoryFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imagePath || null);
  
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || { type: 'doc', content: [{ type: 'paragraph' }] },
      iconName: (initialData?.iconName as IconName) || undefined,
      imagePath: initialData?.imagePath || '',
      imageHint: initialData?.imageHint || '',
      abbreviation: initialData?.abbreviation || '',
      language: initialData?.language || 'English',
      issn: initialData?.issn || '',
      doiBase: initialData?.doiBase || '',
      displayIssn: initialData?.displayIssn || '',
      startYear: initialData?.startYear || undefined,
      copyrightYear: initialData?.copyrightYear || undefined,
    },
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast({
        title: "File Too Large",
        description: `Thumbnail image must be less than ${MAX_FILE_SIZE_MB}MB.`,
        variant: "destructive",
      });
      if (event.target) {
        event.target.value = "";
      }
      return;
    }

    setIsUploading(true);
    setUploadSuccess(false);
    setUploadError(null);
    setFileName(file.name);
    form.setValue('imagePath', '');
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
      form.setValue('imagePath', publicUrl, { shouldValidate: true });
      setUploadSuccess(true);
      toast({ title: "Upload Successful", description: "Image is ready." });
    } catch (error: any) {
      setUploadError(error.message);
      toast({ title: 'Upload Failed', description: error.message, variant: 'destructive' });
      setImagePreview(initialData?.imagePath || null); // Revert preview on failure
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl font-headline font-bold text-primary">
          {initialData ? 'Edit Journal Category' : 'Create New Journal Category'}
        </CardTitle>
        <CardDescription>
          {initialData ? `Editing details for "${initialData.name}"` : 'Fill in the details for the new journal category.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left side - form fields */}
              <div className="md:col-span-2 space-y-6">
                <FormField control={form.control} name="name" render={({ field }) => <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>} />
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <TiptapEditor
                                content={field.value}
                                onChange={field.onChange}
                                isSubmitting={isSubmitting}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="imageHint" render={({ field }) => <FormItem><FormLabel>Image Hint</FormLabel><FormControl><Input {...field} placeholder="e.g., science lab, law books" disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="abbreviation" render={({ field }) => <FormItem><FormLabel>Abbreviation</FormLabel><FormControl><Input {...field} disabled={isSubmitting} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>} />
                  <FormField control={form.control} name="language" render={({ field }) => <FormItem><FormLabel>Language</FormLabel><FormControl><Input {...field} disabled={isSubmitting} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>} />
                  <FormField control={form.control} name="issn" render={({ field }) => <FormItem><FormLabel>ISSN</FormLabel><FormControl><Input {...field} disabled={isSubmitting} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>} />
                  <FormField control={form.control} name="doiBase" render={({ field }) => <FormItem><FormLabel>DOI Base</FormLabel><FormControl><Input {...field} placeholder="e.g., 10.5897/JBSB" disabled={isSubmitting} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>} />
                  <FormField control={form.control} name="displayIssn" render={({ field }) => <FormItem><FormLabel>Display ISSN</FormLabel><FormControl><Input {...field} placeholder="e.g., ISSN: 2141-2200" disabled={isSubmitting} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>} />
                  <FormField control={form.control} name="iconName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}><FormControl><SelectTrigger>{field.value ? <div className="flex items-center">{iconMap[field.value as IconName]} {field.value}</div> : "Select an icon"}</SelectTrigger></FormControl>
                        <SelectContent>{Object.keys(iconMap).map(iconName => (<SelectItem key={iconName} value={iconName}><div className="flex items-center">{iconMap[iconName as IconName]} {iconName}</div></SelectItem>))}</SelectContent>
                      </Select><FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="startYear" render={({ field }) => <FormItem><FormLabel>Start Year</FormLabel><FormControl><Input type="number" {...field} disabled={isSubmitting} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>} />
                  <FormField control={form.control} name="copyrightYear" render={({ field }) => <FormItem><FormLabel>Copyright Year</FormLabel><FormControl><Input type="number" {...field} disabled={isSubmitting} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>} />
                </div>
              </div>
              {/* Right side - image upload and preview */}
              <div className="space-y-4">
                <FormField control={form.control} name="imagePath" render={() => (
                  <FormItem>
                    <FormLabel>Category Thumbnail</FormLabel>
                    {imagePreview && (
                      <div className="mt-2 aspect-video w-full relative rounded-md overflow-hidden border">
                        <Image src={imagePreview} alt="Image Preview" layout="fill" objectFit="cover" />
                      </div>
                    )}
                    <FormControl>
                      <Button type="button" variant="outline" asChild disabled={isUploading || isSubmitting} className="w-full mt-2">
                        <label htmlFor="image-upload" className="cursor-pointer flex items-center gap-2">
                          <FileUp className="w-4 h-4" />
                          {isUploading ? 'Uploading...' : 'Choose Image'}
                        </label>
                      </Button>
                    </FormControl>
                    <Input id="image-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/jpg" disabled={isUploading || isSubmitting}/>
                    {fileName && (
                      <div className="mt-2 text-sm flex items-center gap-2 text-muted-foreground">
                        {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {uploadSuccess && <CheckCircle className="w-4 h-4 text-green-500" />}
                        {uploadError && <AlertCircle className="w-4 h-4 text-destructive" />}
                        <span className="truncate">{fileName}</span>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-6 border-t mt-6">
              <Button type="button" variant="outline" onClick={() => router.push('/admin/dashboard/journals')} disabled={isSubmitting || isUploading}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isUploading}>
                {(isSubmitting || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {initialData ? 'Save Changes' : 'Create Category'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
