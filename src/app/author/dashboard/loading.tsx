
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingAuthorDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted">
      <Header />
      <div className="flex flex-1 container mx-auto py-8 px-4 md:px-6 lg:px-8">
        {/* Sidebar Skeleton */}
        <aside className="w-full lg:w-64 hidden lg:block p-6 self-start">
          <Skeleton className="h-6 w-1/3 mb-1" />
          <Skeleton className="h-4 w-1/2 mb-6" />
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full bg-destructive/50" /> {/* Logout button skeleton */}
          </div>
        </aside>

        {/* Main Content Skeleton - Default Dashboard View */}
        <main className="flex-1 lg:ml-8 mt-8 lg:mt-0">
          {/* Dashboard Title Skeleton removed from here */}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"> {/* Added mb-8 */}
            {[...Array(7)].map((_, i) => (
              <div key={i} className="bg-card p-3 rounded-lg shadow-sm"> {/* Reduced padding */}
                <Skeleton className="h-3 w-2/3 mb-2" /> {/* Reduced height for title */}
                <Skeleton className="h-8 w-1/3 mb-3" /> {/* Reduced height for value, adjusted margin */}
                <div className="flex justify-between items-center"> {/* Added items-center for better alignment */}
                  <Skeleton className="h-5 w-1/4" /> {/* Reduced height for View All */}
                  {/* Simulating the "Pay Now" button for one of the cards */}
                  {i === 3 && <Skeleton className="h-7 w-1/3" />} {/* Reduced height for Pay Now */}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Skeleton className="h-4 w-1/4 mx-auto" /> {/* 2025 Academic Journal */}
          </div>

          {/* Placeholder for other tab views (could be a generic card skeleton) */}
          {/* 
          <div className="mt-8 bg-card p-6 rounded-lg shadow-sm">
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-5/6" />
          </div>
          */}
        </main>
      </div>
      <Footer />
    </div>
  );
}
