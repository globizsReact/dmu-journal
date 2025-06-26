
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function LoadingNewJournalPage() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-1/3 mb-1" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-40 w-full" />
        </div>
        <div className="flex justify-end mt-8">
            <Skeleton className="h-10 w-28" />
        </div>
      </CardContent>
    </Card>
  );
}
