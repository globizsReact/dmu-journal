
'use client';

import { useState, useEffect } from 'react';
import type { Manuscript } from '@prisma/client';
import { journalCategories } from '@/lib/data'; // To map journalId to name
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
import { Eye, Loader2, AlertTriangle } from 'lucide-react';
import { format, isValid } from 'date-fns';

// Extend Manuscript type to include submittedBy details if fetched
interface ManuscriptWithAuthor extends Manuscript {
  submittedBy?: {
    fullName: string | null;
    email: string | null;
  } | null;
}

export default function ManuscriptListTable() {
  const [manuscripts, setManuscripts] = useState<ManuscriptWithAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      setAuthToken(token);
    }
  }, []);

  useEffect(() => {
    if (!authToken) {
      setIsLoading(false);
      setError("Authentication token not found. Please log in.");
      return;
    }

    const fetchManuscripts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/admin/all-manuscripts', {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to fetch manuscripts: ${response.statusText} (Status: ${response.status})`);
        }
        const data: ManuscriptWithAuthor[] = await response.json();
        setManuscripts(data);
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
    };

    fetchManuscripts();
  }, [authToken, toast]);

  const getJournalName = (journalId: string) => {
    const category = journalCategories.find(cat => cat.id === journalId);
    return category ? category.name : 'Unknown Journal';
  };

  const formatSubmittedDate = (dateString: string | Date | null | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isValid(date)) {
        return format(date, 'PPpp'); // e.g., Jun 20, 2025, 6:40 PM
      }
      return 'Invalid Date';
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return 'Error';
    }
  };


  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-headline font-bold text-primary">All Submitted Manuscripts</CardTitle>
          <CardDescription>Review and manage manuscript submissions.</CardDescription>
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
          {error.includes("Status: 403") && <p className="text-sm mt-2 text-orange-600">You may not have the required 'admin' or 'reviewer' role.</p>}
        </CardContent>
      </Card>
    );
  }
  
  if (manuscripts.length === 0) {
     return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-headline font-bold text-primary">All Submitted Manuscripts</CardTitle>
          <CardDescription>Review and manage manuscript submissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/80 text-center py-8">No manuscripts have been submitted yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl font-headline font-bold text-primary">All Submitted Manuscripts</CardTitle>
        <CardDescription>Review and manage manuscript submissions. Found {manuscripts.length} manuscript(s).</CardDescription>
      </CardHeader>
      <CardContent>
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
                  <TableCell>
                    {formatSubmittedDate(manuscript.submittedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => alert(`View details for: ${manuscript.articleTitle}`)}>
                      <Eye className="w-4 h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Details</span>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
