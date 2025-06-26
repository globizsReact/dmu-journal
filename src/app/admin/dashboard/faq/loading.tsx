import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';

export default function LoadingFaqManagementPage() {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-44" />
      </CardHeader>
      <CardContent className="space-y-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="p-4 border rounded-lg bg-muted/50 space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-1/3" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
            <div className="pl-4 space-y-3">
              {[...Array(3)].map((_, j) => (
                 <div key={j} className="flex justify-between items-center p-3 border rounded-md bg-card">
                    <Skeleton className="h-5 w-1/2" />
                    <div className="flex gap-2">
                        <Skeleton className="h-7 w-7" />
                        <Skeleton className="h-7 w-7" />
                    </div>
                 </div>
              ))}
            </div>
             <Skeleton className="h-9 w-32 ml-4" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
