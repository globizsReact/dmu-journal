
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import DashboardSidebar from '@/components/author/DashboardSidebar';
import DashboardStatCard from '@/components/author/DashboardStatCard';
import type { DashboardStatCardProps } from '@/components/author/DashboardStatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SubmitManuscriptStepper from '@/components/author/SubmitManuscriptStepper'; 
import { useToast } from '@/hooks/use-toast';
import type { Manuscript } from '@prisma/client'; // Import Prisma's Manuscript type
import { journalCategories } from '@/lib/data'; // To look up journal names
// import { format, isValid } from 'date-fns'; // Commented out for now
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

const dashboardItems: DashboardStatCardProps[] = [
  { title: 'NEW SUBMISSION', value: '0', variant: 'default', viewAllHref: '#' }, // Value could be dynamic later
  { title: 'MANUSCRIPTS IN REVIEW', value: '0', variant: 'info', viewAllHref: '#' },
  { title: 'ACCEPTED MANUSCRIPTS', value: '0', variant: 'default', viewAllHref: '#' },
  { 
    title: 'PAYMENTS DUE', 
    value: '$0.00', 
    variant: 'success', 
    viewAllHref: '#', 
    actionButton: { text: 'Pay Now', href: '#'} 
  },
  { title: 'PUBLISHED MANUSCRIPTS', value: '0', variant: 'info', viewAllHref: '#' },
  { title: 'SUSPENDED MANUSCRIPTS', value: '0', variant: 'default', viewAllHref: '#' },
  { title: 'WAIVER REQUESTS', value: '0', variant: 'default', viewAllHref: '#' },
];

const MyManuscriptView = () => {
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
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
      return;
    }

    const fetchManuscripts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/author/manuscripts', {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to fetch manuscripts: ${response.statusText}`);
        }
        const data = await response.json();
        setManuscripts(data);
      } catch (err: any) {
        console.error("Error fetching manuscripts:", err);
        setError(err.message || "An unexpected error occurred.");
        toast({
          title: "Error Fetching Manuscripts",
          description: err.message || "Could not load your submissions.",
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-headline font-bold text-primary">My Manuscripts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/80 text-center py-4">Loading your manuscripts...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-headline font-bold text-primary">My Manuscripts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive text-center py-4">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }
  
  if (manuscripts.length === 0) {
     return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-headline font-bold text-primary">My Manuscripts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/80 text-center py-4">You have not submitted any manuscripts yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl font-headline font-bold text-primary">My Manuscripts</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Article Title</TableHead>
              <TableHead>Journal</TableHead>
              <TableHead>Status</TableHead>
              {/* <TableHead>Submitted</TableHead> */} {/* Commented out for now */}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {manuscripts.map((manuscript) => {
              // For debugging date issues, if re-enabled:
              // console.log(`Processing Manuscript ID: ${manuscript.id}, raw submittedAt:`, manuscript.submittedAt, `(type: ${typeof manuscript.submittedAt})`);
              
              // let formattedDate = 'N/A';
              // if (manuscript.submittedAt) {
              //   const dateValue = manuscript.submittedAt;
              //   let dateToFormat: Date | null = null;
              //   let dateIsValidByIsValidFn = false;
              //   let dateIsValidByGetTime = false;

              //   try {
              //     dateToFormat = new Date(dateValue);
              //     // dateIsValidByIsValidFn = isValid(dateToFormat); // isValid from date-fns
              //     // Also check with getTime()
              //     dateIsValidByGetTime = dateToFormat instanceof Date && !isNaN(dateToFormat.getTime());

              //   } catch (initError: any) {
              //     console.error(`Error initializing Date for manuscript ID ${manuscript.id} with value '${dateValue}'. Error: ${initError.message}`);
              //   }
                
              //   // console.log(`Manuscript ID: ${manuscript.id}, Date object: ${dateToFormat?.toString()}, isValid (date-fns): ${dateIsValidByIsValidFn}, isValid (getTime): ${dateIsValidByGetTime}`);

              //   if (dateToFormat && dateIsValidByGetTime) { // Prioritize getTime check
              //     try {
              //       // formattedDate = format(dateToFormat, 'dd MMM yyyy, HH:mm'); // format from date-fns
              //     } catch (formatError: any) {
              //       console.error(`Error in format() for manuscript ID ${manuscript.id}. Date object was: ${dateToFormat.toString()}. isValid (getTime) result: ${dateIsValidByGetTime}. Error: ${formatError.message}. Stack: ${formatError.stack}`);
              //     }
              //   } else {
              //     console.warn(`Date deemed invalid or null for manuscript ID ${manuscript.id}. Original submittedAt: '${dateValue}', Parsed as: ${dateToFormat?.toString()}, isValid (getTime) result: ${dateIsValidByGetTime}`);
              //   }
              // } else {
              //   console.warn(`submittedAt is null, undefined, or empty for manuscript ID: ${manuscript.id}`);
              // }

              return (
                <TableRow key={manuscript.id}>
                  <TableCell className="font-medium">{manuscript.articleTitle}</TableCell>
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
                  {/* <TableCell> */}
                    {/* {formattedDate} */} {/* Commented out for now */}
                  {/* </TableCell> */}
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">View</span>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const EditProfileView = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-2xl md:text-3xl font-headline font-bold text-primary">View/Edit Profile</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-foreground/80">Authors will be able to view and update their personal information, institutional affiliations, contact details, and areas of expertise here. Maintaining an up-to-date profile is important for communication.</p>
    </CardContent>
  </Card>
);


export default function AuthorDashboardPage() {
  const [authorName, setAuthorName] = useState("Loading...");
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isAuthorLoggedIn') === 'true';
      const storedName = localStorage.getItem('authorName');
      
      if (!isLoggedIn) {
        router.push('/submit'); 
      } else if (storedName) {
        setAuthorName(storedName);
      } else {
        setAuthorName("Author"); 
      }
    }
  }, [router]);

  if (authorName === "Loading...") {
    return (
        <div className="flex flex-col min-h-screen bg-muted">
            <Header />
            <div className="flex-1 flex items-center justify-center">
                <p>Loading dashboard...</p>
            </div>
            <Footer />
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1 container mx-auto py-8 px-4 md:px-6 lg:px-8">
        <DashboardSidebar 
          authorName={authorName} 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <main className="flex-1 lg:ml-8 mt-8 lg:mt-0">
          {activeTab === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {dashboardItems.map((item) => (
                  <DashboardStatCard
                    key={item.title}
                    title={item.title}
                    value={item.value}
                    variant={item.variant}
                    viewAllHref={item.viewAllHref}
                    actionButton={item.actionButton}
                  />
                ))}
              </div>
              <div className="text-center mt-12 text-muted-foreground">
                <p>2025 Academic Journal</p>
              </div>
            </>
          )}
          {activeTab === 'submitManuscript' && <SubmitManuscriptStepper />}
          {activeTab === 'myManuscript' && <MyManuscriptView />}
          {activeTab === 'editProfile' && <EditProfileView />}
        </main>
      </div>
      <Footer />
    </div>
  );
}
    
