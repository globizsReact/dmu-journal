
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Manuscript } from '@prisma/client';
import { journalCategories } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
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
import { ExternalLink, Loader2, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isValid } from 'date-fns';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ManuscriptWithAuthor extends Manuscript {
  submittedBy?: {
    fullName: string | null;
    email: string | null;
  } | null;
}

interface ApiResponse {
  manuscripts: ManuscriptWithAuthor[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export default function ManuscriptListTable() {
  const [manuscripts, setManuscripts] = useState<ManuscriptWithAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [authToken, setAuthToken] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10); // Items per page

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      setAuthToken(token);
      if (!token) {
        setIsLoading(false);
        setError("Authentication token not found. Please log in.");
        setManuscripts([]);
      }
    }
  }, []);

  const fetchManuscripts = useCallback(async (page: number) => {
    if (!authToken) {
      setIsLoading(false);
      setError("Authentication token not found. Please log in.");
      setManuscripts([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/all-manuscripts?page=${page}&limit=${limit}`, {
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch manuscripts: ${response.statusText}`);
      }
      const data: ApiResponse = await response.json();
      setManuscripts(data.manuscripts);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (err: any) {
      console.error("Error fetching manuscripts for admin:", err);
      setError(err.message || "An unexpected error occurred.");
      toast({
        title: "Error Fetching Manuscripts",
        description: err.message || "Could not load submissions for review.",
        variant: "destructive",
      });
      setManuscripts([]);
    } finally {
      setIsLoading(false);
    }
  }, [authToken, limit, toast]);
  
  useEffect(() => {
    if (authToken) {
      fetchManuscripts(currentPage);
    } else {
      setIsLoading(false);
      setError("Authentication token not found. Please log in.");
      setManuscripts([]);
    }
  }, [currentPage, authToken, fetchManuscripts]);


  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };

  const getJournalName = (journalId: string) => {
    const category = journalCategories.find(cat => cat.id === journalId);
    return category ? category.name : 'Unknown Journal';
  };

  const formatSubmittedDate = (dateString: string | Date | null | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return isValid(date) ? format(date, 'PPpp') : 'Invalid Date';
    } catch (e) {
      return 'Error';
    }
  };

  if (isLoading && manuscripts.length === 0 && !error && authToken) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl lg:text-3xl font-headline font-bold text-primary">All Submitted Manuscripts</CardTitle>
          <CardDescription>Review and manage manuscript submissions.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-3 text-muted-foreground">Loading manuscripts...</p>
        </CardContent>
      </Card>
    );
  }

  if (error && manuscripts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl lg:text-3xl font-headline font-bold text-primary">Error</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-10">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive text-lg mb-2">Failed to Load Manuscripts</p>
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl lg:text-3xl font-headline font-bold text-primary">All Submitted Manuscripts</CardTitle>
        <CardDescription>Review and manage manuscript submissions. Showing page {currentPage} of {totalPages}.</CardDescription>
      </CardHeader>
      <CardContent>
         {isLoading && (
             <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
        )}
        {!isLoading && !error && manuscripts.length === 0 && (
          <p className="text-foreground/80 text-center py-8">No manuscripts found.</p>
        )}
        {!isLoading && !error && manuscripts.length > 0 && (
          <div className="overflow-x-auto">
            <Table className="min-w-[800px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Article Title</TableHead>
                  <TableHead>Submitting Author</TableHead>
                  <TableHead>Journal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {manuscripts.map((manuscript) => (
                  <TableRow key={manuscript.id}>
                    <TableCell className="font-medium">{manuscript.articleTitle}</TableCell>
                    <TableCell>
                      {manuscript.submittedBy?.fullName || 'N/A'}
                      {manuscript.submittedBy?.email && <span className="block text-xs text-muted-foreground">{manuscript.submittedBy.email}</span>}
                    </TableCell>
                    <TableCell>{getJournalName(manuscript.journalCategoryId)}</TableCell>
                    <TableCell>
                      <span
                        className={cn(`px-2 py-1 text-xs font-semibold rounded-full
                          ${manuscript.status === 'Submitted' ? 'bg-blue-100 text-blue-700' :
                            manuscript.status === 'In Review' ? 'bg-yellow-100 text-yellow-700' :
                            manuscript.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                            manuscript.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'}`)}
                      >
                        {manuscript.status}
                      </span>
                    </TableCell>
                    <TableCell>{formatSubmittedDate(manuscript.submittedAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm" disabled={isLoading}>
                        <Link href={`/admin/dashboard/manuscripts/${manuscript.id}`}>
                          <ExternalLink className="w-3.5 h-3.5 md:mr-1" />
                          <span className="hidden md:inline">Details</span>
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {!isLoading && !error && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-2 py-4 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="w-full sm:w-auto"
            >
             <ChevronLeft className="mr-1 h-4 w-4" /> Previous
            </Button>
             <span className="text-sm text-muted-foreground whitespace-nowrap">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              className="w-full sm:w-auto"
            >
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
    
