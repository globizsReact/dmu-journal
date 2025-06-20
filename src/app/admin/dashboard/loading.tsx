
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// This loading skeleton reflects the new AdminLayout structure
// It assumes AdminLayout itself shows a loading spinner for auth,
// and this skeleton is for the content *within* the AdminLayout.

export default function LoadingAdminDashboardPage() {
  return (
    // The sidebar skeleton would be part of the AdminLayout's loading or structure
    // This main section is for the content area next to the sidebar
    <div className="flex flex-col flex-1"> {/* Removed lg:flex-row as sidebar is handled by layout */}
      {/* Main Content Skeleton - Defaulting to overview or manuscript list view */}
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-1/2 md:w-1/3 mb-2" /> {/* Title Skeleton */}
          <Skeleton className="h-4 w-3/4 md:w-1/2" /> {/* Description Skeleton */}
        </CardHeader>
        <CardContent>
          {/* Skeleton for Overview Content */}
          <div className="space-y-2 mb-6">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
          </div>
          <div className="space-y-3 pl-4">
            {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-3/4" />
            ))}
          </div>
          <Skeleton className="h-6 w-2/5 mt-6" />
        </CardContent>
      </Card>
    </div>
  );
}
