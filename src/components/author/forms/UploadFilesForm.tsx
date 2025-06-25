
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Loader2, FileUp, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_THUMBNAIL_SIZE_MB = 2;
const MAX_THUMBNAIL_SIZE_BYTES = MAX_THUMBNAIL_SIZE_MB * 1024 * 1024;

const uploadFilesSchema = z.object({
  coverLetterFile: z
    .custom<File | undefined>()
    .optional()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => !file || ACCEPTED_FILE_TYPES.includes(file.type),
      '.pdf, .doc, .docx files are accepted for cover letter.'
    ),
  manuscriptFile: z
    .custom<File>((val) => val instanceof File, { message: 'Manuscript file is required.'})
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      'Manuscript must be a .pdf, .doc, or .docx file.'
    ),
  supplementaryFiles: z
    .custom<File | undefined>()
    .optional()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, `Max file size for supplementary files is 5MB.`),
  thumbnailImagePath: z.string().optional(),
  thumbnailImageHint: z.string().optional(),
  authorAgreement: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You must acknowledge the author agreement.',
    }),
});

export type UploadFilesData = z.infer<typeof uploadFilesSchema>;

interface UploadFilesFormProps {
  onFinish: (data: UploadFilesData) => Promise<void>;
  onPrevious: () => void;
  isSubmitting: boolean;
}

