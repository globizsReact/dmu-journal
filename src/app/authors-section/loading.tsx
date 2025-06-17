
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingAuthorsSectionPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <Skeleton className="h-10 w-36 mb-8" />
        <Skeleton className="h-12 w-1/2 mb-6" />
        <div className="space-y-8">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <Skeleton className="h-8 w-1/3 mb-3" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-5/6" />
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
