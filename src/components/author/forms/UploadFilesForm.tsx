
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label'; // Not strictly needed if FormLabel is used
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
import { Loader2 } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const uploadFilesSchema = z.object({
  coverLetterFile: z
    .custom<File | undefined>() // Use .custom for File objects with react-hook-form
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
  authorAgreement: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You must acknowledge the author agreement.',
    }),
});

export type UploadFilesData = z.infer<typeof uploadFilesSchema>;

interface UploadFilesFormProps {
  onFinish: (data: UploadFilesData) => Promise<void>; // Changed to Promise<void> for async
  onPrevious: () => void;
  isSubmitting: boolean;
}

export default function UploadFilesForm({ onFinish, onPrevious, isSubmitting }: UploadFilesFormProps) {
  const [coverLetterFileName, setCoverLetterFileName] = useState<string | null>(null);
  const [manuscriptFileName, setManuscriptFileName] = useState<string | null>(null);
  const [supplementaryFilesName, setSupplementaryFilesName] = useState<string | null>(null);

  const form = useForm<UploadFilesData>({
    resolver: zodResolver(uploadFilesSchema),
    defaultValues: {
      authorAgreement: false,
      coverLetterFile: undefined,
      manuscriptFile: undefined,
      supplementaryFiles: undefined,
    },
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: 'coverLetterFile' | 'manuscriptFile' | 'supplementaryFiles', // More specific type
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

  async function onSubmit(data: UploadFilesData) {
    await onFinish(data); // Call the async onFinish
    // Resetting form and file names is now handled by SubmitManuscriptStepper's handleSubmitAnother
    // if the parent component triggers a re-render or uses a key on this form.
    // If direct reset is needed here after onFinish, ensure it doesn't conflict.
    // For now, parent handles reset flow for "Submit Another".
  }
  
  // Effect to reset local file name states if the form is reset externally (e.g. by parent after submission)
  // This relies on the `isSubmitting` prop changing after submission flow.
  // A better approach might be for the parent to pass down a `key` to this component to force re-mount and full reset.
  React.useEffect(() => {
    if (form.formState.isSubmitSuccessful && !isSubmitting) { // If form was successful and parent is no longer submitting
      setCoverLetterFileName(null);
      setManuscriptFileName(null);
      setSupplementaryFilesName(null);
      form.reset({ // Explicitly reset form fields for react-hook-form
          authorAgreement: false,
          coverLetterFile: undefined,
          manuscriptFile: undefined,
          supplementaryFiles: undefined,
      });
    }
  }, [form.formState.isSubmitSuccessful, isSubmitting, form]);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">Step 3: Upload Files & Submit</h3>

        <div className="space-y-6">
          {/* Cover Letter */}
          <FormField
            control={form.control}
            name="coverLetterFile"
            render={({ field }) => ( // field does not include onChange directly for file inputs with RHF like this
              <FormItem className="border-b border-border pb-4">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-foreground/80">Cover Letter</FormLabel>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" asChild disabled={isSubmitting}>
                      <Label htmlFor="coverLetterFile-input" className="cursor-pointer">
                        Choose File
                      </Label>
                    </Button>
                    <FormControl>
                      <Input
                        id="coverLetterFile-input"
                        type="file"
                        className="hidden"
                        accept={ACCEPTED_FILE_TYPES.join(',')}
                        onChange={(e) => handleFileChange(e, 'coverLetterFile', setCoverLetterFileName)}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <span className="text-sm text-muted-foreground w-40 truncate">
                      {coverLetterFileName || 'No File Chosen'}
                    </span>
                  </div>
                </div>
                <FormMessage className="text-right" />
              </FormItem>
            )}
          />

          {/* Manuscript File */}
          <FormField
            control={form.control}
            name="manuscriptFile"
            render={({ field }) => (
              <FormItem className="border-b border-border pb-4">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-foreground/80">Manuscript File <span className="text-destructive">*</span></FormLabel>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" asChild disabled={isSubmitting}>
                      <Label htmlFor="manuscriptFile-input" className="cursor-pointer">
                        Choose File
                      </Label>
                    </Button>
                    <FormControl>
                      <Input
                        id="manuscriptFile-input"
                        type="file"
                        className="hidden"
                        accept={ACCEPTED_FILE_TYPES.join(',')}
                        onChange={(e) => handleFileChange(e, 'manuscriptFile', setManuscriptFileName)}
                        disabled={isSubmitting}
                        // 'required' attribute is not needed here as Zod handles it
                      />
                    </FormControl>
                     <span className="text-sm text-muted-foreground w-40 truncate">
                      {manuscriptFileName || 'No File Chosen'}
                    </span>
                  </div>
                </div>
                <FormMessage className="text-right" />
              </FormItem>
            )}
          />

          {/* Supplementary Files */}
          <FormField
            control={form.control}
            name="supplementaryFiles"
            render={({ field }) => (
              <FormItem className="border-b border-border pb-4">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-foreground/80">Supplementary Files</FormLabel>
                  <div className="flex items-center gap-2">
                     <Button type="button" variant="outline" size="sm" asChild disabled={isSubmitting}>
                      <Label htmlFor="supplementaryFiles-input" className="cursor-pointer">
                        Choose File
                      </Label>
                    </Button>
                    <FormControl>
                      <Input
                        id="supplementaryFiles-input"
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, 'supplementaryFiles', setSupplementaryFilesName)}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                     <span className="text-sm text-muted-foreground w-40 truncate">
                      {supplementaryFilesName || 'No File Chosen'}
                    </span>
                  </div>
                </div>
                <FormMessage className="text-right" />
              </FormItem>
            )}
          />
        </div>
        
        <Separator />

        <FormField
          control={form.control}
          name="authorAgreement"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 items-center justify-center">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="authorAgreement"
                  disabled={isSubmitting}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <Label htmlFor="authorAgreement" className="text-sm font-normal text-foreground/80 cursor-pointer">
                  By Submitting This Manuscript, I Acknowledge That I Have Read And Understand The{' '}
                  <Link href="/authors-section#copyright-and-permissions" target="_blank" className="text-primary hover:underline">
                    Author Agreement
                  </Link>. <span className="text-destructive">*</span>
                </Label>
                <FormMessage /> {/* This will show Zod's message if checkbox is not checked */}
              </div>
            </FormItem>
          )}
        />

        <div className="mt-10 flex justify-between">
          <Button
            type="button"
            onClick={onPrevious}
            variant="outline"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800"
            disabled={isSubmitting}
          >
            Previous
          </Button>
          <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" disabled={isSubmitting}>
            {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Finish & Submit'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
