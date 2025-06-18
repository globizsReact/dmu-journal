
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function LoadingJournalPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <Header />

      {/* Skeleton for Hero Section */}
      <section className="relative py-16 md:py-20 bg-secondary">
        <div className="absolute inset-0 bg-primary/70 z-0"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <Skeleton className="h-6 w-1/2 md:w-1/3 mx-auto mb-2 bg-gray-400/50" /> {/* Journal Of Category Name */}
          <Skeleton className="h-10 md:h-12 w-full max-w-2xl mx-auto mb-3 bg-gray-300/50" /> {/* Article Title */}
          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-24 md:w-32 bg-gray-400/50" />
            ))}
          </div>
        </div>
      </section>

      {/* Skeleton for Sub-Navigation Bar */}
      <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 h-14">
          <div className="flex items-center justify-center h-full gap-2">
            {[...Array(6)].map((_, i) => (
              <React.Fragment key={i}>
                <Skeleton className="h-5 w-20 md:w-28" />
                {i < 5 && <Separator orientation="vertical" className="h-4 bg-border/70" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </nav>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="bg-card shadow-lg rounded-lg p-6 md:p-8">
          <Skeleton className="h-6 w-1/4 mb-6" /> {/* Article Type Badge */}

          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Sidebar - Stats */}
            <aside className="w-full md:w-1/5 lg:w-1/6 space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="text-center md:text-left">
                  <Skeleton className="h-3 w-12 mx-auto md:mx-0 mb-1" />
                  <Skeleton className="h-8 w-16 mx-auto md:mx-0" />
                </div>
              ))}
            </aside>

            {/* Right Main Content - Article Details */}
            <section className="w-full md:w-4/5 lg:w-5/6">
              <Skeleton className="h-8 w-3/4 mb-2" /> {/* Title */}
              <Skeleton className="h-4 w-1/3 mb-1" /> {/* Article Number */}
              <Skeleton className="h-5 w-1/2 mb-3" /> {/* Journal of Category */}
              
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="flex-grow space-y-1">
                  <Skeleton className="h-3 w-full" /> 
                  <Skeleton className="h-3 w-5/6" />
                </div>
                <div className="w-full sm:w-1/3 md:w-1/4 lg:w-1/5 flex-shrink-0 mt-4 sm:mt-0">
                  <Skeleton className="aspect-[4/3] w-full rounded-md" />
                  <Skeleton className="h-3 w-2/3 mx-auto mt-1" />
                </div>
              </div>
            </section>
          </div>

          {/* Action Bar */}
          <div className="my-8 py-3 bg-primary/10 rounded-md">
            <div className="container mx-auto px-2">
              <div className="flex flex-wrap items-center justify-center md:justify-around gap-x-3 gap-y-2">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-5 w-20 md:w-24 bg-primary/30" />
                ))}
              </div>
            </div>
          </div>

          {/* Abstract Section */}
          <div className="my-8">
            <Skeleton className="h-7 w-1/5 mb-3" /> {/* Abstract Heading */}
            <Separator className="mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="mt-6">
              <Skeleton className="h-4 w-1/3" /> {/* Keywords */}
            </div>
          </div>
          
          {/* Bottom "Tabs" and Copyright */}
          <div className="my-8 pt-6 border-t border-border">
            <div className="flex items-center space-x-4 mb-3">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        </div>
         <div className="mt-12 text-center">
            <Skeleton className="h-10 w-48 inline-block" /> {/* Back button */}
        </div>
      </main>
      <Footer />
    </div>
  );
}
