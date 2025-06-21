
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function LoadingReviewerDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1 container mx-auto py-8 px-4 md:px-6 lg:px-8">
        {/* Sidebar Skeleton */}
        <aside className="w-full lg:w-64 self-start">
          <div className="mb-6 px-3 pt-3">
            <Skeleton className="h-6 w-1/3 mb-1" />
            <Skeleton className="h-4 w-1/2 mb-6" />
          </div>
          <div className="space-y-3 px-3 pb-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full bg-destructive/50" /> {/* Logout button skeleton */}
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <main className="flex-1 lg:ml-8 mt-8 lg:mt-0">
         <div className="space-y-6">
            <Card>
                <CardHeader>
                <Skeleton className="h-7 md:h-8 w-3/4 md:w-1/2 mb-2" />
                <Skeleton className="h-4 w-full md:w-3/4" />
                </CardHeader>
                <CardContent>
                <Skeleton className="h-5 w-5/6" />
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                    </CardHeader>
                    <CardContent>
                    <Skeleton className="h-7 w-12 mb-1" />
                    <Skeleton className="h-3 w-24" />
                    </CardContent>
                </Card>
                ))}
            </div>
            
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-28" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-4 w-full" />
                </CardContent>
            </Card>
            </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
