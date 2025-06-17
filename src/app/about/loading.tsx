
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function LoadingAboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Skeleton for Hero Section */}
      <section className="relative h-[300px] md:h-[350px] bg-secondary">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <Skeleton className="h-10 md:h-12 w-1/2 mb-4 bg-muted/50" />
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 w-full">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-1/6 bg-muted/50" />
            ))}
          </div>
        </div>
      </section>

      {/* Skeleton for Sub-Navigation Bar */}
      <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 h-14 flex items-center justify-center">
          <div className="flex items-center space-x-6">
            <Skeleton className="h-5 w-20" />
            <Separator orientation="vertical" className="h-5 bg-border" />
            <Skeleton className="h-5 w-48" />
          </div>
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Left Sidebar Skeleton */}
          <aside className="w-full md:w-1/4 lg:w-1/5">
            <Skeleton className="h-7 w-2/3 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </aside>

          {/* Right Content Pane Skeleton */}
          <section className="w-full md:w-3/4 lg:w-4/5">
            <Skeleton className="h-9 md:h-10 w-1/3 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-5 w-full mb-2" />
              
              <div className="space-y-3 pl-2">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-start">
                        <Skeleton className="w-5 h-5 rounded-full mr-2 mt-1" />
                        <Skeleton className="h-5 flex-1" />
                    </div>
                ))}
              </div>
              
              <Skeleton className="h-5 w-full mt-2" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
