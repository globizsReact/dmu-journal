
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LoginSchema = z.object({
  username: z.string().min(1, { message: 'Username or email is required.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});
type LoginFormValues = z.infer<typeof LoginSchema>;

interface AdminLoginFormProps {
  onLoginSuccess: () => void;
}

export default function AdminLoginForm({ onLoginSuccess }: AdminLoginFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const logoSrc = '/images/logo_black.png';

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('authorName', data.user.fullName || 'Admin');
          localStorage.setItem('userRole', data.user.role);
          window.dispatchEvent(new CustomEvent('authChange')); // Notify layout
        }
        toast({
          title: "Admin Login Successful",
          description: "Welcome to the Admin Panel.",
        });
        onLoginSuccess(); // Callback to inform parent layout
      } else {
        toast({
          title: "Login Failed",
          description: data.error || "Invalid credentials or server error.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Admin login error:", error);
      toast({
        title: "Login Error",
        description: "Could not connect to the server. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md shadow-xl bg-card">
        <CardHeader className="flex flex-col items-center justify-center gap-3 pt-8 pb-6 text-center">
            <Image
              src={logoSrc}
              alt="DMU Journal Logo"
              width={60}
              height={60}
              className="rounded-full"
              data-ai-hint="university logo"
            />
            <CardTitle className="text-2xl font-headline text-primary">Admin Panel Login</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Dhanamanjuri University Journals
            </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username or Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your admin username or email" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In as Admin'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
       <p className="mt-8 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Dhanamanjuri University Journals. All rights reserved.
      </p>
    </div>
  );
}
