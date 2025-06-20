
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function LoadingManuscriptDetailsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
            <div className="flex-grow">
                <Skeleton className="h-7 md:h-8 w-3/4 mb-1" /> {/* Manuscript Title */}
                <Skeleton className="h-4 w-1/2" /> {/* Submitted by... */}
            </div>
            <Skeleton className="h-9 w-full sm:w-32 rounded-md" /> {/* Back to List Button */}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Info Section */}
        <div className="p-4 border rounded-md bg-muted/30">
            <Skeleton className="h-6 w-24 mb-3" /> {/* Overview Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-1">
                    <Skeleton className="h-4 w-20" /> {/* Label */}
                    <Skeleton className="h-5 w-3/4" /> {/* Value */}
                </div>
            ))}
            </div>
        </div>

        <Separator />

        {/* Abstract Section */}
        <div>
          <Skeleton className="h-6 w-28 mb-2" /> {/* Abstract Title */}
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Keywords Section */}
        <div>
          <Skeleton className="h-5 w-24 mb-2" /> {/* Keywords Title */}
          <Skeleton className="h-4 w-3/4" />
        </div>
        
        <Separator />

        {/* Co-Authors Section */}
        <div>
            <Skeleton className="h-6 w-32 mb-3" /> {/* Co-Authors Title */}
            <div className="space-y-3">
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
            </div>
        </div>
        
        <Separator />
        
        {/* File Names Section - Simplified for skeleton */}
        <div>
            <Skeleton className="h-6 w-28 mb-3" /> {/* Files Title */}
        </div>

        <Separator />

        {/* Action Buttons Section */}
        <div className="pt-4">
            <Skeleton className="h-5 w-20 mb-3" /> {/* Actions Title */}
            <div className="flex flex-col sm:flex-row gap-3">
                <Skeleton className="h-10 w-full sm:w-36" /> {/* Approve Button */}
                <Skeleton className="h-10 w-full sm:w-36" /> {/* Reject Button */}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
