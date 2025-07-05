
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingAuthorsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-10">
          <Skeleton className="h-10 w-2/3 mx-auto mb-4" />
          <Skeleton className="h-5 w-1/2 mx-auto" />
        </div>
        <div className="max-w-xl mx-auto mb-10">
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-card p-4 rounded-lg shadow-sm flex flex-col items-center text-center">
              <Skeleton className="h-24 w-24 rounded-full mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3 mt-1" />
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
