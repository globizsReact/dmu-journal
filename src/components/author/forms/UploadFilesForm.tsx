
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
import { toPublicUrl } from '@/lib/urlUtils';

const MAX_DOC_SIZE_MB = 5;
const MAX_DOC_SIZE_BYTES = MAX_DOC_SIZE_MB * 1024 * 1024;
const ACCEPTED_DOC_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_IMAGE_SIZE_MB = 2;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

const uploadFilesSchema = z.object({
  coverLetterImagePath: z.string().url('Cover letter image is required.').min(1, 'Cover letter image is required.'),
  coverLetterImageHint: z.string().min(1, 'Image hint is required.'),
  manuscriptFileUrl: z.string().url({ message: 'Manuscript file is required.' }),
  supplementaryFileUrl: z.string().url().optional().or(z.literal('')),
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
  const [authToken, setAuthToken] = useState<string | null>(null);
  const { toast } = useToast();

  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});
  const [fileNames, setFileNames] = useState<Record<string, string | null>>({});
  const [uploadErrors, setUploadErrors] = useState<Record<string, string | null>>({});
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<UploadFilesData>({
    resolver: zodResolver(uploadFilesSchema),
    defaultValues: {
      authorAgreement: false,
      coverLetterImagePath: '',
      manuscriptFileUrl: '',
      supplementaryFileUrl: '',
      coverLetterImageHint: '',
    },
  });
  
  const { setValue, trigger, getValues } = form;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      setAuthToken(token);
    }
  }, []);
  
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: 'coverLetterImagePath' | 'manuscriptFileUrl' | 'supplementaryFileUrl',
    validationOptions: { maxSize: number, acceptedTypes: string[], isImage: boolean }
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > validationOptions.maxSize) {
      toast({ title: "File Too Large", description: `File must be less than ${validationOptions.maxSize / 1024 / 1024}MB.`, variant: "destructive" });
      return;
    }
    if (!validationOptions.acceptedTypes.includes(file.type)) {
       toast({ title: "Invalid File Type", description: `Please select a valid file type.`, variant: "destructive" });
       return;
    }
     if (!authToken) {
       toast({ title: 'Not Authenticated', description: 'Cannot upload file.', variant: 'destructive' });
       return;
    }

    setIsUploading(prev => ({ ...prev, [fieldName]: true }));
    setFileNames(prev => ({ ...prev, [fieldName]: file.name }));
    setUploadErrors(prev => ({ ...prev, [fieldName]: null }));
    if(validationOptions.isImage) setImagePreview(URL.createObjectURL(file));

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
      
      setValue(fieldName, publicUrl, { shouldValidate: true });
      toast({ title: "Upload Successful", description: `${file.name} is ready.` });
    } catch (error: any) {
      setUploadErrors(prev => ({...prev, [fieldName]: error.message}));
      toast({ title: 'Upload Failed', description: error.message, variant: 'destructive' });
      setValue(fieldName, '', { shouldValidate: true });
      if(validationOptions.isImage) setImagePreview(null);
    } finally {
      setIsUploading(prev => ({ ...prev, [fieldName]: false }));
    }
  };
  
  const renderFileInput = (
    name: 'coverLetterImagePath' | 'manuscriptFileUrl' | 'supplementaryFileUrl',
    label: string,
    isRequired: boolean,
    validationOptions: { maxSize: number, acceptedTypes: string[], isImage: boolean }
  ) => {
      const fileName = fileNames[name];
      const isUploading = !!isUploading[name];
      const uploadError = uploadErrors[name];
      const hasUrl = !!getValues(name);

      return (
         <FormItem className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
            <FormLabel className="text-foreground/80">{label} {isRequired && <span className="text-destructive">*</span>}</FormLabel>
            <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" asChild disabled={isSubmitting || isUploading}><Label htmlFor={`${name}-input`} className="cursor-pointer">Choose File</Label></Button>
                <FormControl><Input id={`${name}-input`} type="file" className="hidden" accept={validationOptions.acceptedTypes.join(',')} onChange={(e) => handleFileUpload(e, name, validationOptions)} disabled={isSubmitting || isUploading}/></FormControl>
                {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                {!isUploading && hasUrl && <CheckCircle className="w-4 h-4 text-green-500" />}
                {uploadError && <AlertCircle className="w-4 h-4 text-destructive" />}
                <span className="text-sm text-muted-foreground w-40 truncate">{fileName || 'No File Chosen'}</span>
            </div>
            </div><FormMessage className="text-right" />
        </FormItem>
      )
  }


  async function onSubmit(data: UploadFilesData) {
    await onFinish(data);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">Step 3: Upload Files & Submit</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="space-y-6">
                 {renderFileInput('manuscriptFileUrl', 'Manuscript File', true, { maxSize: MAX_DOC_SIZE_BYTES, acceptedTypes: ACCEPTED_DOC_TYPES, isImage: false })}
                 {renderFileInput('supplementaryFileUrl', 'Supplementary Files', false, { maxSize: MAX_DOC_SIZE_BYTES, acceptedTypes: ACCEPTED_DOC_TYPES, isImage: false })}
            </div>
            <div className="space-y-4">
                <FormField control={form.control} name="coverLetterImagePath" render={() => (
                    <FormItem>
                        <FormLabel>Cover Letter Image <span className="text-destructive">*</span></FormLabel>
                        {imagePreview && <div className="mt-2 aspect-video w-full relative rounded-md overflow-hidden border"><Image src={toPublicUrl(imagePreview)} alt="Cover Letter Preview" fill sizes="33vw" className="object-cover" /></div>}
                        {renderFileInput('coverLetterImagePath', '', false, { maxSize: MAX_IMAGE_SIZE_BYTES, acceptedTypes: ACCEPTED_IMAGE_TYPES, isImage: true })}
                    </FormItem>
                )} />
                 <FormField control={form.control} name="coverLetterImageHint" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Image Hint <span className="text-destructive">*</span></FormLabel>
                        <FormControl><Input {...field} placeholder="e.g., science lab, data chart" disabled={isSubmitting || isUploading.coverLetterImagePath} /></FormControl>
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
          <Button type="button" onClick={onPrevious} variant="outline" className="bg-gray-300 hover:bg-gray-400 text-gray-800" disabled={isSubmitting || Object.values(isUploading).some(v => v)}>Previous</Button>
          <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" disabled={isSubmitting || Object.values(isUploading).some(v => v)}>
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</> : 'Finish & Submit'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
