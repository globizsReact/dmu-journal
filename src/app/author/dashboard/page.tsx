
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import DashboardSidebar from '@/components/author/DashboardSidebar';
import DashboardStatCard from '@/components/author/DashboardStatCard';
import type { DashboardStatCardProps } from '@/components/author/DashboardStatCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SubmitManuscriptStepper from '@/components/author/SubmitManuscriptStepper'; 
import { useToast } from '@/hooks/use-toast';
import type { Manuscript } from '@prisma/client';
import { journalCategories } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Eye, Loader2, Save, KeyRound } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const dashboardItems: DashboardStatCardProps[] = [
  { title: 'NEW SUBMISSION', value: '0', variant: 'default', viewAllHref: '#' },
  { title: 'MANUSCRIPTS IN REVIEW', value: '0', variant: 'info', viewAllHref: '#' },
  { title: 'ACCEPTED MANUSCRIPTS', value: '0', variant: 'default', viewAllHref: '#' },
  { 
    title: 'PAYMENTS DUE', 
    value: '₹0.00', 
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
              {/* <TableHead>Submitted</TableHead> */}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {manuscripts.map((manuscript) => (
                <TableRow key={manuscript.id}>
                  <TableCell className="font-medium">{manuscript.articleTitle}</TableCell>
                  <TableCell>{getJournalName(manuscript.journalCategoryId)}</TableCell>
                  <TableCell>
                      <span 
                          className={cn('px-2 py-1 text-xs font-semibold rounded-full', {
                            'bg-blue-100 text-blue-700': manuscript.status === 'Submitted',
                            'bg-yellow-100 text-yellow-700': manuscript.status === 'In Review',
                            'bg-green-100 text-green-700': manuscript.status === 'Accepted',
                            'bg-emerald-100 text-emerald-700': manuscript.status === 'Published',
                            'bg-orange-100 text-orange-700': manuscript.status === 'Suspended',
                            'bg-red-100 text-red-700': manuscript.status === 'Rejected', // Fallback for old data
                            'bg-gray-100 text-gray-700': !['Submitted', 'In Review', 'Accepted', 'Published', 'Suspended', 'Rejected'].includes(manuscript.status)
                          })}
                      >
                          {manuscript.status}
                      </span>
                  </TableCell>
                  {/* <TableCell>
                     {formattedDate}
                  </TableCell> */}
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/author/view-manuscript/${manuscript.id}`}>
                            <Eye className="w-4 h-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">View</span>
                        </Link>
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
};

const profileFormSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters.').max(100),
  username: z.string().min(3, 'Username must be at least 3 characters.').max(50)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores.'),
  email: z.string().email('Invalid email address.'),
});
type ProfileFormValues = z.infer<typeof profileFormSchema>;

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required.'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters.'),
  confirmNewPassword: z.string(),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match",
  path: ['confirmNewPassword'],
});
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const EditProfileView = () => {
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { toast } = useToast();
  const [authToken, setAuthToken] = useState<string | null>(null);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { fullName: '', username: '', email: '' },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      setAuthToken(token);
      if (token) {
        fetchUserProfile(token);
      } else {
        setIsLoadingProfile(false);
        toast({ title: "Error", description: "Not authenticated.", variant: "destructive" });
      }
    }
  }, []);

  const fetchUserProfile = async (token: string) => {
    setIsLoadingProfile(true);
    try {
      const response = await fetch('/api/author/profile', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to fetch profile');
      }
      const data = await response.json();
      profileForm.reset(data); // Populate form with fetched data
      // Update authorName in localStorage if it changed
      if (typeof window !== 'undefined' && data.fullName) {
        localStorage.setItem('authorName', data.fullName);
        window.dispatchEvent(new CustomEvent('authChange')); // Notify header or other components
      }
    } catch (error: any) {
      toast({ title: "Error Fetching Profile", description: error.message, variant: "destructive" });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const onProfileSubmit = async (values: ProfileFormValues) => {
    if (!authToken) return;
    setIsUpdatingProfile(true);
    try {
      const response = await fetch('/api/author/profile', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to update profile');
      }
      const updatedData = await response.json();
      toast({ title: "Profile Updated", description: "Your profile has been successfully updated." });
      profileForm.reset(updatedData); // Reset with new data to reflect changes
       if (typeof window !== 'undefined' && updatedData.fullName) {
        localStorage.setItem('authorName', updatedData.fullName);
        window.dispatchEvent(new CustomEvent('authChange'));
      }
    } catch (error: any) {
      toast({ title: "Error Updating Profile", description: error.message, variant: "destructive" });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const onPasswordSubmit = async (values: PasswordFormValues) => {
    if (!authToken) return;
    setIsChangingPassword(true);
    try {
      const response = await fetch('/api/author/change-password', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: values.currentPassword, newPassword: values.newPassword }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to change password');
      }
      toast({ title: "Password Changed", description: "Your password has been successfully updated." });
      passwordForm.reset(); // Clear password fields
    } catch (error: any) {
      toast({ title: "Error Changing Password", description: error.message, variant: "destructive" });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-headline font-bold text-primary">View/Edit Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-3 text-muted-foreground">Loading profile...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-headline font-semibold text-primary">Personal Information</CardTitle>
          <CardDescription>Update your personal details here.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
              <FormField control={profileForm.control} name="fullName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl><Input {...field} disabled={isUpdatingProfile} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={profileForm.control} name="username" render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl><Input {...field} disabled={isUpdatingProfile} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={profileForm.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl><Input type="email" {...field} disabled={isUpdatingProfile} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" disabled={isUpdatingProfile} className="bg-green-600 hover:bg-green-700">
                {isUpdatingProfile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Profile Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-headline font-semibold text-primary">Change Password</CardTitle>
          <CardDescription>Update your account password.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
              <FormField control={passwordForm.control} name="currentPassword" render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl><Input type="password" {...field} disabled={isChangingPassword} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={passwordForm.control} name="newPassword" render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl><Input type="password" {...field} disabled={isChangingPassword} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={passwordForm.control} name="confirmNewPassword" render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl><Input type="password" {...field} disabled={isChangingPassword} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" disabled={isChangingPassword} className="bg-orange-500 hover:bg-orange-600">
                {isChangingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
                Change Password
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};


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

      // Listen for local storage changes to authorName
      const handleAuthChange = () => {
        const updatedName = localStorage.getItem('authorName');
        if (updatedName) {
          setAuthorName(updatedName);
        }
      };
      window.addEventListener('authChange', handleAuthChange);
      return () => {
        window.removeEventListener('authChange', handleAuthChange);
      };

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
    
