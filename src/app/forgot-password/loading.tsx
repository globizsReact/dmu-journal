
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingForgotPasswordPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-card shadow-xl rounded-lg p-6">
          <div className="flex flex-row items-center justify-center gap-3 pt-2 pb-6">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="text-left">
                <Skeleton className="h-6 w-48 mb-1" />
                <Skeleton className="h-3 w-32" />
            </div>
          </div>
           <Skeleton className="h-4 w-full mb-6" /> {/* Subtitle text */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full mt-2" />
            <Skeleton className="h-8 w-40 mx-auto pt-2" /> {/* Back to sign in button */}
          </div>
        </div>

        <Skeleton className="h-4 w-32 mt-8" />
      </main>

      <Footer />
    </div>
  );
}
