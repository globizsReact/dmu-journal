
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
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Loader2, AlertTriangle, ExternalLink, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isValid } from 'date-fns';
import Link from 'next/link';

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

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10); // Items per page

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      setAuthToken(token);
    }
  }, []);

  const fetchManuscripts = useCallback(async (page: number, search: string) => {
    if (!authToken) {
      setIsLoading(false);
      setError("Authentication token not found. Please log in.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/all-manuscripts?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`, {
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
    } finally {
      setIsLoading(false);
    }
  }, [authToken, limit, toast]);
  
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchManuscripts(1, searchQuery); // Reset to page 1 on new search
    }, 500); // Debounce search
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, fetchManuscripts]);

  useEffect(() => {
    if (authToken) {
        fetchManuscripts(currentPage, searchQuery);
    }
  }, [currentPage, authToken, fetchManuscripts]); // searchQuery removed as it's handled by its own useEffect


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
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

  if (isLoading && manuscripts.length === 0) { // Show full card loading only on initial load
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-headline font-bold text-primary">All Submitted Manuscripts</CardTitle>
          <CardDescription>Review and manage manuscript submissions.</CardDescription>
           <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search manuscripts..." className="pl-8 w-full sm:w-64" disabled />
          </div>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-3 text-muted-foreground">Loading manuscripts...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-headline font-bold text-primary">Error</CardTitle>
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
        <CardTitle className="text-2xl md:text-3xl font-headline font-bold text-primary">All Submitted Manuscripts</CardTitle>
        <CardDescription>Review and manage manuscript submissions. Showing page {currentPage} of {totalPages}.</CardDescription>
        <div className="relative mt-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by title, author, or ID..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-8 w-full md:w-1/2 lg:w-1/3"
          />
        </div>
      </CardHeader>
      <CardContent>
         {isLoading && (
             <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
        )}
        {!isLoading && manuscripts.length === 0 && (
          <p className="text-foreground/80 text-center py-8">No manuscripts found matching your criteria.</p>
        )}
        {!isLoading && manuscripts.length > 0 && (
          <Table>
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
                      className={`px-2 py-1 text-xs font-semibold rounded-full
                        ${manuscript.status === 'Submitted' ? 'bg-blue-100 text-blue-700' :
                          manuscript.status === 'In Review' ? 'bg-yellow-100 text-yellow-700' :
                          manuscript.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                          manuscript.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'}`}
                    >
                      {manuscript.status}
                    </span>
                  </TableCell>
                  <TableCell>{formatSubmittedDate(manuscript.submittedAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/dashboard/manuscripts/${manuscript.id}`}>
                        <ExternalLink className="w-3.5 h-3.5 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">Details</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {/* Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
             <ChevronLeft className="mr-1 h-4 w-4" /> Previous
            </Button>
             <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
    