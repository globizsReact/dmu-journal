
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import DashboardSidebar from '@/components/author/DashboardSidebar';
import DashboardStatCard from '@/components/author/DashboardStatCard';
import type { DashboardStatCardProps } from '@/components/author/DashboardStatCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SubmitManuscriptStepper from '@/components/author/SubmitManuscriptStepper'; 
import { useToast } from '@/hooks/use-toast';
import type { Manuscript, JournalCategory } from '@prisma/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Eye, Loader2, Save, KeyRound, FilePlus, FileClock, FileCheck2, IndianRupee, BookUp, FileX2, HelpCircle, MoreVertical, Pencil, Trash2, Undo2, FileUp, CheckCircle, AlertTriangle, Camera } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteManuscriptDialog from '@/components/author/dialogs/DeleteManuscriptDialog';
import Image from 'next/image';
import { toPublicUrl } from '@/lib/urlUtils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const MyManuscriptView = () => {
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [journalCategories, setJournalCategories] = useState<JournalCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [deletingManuscript, setDeletingManuscript] = useState<Manuscript | null>(null);
  const [updatingManuscriptId, setUpdatingManuscriptId] = useState<string | null>(null);


  const fetchManuscripts = useCallback(async (token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/author/manuscripts', {
        headers: { 'Authorization': `Bearer ${token}` },
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
  }, [toast]);

  useEffect(() => {
    const fetchInitialData = async () => {
      const token = localStorage.getItem('authToken');
      setAuthToken(token);
       if (token) {
        fetchManuscripts(token);
      } else {
        setIsLoading(false);
      }

      try {
        const res = await fetch('/api/public/journal-categories');
        if (!res.ok) throw new Error("Could not fetch categories");
        const data = await res.json();
        setJournalCategories(data);
      } catch (e) {
          console.error(e);
          toast({ title: 'Error', description: 'Could not load journal categories.', variant: 'destructive' });
      } finally {
        setIsLoadingCategories(false);
      }
    }

    if (typeof window !== 'undefined') {
      fetchInitialData();
    }
  }, [toast, fetchManuscripts]);
  
  const handleDeleteSuccess = () => {
    if (authToken) {
      fetchManuscripts(authToken);
      toast({ title: "Success", description: "Manuscript deleted successfully." });
    }
  };
  
  const handleUnpublish = async (manuscript: Manuscript) => {
    if (!authToken) return;
    setUpdatingManuscriptId(manuscript.id);
    try {
      const response = await fetch(`/api/author/manuscripts/${manuscript.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ status: 'Suspended' }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to unpublish manuscript.');

      toast({ title: "Success", description: "Manuscript has been unpublished and is now suspended." });
      if (authToken) fetchManuscripts(authToken);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setUpdatingManuscriptId(null);
    }
  };


  const getJournalName = (journalId: string) => {
    if (isLoadingCategories) return '...';
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
    <>
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl font-headline font-bold text-primary">My Manuscripts</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Article</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Downloads</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {manuscripts.map((manuscript) => (
                <TableRow key={manuscript.id}>
                   <TableCell className="font-medium">
                      {manuscript.articleTitle}
                      <span className="block text-xs text-muted-foreground mt-1">
                          {getJournalName(manuscript.journalCategoryId)}
                      </span>
                  </TableCell>
                  <TableCell>
                      <span 
                          className={cn('px-2 py-1 text-xs font-semibold rounded-full', {
                            'bg-blue-100 text-blue-700': manuscript.status === 'Submitted',
                            'bg-yellow-100 text-yellow-700': manuscript.status === 'In Review',
                            'bg-green-100 text-green-700': manuscript.status === 'Accepted',
                            'bg-emerald-100 text-emerald-700': manuscript.status === 'Published',
                            'bg-orange-100 text-orange-700': manuscript.status === 'Suspended',
                            'bg-red-100 text-red-700': manuscript.status === 'Rejected',
                            'bg-gray-100 text-gray-700': !['Submitted', 'In Review', 'Accepted', 'Published', 'Suspended', 'Rejected'].includes(manuscript.status)
                          })}
                      >
                          {manuscript.status}
                      </span>
                  </TableCell>
                  <TableCell>
                     {format(new Date(manuscript.submittedAt), 'dd MMM yyyy')}
                  </TableCell>
                  <TableCell>{manuscript.views ?? 0}</TableCell>
                  <TableCell>{manuscript.downloads ?? 0}</TableCell>
                   <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={updatingManuscriptId === manuscript.id}>
                          {updatingManuscriptId === manuscript.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link href={`/author/view-manuscript/${manuscript.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          asChild
                          disabled={manuscript.status === 'Published'}
                          className="cursor-pointer"
                        >
                          <Link href={`/author/edit-manuscript/${manuscript.id}`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </Link>
                        </DropdownMenuItem>
                        {manuscript.status === 'Published' && (
                          <DropdownMenuItem onClick={() => handleUnpublish(manuscript)} className="cursor-pointer">
                            <Undo2 className="mr-2 h-4 w-4" />
                            <span>Unpublish</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeletingManuscript(manuscript)}
                          className="text-destructive focus:text-destructive cursor-pointer"
                          disabled={manuscript.status === 'Published'}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
     {deletingManuscript && (
        <DeleteManuscriptDialog
          manuscript={deletingManuscript}
          isOpen={!!deletingManuscript}
          onClose={() => setDeletingManuscript(null)}
          onSuccess={handleDeleteSuccess}
          authToken={authToken || ''}
        />
      )}
    </>
  );
};

const MAX_AVATAR_SIZE_MB = 2;
const MAX_AVATAR_SIZE_BYTES = MAX_AVATAR_SIZE_MB * 1024 * 1024;

const profileFormSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters.').max(100),
  username: z.string().min(3, 'Username must be at least 3 characters.').max(50)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores.'),
  email: z.string().email('Invalid email address.'),
  avatarUrl: z.string().url().optional().or(z.literal('')),
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

  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { fullName: '', username: '', email: '', avatarUrl: '' },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
  });
  
  const getInitials = (name: string) => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

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
      if (data.avatarUrl) {
        setImagePreview(data.avatarUrl);
      }
      if (typeof window !== 'undefined' && data.fullName) {
        localStorage.setItem('authorName', data.fullName);
        localStorage.setItem('avatarUrl', data.avatarUrl || '');
        window.dispatchEvent(new CustomEvent('authChange')); 
      }
    } catch (error: any) {
      toast({ title: "Error Fetching Profile", description: error.message, variant: "destructive" });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !authToken) return;

    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      toast({ title: "File Too Large", description: `Profile picture must be less than ${MAX_AVATAR_SIZE_MB}MB.`, variant: "destructive" });
      return;
    }

    setIsUploading(true);
    setUploadSuccess(false);
    setUploadError(null);
    setFileName(file.name);
    profileForm.setValue('avatarUrl', '');
    setImagePreview(URL.createObjectURL(file));

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
      profileForm.setValue('avatarUrl', publicUrl, { shouldValidate: true });
      setUploadSuccess(true);
    } catch (error: any) {
      setUploadError(error.message);
      toast({ title: 'Upload Failed', description: error.message, variant: 'destructive' });
      setImagePreview(profileForm.getValues('avatarUrl'));
    } finally {
      setIsUploading(false);
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
       if (typeof window !== 'undefined') {
        localStorage.setItem('authorName', updatedData.fullName || '');
        localStorage.setItem('avatarUrl', updatedData.avatarUrl || '');
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
                
                <FormField
                  control={profileForm.control}
                  name="avatarUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Picture</FormLabel>
                      <FormControl>
                        <div className="relative w-32 h-32 group">
                          <Avatar className="w-full h-full border-2 border-muted">
                            <AvatarImage src={toPublicUrl(imagePreview)} alt={profileForm.getValues('fullName') || 'Avatar Preview'} data-ai-hint="placeholder avatar" />
                            <AvatarFallback className="text-4xl">
                              {getInitials(profileForm.getValues('fullName'))}
                            </AvatarFallback>
                          </Avatar>
                          <label
                            htmlFor="avatar-upload"
                            className="absolute bottom-1 right-1 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors shadow-md"
                          >
                            <Camera className="w-4 h-4" />
                            <span className="sr-only">Upload picture</span>
                          </label>
                          <Input
                            id="avatar-upload"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            accept="image/png, image/jpeg, image/webp"
                            disabled={isUploading || isUpdatingProfile}
                          />
                        </div>
                      </FormControl>
                      {fileName && (
                        <div className="mt-2 text-sm flex items-center gap-2 text-muted-foreground">
                          {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                          {uploadSuccess && <CheckCircle className="w-4 h-4 text-green-500" />}
                          {uploadError && <AlertTriangle className="w-4 h-4 text-destructive" />}
                          <span className="truncate">{fileName}</span>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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

              <Button type="submit" disabled={isUpdatingProfile || isUploading} className="bg-green-600 hover:bg-green-700">
                {(isUpdatingProfile || isUploading) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
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
  const [authorAvatar, setAuthorAvatar] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const router = useRouter();
  const { toast } = useToast();
  const [authToken, setAuthToken] = useState<string | null>(null);
  
  const [stats, setStats] = useState<{
    submitted: number;
    inReview: number;
    accepted: number;
    published: number;
    suspended: number;
  } | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isAuthorLoggedIn') === 'true';
      const storedName = localStorage.getItem('authorName');
      const token = localStorage.getItem('authToken');
      const avatar = localStorage.getItem('avatarUrl');
      setAuthToken(token);
      setAuthorAvatar(avatar);
      
      if (!isLoggedIn) {
        router.push('/submit'); 
      } else if (storedName) {
        setAuthorName(storedName);
      } else {
        setAuthorName("Author"); 
      }
      
      if (token) {
        fetchAuthorStats(token);
      } else {
        setIsLoadingStats(false);
      }

      const handleAuthChange = () => {
        const updatedName = localStorage.getItem('authorName');
        const updatedAvatar = localStorage.getItem('avatarUrl');
        if (updatedName) {
          setAuthorName(updatedName);
        }
        setAuthorAvatar(updatedAvatar);
      };
      window.addEventListener('authChange', handleAuthChange);
      return () => {
        window.removeEventListener('authChange', handleAuthChange);
      };
    }
  }, [router]);

  const fetchAuthorStats = async (token: string) => {
    setIsLoadingStats(true);
    try {
        const response = await fetch('/api/author/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch stats');
        }
        const data = await response.json();
        setStats(data);
    } catch (error: any) {
        console.error("Error fetching stats:", error);
        toast({
          title: "Could Not Load Stats",
          description: error.message,
          variant: "destructive"
        })
    } finally {
        setIsLoadingStats(false);
    }
  };

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

  const dashboardItems: (DashboardStatCardProps & { key: string })[] = [
    { key: 'submitted', title: 'New Submissions', value: isLoadingStats ? '...' : (stats?.submitted ?? 0).toString(), icon: FilePlus, description: "Manuscripts you've submitted.", colorClass: "text-blue-500" },
    { key: 'inReview', title: 'Manuscripts In Review', value: isLoadingStats ? '...' : (stats?.inReview ?? 0).toString(), icon: FileClock, description: "Currently under peer review.", colorClass: "text-orange-500" },
    { key: 'accepted', title: 'Accepted Manuscripts', value: isLoadingStats ? '...' : (stats?.accepted ?? 0).toString(), icon: FileCheck2, description: "Approved for publication.", colorClass: "text-green-500" },
    { key: 'published', title: 'Published Manuscripts', value: isLoadingStats ? '...' : (stats?.published ?? 0).toString(), icon: BookUp, description: "Officially published articles.", colorClass: "text-emerald-600" },
    { key: 'suspended', title: 'Suspended Manuscripts', value: isLoadingStats ? '...' : (stats?.suspended ?? 0).toString(), icon: FileX2, description: "Submissions needing attention.", colorClass: "text-yellow-600" },
    { key: 'waiver', title: 'Waiver Requests', value: '0', icon: HelpCircle, description: "Requests for fee waivers.", colorClass: "text-pink-500" },
    { 
      key: 'payments',
      title: 'Payments Due', 
      value: '₹0.00', 
      icon: IndianRupee,
      description: "Outstanding publication fees.",
      colorClass: "text-purple-500",
      actionButton: { text: 'Pay Now', href: '#'} 
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-muted">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1 container mx-auto py-8 px-4 md:px-6 lg:px-8">
        <DashboardSidebar 
          authorName={authorName} 
          avatarUrl={authorAvatar}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <main className="flex-1 lg:ml-8 mt-8 lg:mt-0">
          {activeTab === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {dashboardItems.map((item) => (
                  <DashboardStatCard
                    key={item.key}
                    title={item.title}
                    value={item.value}
                    icon={item.icon}
                    description={item.description}
                    colorClass={item.colorClass}
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
