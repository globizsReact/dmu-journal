
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function LoadingAllJournalsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Skeleton for Hero Section */}
      <section className="relative h-[300px] md:h-[350px] bg-secondary">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <Skeleton className="h-10 md:h-12 w-1/3 mb-4 bg-muted/50" />
          <Skeleton className="h-4 md:h-5 w-full max-w-3xl bg-muted/50" />
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
            <div className="bg-card p-4 rounded-lg shadow">
              <Skeleton className="h-7 w-3/4 mb-3" />
              <Skeleton className="h-8 w-full mb-2" />
              <Separator className="mb-2"/>
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center p-2 rounded-md">
                    <Skeleton className="h-5 flex-grow mr-2" />
                    <Skeleton className="h-5 w-8" />
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Content Pane Skeleton */}
          <section className="w-full md:w-3/4 lg:w-4/5">
            <Skeleton className="h-8 md:h-9 w-1/2 mb-6" />
            {/* Alphabet Filter Skeleton */}
            <div className="flex flex-wrap gap-2 justify-center mb-8 p-4 bg-muted/10 rounded-lg">
                <Skeleton className="h-8 w-12" />
                {[...Array(26)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-8" />
                ))}
            </div>
            
            {[...Array(2)].map((group, gIdx) => (
                <div key={gIdx} className="mb-8">
                    <Skeleton className="h-8 w-10 mb-4 pb-2 border-b border-border" />
                    <ul className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <li key={i} className="flex items-center">
                                <Skeleton className="w-4 h-4 rounded-full mr-2" />
                                <Skeleton className="h-5 flex-1" />
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
