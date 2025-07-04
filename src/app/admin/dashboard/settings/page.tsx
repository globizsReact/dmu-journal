
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Save, KeyRound, Camera } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toPublicUrl } from '@/lib/urlUtils';
import LoadingAdminSettingsPage from './loading';

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


export default function AdminSettingsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const { toast } = useToast();
    const [authToken, setAuthToken] = useState<string | null>(null);

    const [isUploading, setIsUploading] = useState(false);
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
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setAuthToken(token);
        if (token) {
            fetchAdminProfile(token);
        } else {
            setIsLoading(false);
            toast({ title: "Error", description: "Not authenticated.", variant: "destructive" });
        }
    }, [toast]);

    const fetchAdminProfile = async (token: string) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/profile', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Failed to fetch profile');
            const data = await response.json();
            profileForm.reset(data);
            if (data.avatarUrl) setImagePreview(data.avatarUrl);
        } catch (error: any) {
            toast({ title: "Error Fetching Profile", description: error.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
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
        profileForm.setValue('avatarUrl', '');
        setImagePreview(URL.createObjectURL(file));

        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await fetch('/api/admin/uploads/presigned-url', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${authToken}` },
                body: formData,
            });
            const { publicUrl, error } = await response.json();
            if (!response.ok) throw new Error(error || 'Failed to upload file.');
            profileForm.setValue('avatarUrl', publicUrl, { shouldValidate: true });
        } catch (error: any) {
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
            const response = await fetch('/api/admin/profile', {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            if (!response.ok) throw new Error((await response.json()).error || 'Failed to update profile');
            const updatedData = await response.json();
            toast({ title: "Profile Updated", description: "Your profile has been successfully updated." });
            profileForm.reset(updatedData);
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
            const response = await fetch('/api/admin/change-password', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword: values.currentPassword, newPassword: values.newPassword }),
            });
            if (!response.ok) throw new Error((await response.json()).error || 'Failed to change password');
            toast({ title: "Password Changed", description: "Your password has been successfully updated." });
            passwordForm.reset();
        } catch (error: any) {
            toast({ title: "Error Changing Password", description: error.message, variant: "destructive" });
        } finally {
            setIsChangingPassword(false);
        }
    };
    
    if (isLoading) return <LoadingAdminSettingsPage />;

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader><CardTitle>Profile Information</CardTitle><CardDescription>Update your personal details here.</CardDescription></CardHeader>
                <CardContent>
                    <Form {...profileForm}>
                        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-2 space-y-6">
                                    <FormField control={profileForm.control} name="fullName" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} disabled={isUpdatingProfile} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={profileForm.control} name="username" render={({ field }) => (<FormItem><FormLabel>Username</FormLabel><FormControl><Input {...field} disabled={isUpdatingProfile} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={profileForm.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" {...field} disabled={isUpdatingProfile} /></FormControl><FormMessage /></FormItem>)} />
                                </div>
                                <div className="md:col-span-1 flex justify-center md:justify-start">
                                    <FormField control={profileForm.control} name="avatarUrl" render={({ field }) => (
                                        <FormItem><FormLabel className="text-center md:text-left block w-full">Profile Picture</FormLabel>
                                            <FormControl><div className="relative w-32 h-32 group mt-2">
                                                <Avatar className="w-full h-full border-2 border-muted">
                                                    <AvatarImage src={toPublicUrl(imagePreview)} alt={profileForm.getValues('fullName') || 'Avatar Preview'} data-ai-hint="placeholder avatar" className="object-cover" />
                                                    <AvatarFallback className="text-4xl">{getInitials(profileForm.getValues('fullName'))}</AvatarFallback>
                                                </Avatar>
                                                <label htmlFor="avatar-upload" className="absolute bottom-1 right-1 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors shadow-md">
                                                    <Camera className="w-4 h-4" />
                                                    <span className="sr-only">Upload picture</span>
                                                </label>
                                                <Input id="avatar-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" disabled={isUploading || isUpdatingProfile} />
                                            </div></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                            </div>
                            <div className="flex justify-start pt-4 border-t"><Button type="submit" disabled={isUpdatingProfile || isUploading}>{(isUpdatingProfile || isUploading) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save Profile</Button></div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Change Password</CardTitle><CardDescription>Update your account password.</CardDescription></CardHeader>
                <CardContent>
                    <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                            <FormField control={passwordForm.control} name="currentPassword" render={({ field }) => (<FormItem><FormLabel>Current Password</FormLabel><FormControl><Input type="password" {...field} disabled={isChangingPassword} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={passwordForm.control} name="newPassword" render={({ field }) => (<FormItem><FormLabel>New Password</FormLabel><FormControl><Input type="password" {...field} disabled={isChangingPassword} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={passwordForm.control} name="confirmNewPassword" render={({ field }) => (<FormItem><FormLabel>Confirm New Password</FormLabel><FormControl><Input type="password" {...field} disabled={isChangingPassword} /></FormControl><FormMessage /></FormItem>)} />
                            <div className="flex justify-start pt-4 border-t"><Button type="submit" disabled={isChangingPassword}> {isChangingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}Change Password</Button></div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
