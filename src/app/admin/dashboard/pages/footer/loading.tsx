
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function LoadingFooterSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-1/3 mb-1" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-8">
        {[...Array(3)].map((_, sectionIndex) => (
          <fieldset key={sectionIndex} className="border p-4 rounded-md space-y-4">
            <Skeleton className="h-6 w-28" />
            {[...Array(2)].map((_, itemIndex) => (
              <div key={itemIndex} className="flex gap-4 items-end">
                <div className="flex-grow space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="flex-grow space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-9 w-9" />
              </div>
            ))}
            <Skeleton className="h-9 w-32" />
          </fieldset>
        ))}
         <fieldset className="border p-4 rounded-md space-y-4">
            <Skeleton className="h-6 w-28" />
             <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
            </div>
             <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
            </div>
         </fieldset>
        <div className="flex justify-end mt-8">
            <Skeleton className="h-10 w-28" />
        </div>
      </CardContent>
    </Card>
  );
}
