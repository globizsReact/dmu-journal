
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const SignupSchema = z
  .object({
    fullName: z
      .string()
      .min(3, { message: 'Full name must be at least 3 characters.' })
      .max(100, { message: 'Full name cannot exceed 100 characters.' }),
    username: z
      .string()
      .min(3, { message: 'Username must be at least 3 characters.' })
      .max(50, { message: 'Username cannot exceed 50 characters.' })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: 'Username can only contain letters, numbers, and underscores.',
      }),
    email: z.string().email({ message: 'Invalid email address.' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'], 
  });

type SignupFormValues = z.infer<typeof SignupSchema>;

export default function SignupPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [logoSrc, setLogoSrc] = useState('/images/logo.png'); // Default to light logo

  useEffect(() => {
    const updateLogo = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setLogoSrc(isDarkMode ? '/images/logo_black.png' : '/images/logo.png');
    };

    updateLogo(); // Set initial logo

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          updateLogo();
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setIsSubmitting(true);
    console.log('Mock Sign Up Attempt with values:', {
        fullName: values.fullName,
        username: values.username,
        email: values.email,
    });

    setTimeout(() => {
      toast({
        title: 'Account Created Successfully (Mock)!',
        description: 'You can now sign in with your new credentials.',
        variant: 'default',
      });
      router.push('/submit'); 
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-muted to-secondary/10">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md shadow-xl bg-card">
          <CardHeader className="flex flex-col items-center pt-8 pb-6">
            <Image
              src={logoSrc}
              alt="Dhanamanjuri University Logo"
              width={50}
              height={50}
              data-ai-hint="university logo"
              className="rounded-full mb-2"
            />
            <CardTitle className="text-xl font-headline text-primary">Create Your Account</CardTitle>
            <p className="text-xs text-muted-foreground">Dhanamanjuri University Journal Portal</p>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Choose a username" {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter your email" {...field} disabled={isSubmitting} />
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
                        <Input type="password" placeholder="Create a password" {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Confirm your password" {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-[#1A8A6D] hover:bg-[#166F57] text-primary-foreground mt-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Sign Up'
                  )}
                </Button>
                <p className="text-center text-sm text-muted-foreground pt-2">
                  Already have an account?{' '}
                  <Link href="/submit" className={`font-medium text-primary hover:underline ${isSubmitting ? 'pointer-events-none opacity-50' : ''}`}>
                    Sign In
                  </Link>
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>
        <p className="mt-8 text-sm text-muted-foreground">
          2025 Academic Journal
        </p>
      </main>
      <Footer />
    </div>
  );
}
