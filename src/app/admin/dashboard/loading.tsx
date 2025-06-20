
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function LoadingAdminDashboardPage() {
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
            <Skeleton className="h-8 w-full bg-destructive/50" /> {/* Logout button skeleton */}
          </div>
        </aside>

        {/* Main Content Skeleton - Manuscript List */}
        <main className="flex-1 lg:ml-8 mt-8 lg:mt-0">
          <Card className="w-full">
            <CardHeader>
              <Skeleton className="h-8 w-1/2 md:w-1/3 mb-2" /> {/* Title: All Submitted Manuscripts */}
              <Skeleton className="h-4 w-3/4 md:w-1/2" /> {/* Description */}
            </CardHeader>
            <CardContent>
              {/* Table Skeleton */}
              <div className="space-y-2">
                {/* Table Header Row Skeleton */}
                <div className="flex p-2 bg-muted/50 rounded-t-md">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-5 w-1/4 ml-4" />
                  <Skeleton className="h-5 w-1/6 ml-4" />
                  <Skeleton className="h-5 w-1/6 ml-4" />
                  <Skeleton className="h-5 w-1/12 ml-4" />
                </div>
                {/* Table Body Rows Skeleton */}
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex p-3 border-b">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-5 w-1/4 ml-4" />
                    <Skeleton className="h-5 w-1/6 ml-4" />
                    <Skeleton className="h-5 w-1/6 ml-4" />
                    <Skeleton className="h-8 w-1/12 ml-4 rounded-md" /> {/* Button Skeleton */}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
      <Footer />
    </div>
  );
}
