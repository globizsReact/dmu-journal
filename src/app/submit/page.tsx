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
type FormMode = 'login' | 'signup';

const LoginSchema = z.object({
  username: z.string().min(1, { message: 'Username or email is required.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
  rememberMe: z.boolean().optional(),
});
type LoginFormValues = z.infer<typeof LoginSchema>;

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
  const [formMode, setFormMode] = useState<FormMode>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [underlineStyle, setUnderlineStyle] = useState({ width: 0, left: 0, opacity: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>(new Array(TABS_CONFIG.length).fill(null));
  const logoSrc = '/images/logo_black.png';

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (formMode === 'login' && typeof window !== 'undefined') {
      const rememberMe = localStorage.getItem('rememberAuthorLogin') === 'true';
      const rememberedUsername = localStorage.getItem('rememberedUsername');
      if (rememberMe && rememberedUsername) {
        loginForm.setValue('username', rememberedUsername);
        loginForm.setValue('rememberMe', true);
      }
    }
  }, [formMode, loginForm]);

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


  const onSubmitLogin = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('isAuthorLoggedIn', 'true');
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('authorName', data.user.fullName || 'User'); 
          localStorage.setItem('userRole', data.user.role || 'author');

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
          title: "Login Successful",
          description: "Redirecting to your dashboard...",
        });
        
        if (data.user.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (data.user.role === 'reviewer') {
          router.push('/reviewer/dashboard');
        } else {
          router.push('/author/dashboard');
        }
      } else {
        toast({
          title: "Login Failed",
          description: data.error || "An unknown error occurred.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Error",
        description: "Could not connect to the server. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitSignup = async (values: SignupFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: values.fullName,
          username: values.username,
          email: values.email,
          password: values.password,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Account Created Successfully!',
          description: 'You can now sign in with your new credentials.',
          variant: 'default',
        });
        setFormMode('login'); 
        signupForm.reset(); 
      } else {
        toast({
          title: 'Sign Up Failed',
          description: data.error || 'An unknown error occurred. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: 'Sign Up Error',
        description: 'Could not connect to the server. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderLoginForm = (tabType: ActiveTab) => (
    <>
      <h2 className="text-lg font-semibold text-center mb-4 text-foreground">Sign In to Your Account</h2>
      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(onSubmitLogin)} className="space-y-6">
          <FormField
            control={loginForm.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username or Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your username or email" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={loginForm.control}
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
              control={loginForm.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      id={`remember-me-${tabType}`}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <Label htmlFor={`remember-me-${tabType}`} className="text-sm font-normal text-foreground/80 -translate-y-0.5">
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
          {/* Only show Sign Up link for Author tab */}
          {activeTab === 'author' && (
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Button
                type="button"
                variant="link"
                onClick={() => setFormMode('signup')}
                className={`font-medium text-primary hover:underline p-0 h-auto ${isSubmitting ? 'pointer-events-none opacity-50' : ''}`}
                disabled={isSubmitting}
              >
                Sign Up
              </Button>
            </p>
          )}
        </form>
      </Form>
    </>
  );

  return (
    <div className="relative flex flex-col min-h-screen bg-background">
      <Image
        src="/images/login_bg.png"
        alt="Background"
        fill
        style={{
          objectFit: 'none',
          objectPosition: 'right bottom',
        }}
        className="absolute inset-0" 
        priority
      />
      <Header className="relative z-10" />
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 relative z-10">
        <div className="mb-8 text-center">
          <div className="relative inline-flex items-center p-1">
            {TABS_CONFIG.map((tabInfo, index) => (
              <TabButton
                key={tabInfo.key}
                ref={el => (tabRefs.current[index] = el)}
                isActive={activeTab === tabInfo.key}
                onClick={() => {
                  setActiveTab(tabInfo.key);
                  if (tabInfo.key === 'author') { // Keep signup mode for author tab if it was active
                    // setFormMode('login'); // Or default to login for author too when switching
                  } else {
                    setFormMode('login'); // Other tabs only support login
                  }
                }}
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
              <>
                {formMode === 'login' && renderLoginForm('author')}
                {formMode === 'signup' && (
                   <>
                    <h2 className="text-lg font-semibold text-center mb-4 text-foreground">Create Your Account</h2>
                    <Form {...signupForm}>
                      <form onSubmit={signupForm.handleSubmit(onSubmitSignup)} className="space-y-4">
                        <FormField
                          control={signupForm.control}
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
                          control={signupForm.control}
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
                          control={signupForm.control}
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
                          control={signupForm.control}
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
                          control={signupForm.control}
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
                          <Button
                            type="button"
                            variant="link"
                            onClick={() => setFormMode('login')}
                            className={`font-medium text-primary hover:underline p-0 h-auto ${isSubmitting ? 'pointer-events-none opacity-50' : ''}`}
                            disabled={isSubmitting}
                          >
                            Sign In
                          </Button>
                        </p>
                      </form>
                    </Form>
                   </>
                )}
              </>
            )}
            {activeTab === 'editor' && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Editor login/registration is currently unavailable.</p>
                <p className="text-sm text-muted-foreground mt-2">Please check back later.</p>
              </div>
            )}
            {activeTab === 'reviewer' && (
              <>
                {/* Reviewer tab only shows login form */}
                {renderLoginForm('reviewer')}
              </>
            )}
          </CardContent>
        </Card>

        <p className="mt-8 text-sm text-muted-foreground">
          2025 Academic Journal
        </p>
      </main>
      <Footer className="relative z-10" />
    </div>
  );
}
