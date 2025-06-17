import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingCategoryPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
          <Skeleton className="h-12 w-1/2 mx-auto mb-3" />
          <Skeleton className="h-6 w-3/4 mx-auto" />
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center mb-8 p-4 bg-muted/50 rounded-lg shadow">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-12" />
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-[200px] w-full rounded-xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
