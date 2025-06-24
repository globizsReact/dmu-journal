
'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { useToast } from '@/hooks/use-toast';

export default function AuthorLayout({ children }: { children: ReactNode }) {
  const [isVerifying, setIsVerifying] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('authToken');
      const role = localStorage.getItem('userRole');

      if (!token || role !== 'author') {
        router.replace('/submit');
        return;
      }

      try {
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user.role === 'author') {
            setIsVerifying(false);
          } else {
            throw new Error('Mismatched role');
          }
        } else {
          throw new Error('Session invalid');
        }
      } catch (error) {
        // Clear local storage and redirect
        localStorage.removeItem('isAuthorLoggedIn');
        localStorage.removeItem('authToken');
        localStorage.removeItem('authorName');
        localStorage.removeItem('userRole');
        localStorage.removeItem('rememberAuthorLogin');
        localStorage.removeItem('rememberedUsername');
        window.dispatchEvent(new CustomEvent('authChange'));
        toast({
          title: 'Session Expired',
          description: 'Please log in again.',
          variant: 'destructive',
        });
        router.replace('/submit');
      }
    };
    
    verifySession();
  }, [router, toast]);

  if (isVerifying) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-muted">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg">Verifying author session...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return <>{children}</>;
}
