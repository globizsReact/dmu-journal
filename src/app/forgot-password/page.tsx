
'use client';

import { useState } from 'react';
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
import { Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const logoSrc = '/images/logo_black.png';

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    console.log('Mock Password Reset for email:', values.email);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Password Reset Link Sent (Mock)!',
        description: `If an account exists for ${values.email}, a reset link has been sent.`,
        variant: 'default',
      });
      setIsSubmitting(false);
      // Optionally redirect or clear form
      // router.push('/submit'); 
      form.reset();
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background bg-[url('/images/login_bg.png')] bg-no-repeat bg-right-bottom bg-fixed">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
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
              <CardTitle className="text-xl font-headline text-primary">Reset Your Password</CardTitle>
              <p className="text-xs text-muted-foreground">Dhanamanjuri University Journal Portal</p>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-6 text-center">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Enter your email" 
                          {...field} 
                          disabled={isSubmitting} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-[#1A8A6D] hover:bg-[#166F57] text-primary-foreground"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Link...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
                <div className="text-center pt-2">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => router.push('/submit')}
                    className={`text-primary hover:underline ${isSubmitting ? 'pointer-events-none opacity-50' : ''}`}
                    disabled={isSubmitting}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sign In
                  </Button>
                </div>
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