export default function UploadFilesForm({ onFinish, onPrevious, isSubmitting }: UploadFilesFormProps) {
  const [coverLetterFileName, setCoverLetterFileName] = useState<string | null>(null);
  const [manuscriptFileName, setManuscriptFileName] = useState<string | null>(null);
  const [supplementaryFilesName, setSupplementaryFilesName] = useState<string | null>(null);
  
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [thumbnailUploadSuccess, setThumbnailUploadSuccess] = useState(false);
  const [thumbnailUploadError, setThumbnailUploadError] = useState<string | null>(null);
  const [thumbnailFileName, setThumbnailFileName] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<UploadFilesData>({
    resolver: zodResolver(uploadFilesSchema),
    defaultValues: {
      authorAgreement: false,
    },
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      setAuthToken(token);
    }
  }, []);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: 'coverLetterFile' | 'manuscriptFile' | 'supplementaryFiles',
    setter: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue(fieldName, file); 
      setter(file.name);
      form.trigger(fieldName); 
    } else {
      form.setValue(fieldName, undefined);
      setter(null);
      form.trigger(fieldName);
    }
  };

  const handleThumbnailChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_THUMBNAIL_SIZE_BYTES) {
      toast({
        title: "File Too Large",
        description: `Thumbnail image must be less than ${MAX_THUMBNAIL_SIZE_MB}MB.`,
        variant: "destructive",
      });
      if (event.target) event.target.value = "";
      return;
    }
    
    if (!authToken) {
       toast({ title: 'Not Authenticated', description: 'Cannot upload file.', variant: 'destructive' });
       return;
    }

    setIsUploadingThumbnail(true);
    setThumbnailUploadSuccess(false);
    setThumbnailUploadError(null);
    setThumbnailFileName(file.name);
    setThumbnailPreview(URL.createObjectURL(file));
    form.setValue('thumbnailImagePath', '');

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/author/uploads/presigned-url', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: formData,
      });
      const { publicUrl, error } = await response.json();
      if (!response.ok) throw new Error(error || 'Failed to upload file.');
      form.setValue('thumbnailImagePath', publicUrl, { shouldValidate: true });
      setThumbnailUploadSuccess(true);
      toast({ title: "Upload Successful", description: "Thumbnail is ready." });
    } catch (error: any) {
      setThumbnailUploadError(error.message);
      toast({ title: 'Upload Failed', description: error.message, variant: 'destructive' });
      setThumbnailPreview(null);
    } finally {
      setIsUploadingThumbnail(false);
    }
  };


  async function onSubmit(data: UploadFilesData) {
    await onFinish(data);
    form.reset();
    setCoverLetterFileName(null);
    setManuscriptFileName(null);
    setSupplementaryFilesName(null);
    setThumbnailFileName(null);
    setThumbnailPreview(null);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">Step 3: Upload Files & Submit</h3>

        <div className="space-y-6">
          <FormField name="coverLetterFile" render={() => ( /* ... */ )} />
          <FormField name="manuscriptFile" render={() => ( /* ... */ )} />
          <FormField name="supplementaryFiles" render={() => ( /* ... */ )} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
                <FormField control={form.control} name="coverLetterFile" render={() => (
                    <FormItem className="border-b border-border pb-4">
                        <div className="flex items-center justify-between">
                        <FormLabel className="text-foreground/80">Cover Letter</FormLabel>
                        <div className="flex items-center gap-2"><Button type="button" variant="outline" size="sm" asChild disabled={isSubmitting}><Label htmlFor="coverLetterFile-input" className="cursor-pointer">Choose File</Label></Button><FormControl><Input id="coverLetterFile-input" type="file" className="hidden" accept={ACCEPTED_FILE_TYPES.join(',')} onChange={(e) => handleFileChange(e, 'coverLetterFile', setCoverLetterFileName)} disabled={isSubmitting}/></FormControl><span className="text-sm text-muted-foreground w-40 truncate">{coverLetterFileName || 'No File Chosen'}</span></div>
                        </div><FormMessage className="text-right" />
                    </FormItem>
                )} />
                <FormField control={form.control} name="manuscriptFile" render={() => (
                    <FormItem className="border-b border-border pb-4">
                        <div className="flex items-center justify-between">
                        <FormLabel className="text-foreground/80">Manuscript File <span className="text-destructive">*</span></FormLabel>
                        <div className="flex items-center gap-2"><Button type="button" variant="outline" size="sm" asChild disabled={isSubmitting}><Label htmlFor="manuscriptFile-input" className="cursor-pointer">Choose File</Label></Button><FormControl><Input id="manuscriptFile-input" type="file" className="hidden" accept={ACCEPTED_FILE_TYPES.join(',')} onChange={(e) => handleFileChange(e, 'manuscriptFile', setManuscriptFileName)} disabled={isSubmitting}/></FormControl><span className="text-sm text-muted-foreground w-40 truncate">{manuscriptFileName || 'No File Chosen'}</span></div>
                        </div><FormMessage className="text-right" />
                    </FormItem>
                )} />
                <FormField control={form.control} name="supplementaryFiles" render={() => (
                    <FormItem className="border-b border-border pb-4">
                        <div className="flex items-center justify-between">
                        <FormLabel className="text-foreground/80">Supplementary Files</FormLabel>
                        <div className="flex items-center gap-2"><Button type="button" variant="outline" size="sm" asChild disabled={isSubmitting}><Label htmlFor="supplementaryFiles-input" className="cursor-pointer">Choose File</Label></Button><FormControl><Input id="supplementaryFiles-input" type="file" className="hidden" onChange={(e) => handleFileChange(e, 'supplementaryFiles', setSupplementaryFilesName)} disabled={isSubmitting}/></FormControl><span className="text-sm text-muted-foreground w-40 truncate">{supplementaryFilesName || 'No File Chosen'}</span></div>
                        </div><FormMessage className="text-right" />
                    </FormItem>
                )} />
            </div>

            <div className="space-y-4">
                <FormField control={form.control} name="thumbnailImagePath" render={() => (
                    <FormItem>
                        <FormLabel>Thumbnail Photo (Optional)</FormLabel>
                        {thumbnailPreview && <div className="mt-2 aspect-video w-full relative rounded-md overflow-hidden border"><Image src={thumbnailPreview} alt="Thumbnail Preview" layout="fill" objectFit="cover" /></div>}
                        <FormControl>
                            <Button type="button" variant="outline" asChild disabled={isUploadingThumbnail || isSubmitting} className="w-full mt-2"><label htmlFor="thumbnail-upload" className="cursor-pointer flex items-center gap-2"><FileUp className="w-4 h-4" />{isUploadingThumbnail ? 'Uploading...' : 'Choose Image'}</label></Button>
                        </FormControl>
                        <Input id="thumbnail-upload" type="file" className="hidden" onChange={handleThumbnailChange} accept="image/png, image/jpeg, image/webp" disabled={isUploadingThumbnail || isSubmitting}/>
                        {thumbnailFileName && <div className="mt-2 text-sm flex items-center gap-2 text-muted-foreground">{isUploadingThumbnail && <Loader2 className="w-4 h-4 animate-spin" />}{thumbnailUploadSuccess && <CheckCircle className="w-4 h-4 text-green-500" />}{thumbnailUploadError && <AlertCircle className="w-4 h-4 text-destructive" />}<span className="truncate">{thumbnailFileName}</span></div>}
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="thumbnailImageHint" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Image Hint (Optional)</FormLabel>
                        <FormControl><Input {...field} placeholder="e.g., science lab, data chart" disabled={isSubmitting || isUploadingThumbnail} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
        </div>
        
        <Separator />

        <FormField control={form.control} name="authorAgreement" render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 items-center justify-center">
              <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} id="authorAgreement" disabled={isSubmitting}/></FormControl>
              <div className="space-y-1 leading-none">
                <Label htmlFor="authorAgreement" className="text-sm font-normal text-foreground/80 cursor-pointer">
                  By Submitting This Manuscript, I Acknowledge That I Have Read And Understand The{' '}
                  <Link href="/authors-section#copyright-and-permissions" target="_blank" className="text-primary hover:underline">Author Agreement</Link>. <span className="text-destructive">*</span>
                </Label>
                <FormMessage />
              </div>
            </FormItem>
        )} />

        <div className="mt-10 flex justify-between">
          <Button type="button" onClick={onPrevious} variant="outline" className="bg-gray-300 hover:bg-gray-400 text-gray-800" disabled={isSubmitting || isUploadingThumbnail}>Previous</Button>
          <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" disabled={isSubmitting || isUploadingThumbnail}>
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</> : 'Finish & Submit'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
