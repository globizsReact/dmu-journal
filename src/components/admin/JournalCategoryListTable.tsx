
'use client';

import { useState } from 'react';
import { journalCategories } from '@/lib/data';
import type { JournalCategory } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookIcon, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function JournalCategoryListTable() {
  const [categories, setCategories] = useState<JournalCategory[]>(journalCategories);
  const { toast } = useToast();

  const handleActionClick = (action: string) => {
    toast({
      title: 'Feature Not Implemented',
      description: `The "${action}" functionality requires database integration.`,
      variant: 'default',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-grow">
            <CardTitle className="text-xl md:text-2xl lg:text-3xl font-headline font-bold text-primary">Journal Categories</CardTitle>
            <CardDescription>View and manage journal categories. Management actions are disabled as this data is static.</CardDescription>
          </div>
          <Button onClick={() => handleActionClick('Add Category')} className="w-full sm:w-auto" disabled>
            <BookIcon className="mr-2 h-4 w-4" /> Add New Category
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[350px]">Name</TableHead>
                <TableHead>ISSN</TableHead>
                <TableHead>Start Year</TableHead>
                <TableHead>Published Articles</TableHead>
                <TableHead className="text-right w-[100px] sm:w-[130px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    {category.name}
                    <p className="text-xs text-muted-foreground line-clamp-2 font-normal">{category.description}</p>
                  </TableCell>
                  <TableCell>{category.issn || 'N/A'}</TableCell>
                  <TableCell>{category.startYear || 'N/A'}</TableCell>
                  <TableCell>{category.publishedArticlesCount || 0}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="outline" size="icon" className="h-7 w-7" title="Edit Category" onClick={() => handleActionClick('Edit')} disabled>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="destructive" size="icon" className="h-7 w-7" title="Delete Category" onClick={() => handleActionClick('Delete')} disabled>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
