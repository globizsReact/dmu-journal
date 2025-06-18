
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function LoadingSubmitPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center space-x-3">
            <Skeleton className="h-6 w-16" />
            <Separator orientation="vertical" className="h-5 bg-border" />
            <Skeleton className="h-6 w-12" />
            <Separator orientation="vertical" className="h-5 bg-border" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>

        <div className="w-full max-w-md bg-card shadow-xl rounded-lg p-6">
          <div className="flex flex-col items-center pt-2 pb-6">
            <Skeleton className="h-12 w-12 rounded-full mb-2" />
            <Skeleton className="h-6 w-48 mb-1" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>
        </div>

        <Skeleton className="h-4 w-32 mt-8" />
      </main>

      <Footer />
    </div>
  );
}
