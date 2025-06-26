
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function LoadingLandingPageEditor() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-1/3 mb-1" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border p-4 rounded-md space-y-4">
            <Skeleton className="h-6 w-28" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-20 w-full" />
            </div>
        </div>
         <div className="border p-4 rounded-md space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
        <div className="flex justify-end mt-8">
            <Skeleton className="h-10 w-28" />
        </div>
      </CardContent>
    </Card>
  );
}
