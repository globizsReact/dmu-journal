
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
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

type ActiveTab = 'author' | 'editor' | 'reviewer';

const LoginSchema = z.object({
  username: z.string().min(1, { message: 'Username is required.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof LoginSchema>;

export default function SubmitPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('author');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [logoSrc, setLogoSrc] = useState('/images/logo_black.png'); // Default to light theme logo

  useEffect(() => {
    const updateLogo = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setLogoSrc(isDarkMode ? '/images/logo.png' : '/images/logo_black.png');
    };

    updateLogo(); // Set initial logo based on current theme

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


  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const rememberMe = localStorage.getItem('rememberAuthorLogin') === 'true';
      const rememberedUsername = localStorage.getItem('rememberedUsername');
      if (rememberMe && rememberedUsername) {
        form.setValue('username', rememberedUsername);
        form.setValue('rememberMe', true);
      }
    }
  }, [form]);


  const onSubmitAuthor = async (values: LoginFormValues) => {
    setIsSubmitting(true);

    if (typeof window !== 'undefined') {
      localStorage.setItem('isAuthorLoggedIn', 'true');
      localStorage.setItem('authorName', values.username || 'Dr. Santosh Sharma'); 
      
      if (values.rememberMe && values.username) {
        localStorage.setItem('rememberAuthorLogin', 'true');
        localStorage.setItem('rememberedUsername', values.username);
      } else {
        localStorage.removeItem('rememberAuthorLogin');
        localStorage.removeItem('rememberedUsername');
      }
      window.dispatchEvent(new CustomEvent('authChange'));
    }

    toast({
      title: "Navigating to Dashboard",
      description: "You are being redirected.",
    });
    
    router.push('/author/dashboard');
    // setIsSubmitting(false); // No need if navigating away immediately
  };

  const TabButton = ({ tab, children }: { tab: ActiveTab; children: React.ReactNode }) => (
    <Button
      variant={activeTab === tab ? 'default' : 'ghost'}
      onClick={() => setActiveTab(tab)}
      className={`
        px-4 py-2 text-lg font-medium
        ${activeTab === tab ? 'text-primary-foreground' : 'text-foreground/80 hover:text-primary'}
        transition-colors
      `}
      disabled={isSubmitting && activeTab === 'author'}
    >
      {children}
    </Button>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-muted to-secondary/10">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center space-x-1 md:space-x-3 bg-muted p-1 rounded-lg">
            <TabButton tab="author">Author</TabButton>
            <Separator orientation="vertical" className="h-5 bg-border mx-1 md:mx-2" />
            <TabButton tab="editor">Editor</TabButton>
            <Separator orientation="vertical" className="h-5 bg-border mx-1 md:mx-2" />
            <TabButton tab="reviewer">Reviewer</TabButton>
          </div>
        </div>

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
            <CardTitle className="text-xl font-headline text-primary">Dhanamanjuri University</CardTitle>
            <p className="text-xs text-muted-foreground">JOURNAL - {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Portal</p>
          </CardHeader>
          <CardContent className="p-6">
            {activeTab === 'author' && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitAuthor)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your username" {...field} disabled={isSubmitting} />
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
                  <div className="flex items-center justify-between">
                    <FormField
                      control={form.control}
                      name="rememberMe"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                           <FormControl>
                            <Checkbox
                              id="remember-me"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <Label htmlFor="remember-me" className="text-sm font-normal text-foreground/80 -translate-y-0.5">
                            Remember me
                          </Label>
                        </FormItem>
                      )}
                    />
                    <Link href="#" className={`text-sm text-primary hover:underline ${isSubmitting ? 'pointer-events-none opacity-50' : ''}`}>
                      Forgot Password?
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#1A8A6D] hover:bg-[#166F57] text-primary-foreground"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className={`font-medium text-primary hover:underline ${isSubmitting ? 'pointer-events-none opacity-50' : ''}`}>
                      Sign Up
                    </Link>
                  </p>
                </form>
              </Form>
            )}
            {activeTab === 'editor' && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Editor login/registration is currently unavailable.</p>
                <p className="text-sm text-muted-foreground mt-2">Please check back later.</p>
              </div>
            )}
            {activeTab === 'reviewer' && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Reviewer login/registration is currently unavailable.</p>
                <p className="text-sm text-muted-foreground mt-2">Please check back later.</p>
              </div>
            )}
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
