
'use client';

import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Trash2, Loader2 } from 'lucide-react';

const authorSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  givenName: z.string().min(1, 'Given name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  email: z.string().email('Invalid email address.').min(1, 'Email is required.'),
  affiliation: z.string().min(1, 'Affiliation is required.'),
  country: z.string().min(1, 'Country is required.'),
});

const authorDetailsSchema = z.object({
  authors: z.array(authorSchema).min(1, 'At least one author is required.'),
});

export type AuthorDetailsData = z.infer<typeof authorDetailsSchema>;

interface AuthorDetailsFormProps {
  onValidatedNext: (data: AuthorDetailsData) => void;
  onPrevious: () => void;
  initialData?: AuthorDetailsData | null;
  isSubmitting: boolean; // Added prop
}

const authorTitles = ['Dr.', 'Prof.', 'Mr.', 'Ms.', 'Mrs.'];

export default function AuthorDetailsForm({ onValidatedNext, onPrevious, initialData, isSubmitting }: AuthorDetailsFormProps) {
  const form = useForm<AuthorDetailsData>({
    resolver: zodResolver(authorDetailsSchema),
    defaultValues: initialData || {
      authors: [{ title: '', givenName: '', lastName: '', email: '', affiliation: '', country: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'authors',
  });

  function onSubmit(data: AuthorDetailsData) {
    onValidatedNext(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">Step 2: Author(s) Details</h3>
        
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4 border border-border p-4 rounded-md shadow-sm relative">
            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                onClick={() => !isSubmitting && remove(index)}
                disabled={isSubmitting}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove Author</span>
              </Button>
            )}
            <p className="text-md font-medium text-primary">Author {index + 1}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={`authors.${index}.title`}
                render={({ field: controllerField }) => (
                  <FormItem>
                    <FormLabel>Title <span className="text-destructive">*</span></FormLabel>
                    <Select 
                        onValueChange={controllerField.onChange} 
                        defaultValue={controllerField.value}
                        disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select title" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {authorTitles.map(title => (
                          <SelectItem key={title} value={title}>{title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`authors.${index}.givenName`}
                render={({ field: controllerField }) => (
                  <FormItem>
                    <FormLabel>Given Name <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Enter given name" {...controllerField} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`authors.${index}.lastName`}
                render={({ field: controllerField }) => (
                  <FormItem>
                    <FormLabel>Last Name <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" {...controllerField} disabled={isSubmitting}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`authors.${index}.email`}
                render={({ field: controllerField }) => (
                  <FormItem>
                    <FormLabel>Email Address <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email address" {...controllerField} disabled={isSubmitting}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`authors.${index}.affiliation`}
                render={({ field: controllerField }) => (
                  <FormItem>
                    <FormLabel>Affiliation <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Enter affiliation" {...controllerField} disabled={isSubmitting}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`authors.${index}.country`}
                render={({ field: controllerField }) => (
                  <FormItem>
                    <FormLabel>Country <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Enter country" {...controllerField} disabled={isSubmitting}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ title: '', givenName: '', lastName: '', email: '', affiliation: '', country: '' })}
          className="border-dashed border-primary text-primary hover:bg-primary/10"
          disabled={isSubmitting}
        >
          Add More Author
        </Button>

        <div className="mt-8 flex justify-between">
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
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
}
