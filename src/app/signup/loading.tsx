
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingSignupPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-muted to-secondary/10">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-card shadow-xl rounded-lg p-6">
          <div className="flex flex-col items-center pt-2 pb-6">
            <Skeleton className="h-12 w-12 rounded-full mb-2" />
            <Skeleton className="h-6 w-48 mb-1" />
            <Skeleton className="h-3 w-32" />
          </div>
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
            <Skeleton className="h-10 w-full mt-2" />
            <Skeleton className="h-4 w-48 mx-auto pt-2" />
          </div>
        </div>

        <Skeleton className="h-4 w-32 mt-8" />
      </main>

      <Footer />
    </div>
  );
}
