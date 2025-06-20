
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// This loading skeleton is for the Admin Dashboard Overview page.

export default function LoadingAdminDashboardPage() {
  return (
    <Card className="w-full">
      <CardHeader>
        <Skeleton className="h-8 w-1/2 md:w-1/3 mb-2" /> {/* Title Skeleton: Admin Dashboard Overview */}
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
  );
}
