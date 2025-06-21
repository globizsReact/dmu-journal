
'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

// A passthrough layout to enforce authentication for all /reviewer/* routes
// without adding its own visual elements like a sidebar.
// Individual pages under /reviewer are responsible for their own layout (e.g. Header, Footer, Sidebar).
export default function ReviewerLayout({ children }: { children: ReactNode }) {
  const [isVerifying, setIsVerifying] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');

    if (token && role === 'reviewer') {
      setIsVerifying(false);
    } else {
      router.replace('/submit');
    }
  }, [router]);

  if (isVerifying) {
    return (
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 flex items-center justify-center bg-muted">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-lg">Verifying reviewer session...</p>
          </main>
          <Footer />
        </div>
    );
  }

  return <>{children}</>;
}
