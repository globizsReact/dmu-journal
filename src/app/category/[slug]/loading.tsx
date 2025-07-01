
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingCategoryPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Skeleton for Hero/Title Section */}
      <section className="py-10 md:py-16 bg-secondary">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <Skeleton className="h-6 w-1/4 mb-2" />
          <Skeleton className="h-10 md:h-12 w-3/4 md:w-1/2 mb-4" />
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-20" />
            ))}
          </div>
        </div>
      </section>

      {/* Skeleton for Sub-Navigation Bar */}
      <nav className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center py-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-24" />
            ))}
          </div>
        </div>
      </nav>
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        {/* Skeleton for Scope Section */}
        <section className="my-12">
          <Skeleton className="h-8 w-2/5 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6 mb-4" />
        </section>

        {/* Skeleton for ViewFilters */}
        <div className="flex flex-wrap gap-3 items-center mb-8">
            <Skeleton className="h-6 w-12 mr-2" />
            {[...Array(3)].map((_, i) => (
                 <Skeleton key={i} className="h-9 w-24" />
            ))}
        </div>
        
        {/* Skeleton for Article List */}
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col md:flex-row items-start gap-6 p-6 border border-border rounded-lg shadow-sm bg-card">
              <div className="w-full md:w-1/4 lg:w-1/5 flex-shrink-0">
                <Skeleton className="aspect-[4/3] w-full rounded-md" />
              </div>
              <div className="flex-grow space-y-3">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
