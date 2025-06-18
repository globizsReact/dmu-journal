
'use client';

import React, { useState, useEffect, useRef } from 'react'; 
import { useRouter } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button'; 
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
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
import { cn } from '@/lib/utils'; 

type ActiveTab = 'author' | 'editor' | 'reviewer';

const LoginSchema = z.object({
  username: z.string().min(1, { message: 'Username is required.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof LoginSchema>;

const TABS_CONFIG = [
  { key: 'author' as ActiveTab, label: 'Author' },
  { key: 'editor' as ActiveTab, label: 'Editor' },
  { key: 'reviewer' as ActiveTab, label: 'Reviewer' },
];

interface TabButtonProps {
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const TabButton = React.forwardRef<HTMLButtonElement, TabButtonProps>(
  ({ children, isActive, onClick, disabled }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-background rounded-t-sm",
          isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
        )}
        role="tab"
        aria-selected={isActive}
      >
        {children}
      </button>
    );
  }
);
TabButton.displayName = 'TabButton';

export default function SubmitPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('author');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [underlineStyle, setUnderlineStyle] = useState({ width: 0, left: 0, opacity: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>(new Array(TABS_CONFIG.length).fill(null));
  const [logoSrc, setLogoSrc] = useState('/images/logo_black.png'); // Default to light theme logo

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

  useEffect(() => {
    const activeTabIndex = TABS_CONFIG.findIndex(t => t.key === activeTab);
    const currentTabElement = tabRefs.current[activeTabIndex];

    if (currentTabElement) {
      const timeoutId = setTimeout(() => {
        const currentEl = tabRefs.current[TABS_CONFIG.findIndex(t => t.key === activeTab)];
        if (currentEl) {
          setUnderlineStyle({
            width: currentEl.offsetWidth,
            left: currentEl.offsetLeft,
            opacity: 1,
          });
        }
      }, 0); 
      return () => clearTimeout(timeoutId);
    } else {
      setUnderlineStyle({ width: 0, left: 0, opacity: 0 });
    }
  }, [activeTab]); 


  const onSubmitAuthor = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('isAuthorLoggedIn', 'true');
      localStorage.setItem('authorName', values.username || 'Dr. Santosh Sharma'); // Use entered username or fallback
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
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-muted to-secondary/10">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <div className="mb-8 text-center">
          <div className="relative inline-flex items-center p-1">
            {TABS_CONFIG.map((tabInfo, index) => (
              <TabButton
                key={tabInfo.key}
                ref={el => (tabRefs.current[index] = el)}
                isActive={activeTab === tabInfo.key}
                onClick={() => setActiveTab(tabInfo.key)}
                disabled={isSubmitting}
              >
                {tabInfo.label}
              </TabButton>
            ))}
            <div
              className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-in-out"
              style={{
                width: `${underlineStyle.width}px`,
                left: `${underlineStyle.left}px`,
                opacity: underlineStyle.opacity,
              }}
            />
          </div>
        </div>

        <Card className="w-full max-w-md shadow-xl bg-card">
           <CardHeader className="flex flex-row items-center justify-center gap-3 pt-8 pb-6">
            <Image
              src={logoSrc}
              alt="Dhanamanjuri University Logo"
              width={50}
              height={50}
              data-ai-hint="university logo"
              className="rounded-full"
            />
            <div className="text-left">
              <CardTitle className="text-xl font-headline text-primary">Dhanamanjuri University</CardTitle>
              <p className="text-xs text-muted-foreground">JOURNAL - {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Portal</p>
            </div>
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
                    <Link href="/forgot-password" className={`text-sm text-primary hover:underline ${isSubmitting ? 'pointer-events-none opacity-50' : ''}`}>
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
