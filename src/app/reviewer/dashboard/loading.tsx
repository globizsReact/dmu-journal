import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function LoadingReviewerDashboardPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-7 md:h-8 w-3/4 md:w-1/2 mb-2" /> {/* Title Skeleton: Reviewer Dashboard */}
          <Skeleton className="h-4 w-full md:w-3/4" /> {/* Description Skeleton */}
        </CardHeader>
        <CardContent>
          <Skeleton className="h-5 w-5/6" />
        </CardContent>
      </Card>

      {/* Skeleton for Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" /> {/* Stat Title */}
              <Skeleton className="h-5 w-5 rounded-full" /> {/* Icon */}
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-12 mb-1" /> {/* Stat Value */}
              <Skeleton className="h-3 w-24" /> {/* Stat Description */}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
            <Skeleton className="h-6 w-28" /> {/* Your Tasks Title */}
        </CardHeader>
        <CardContent>
            <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
