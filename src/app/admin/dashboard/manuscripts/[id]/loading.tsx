
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function LoadingManuscriptDetailsPage() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-3/4 mb-1" /> {/* Manuscript Title */}
        <Skeleton className="h-4 w-1/2" /> {/* Submitted by... */}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Skeleton className="h-4 w-20" /> {/* Label: Journal */}
            <Skeleton className="h-5 w-3/4" /> {/* Value */}
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-20" /> {/* Label: Status */}
            <Skeleton className="h-5 w-1/2" /> {/* Value */}
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" /> {/* Label: Submitted At */}
            <Skeleton className="h-5 w-2/3" /> {/* Value */}
          </div>
           <div className="space-y-1">
            <Skeleton className="h-4 w-24" /> {/* Label: Special Review */}
            <Skeleton className="h-5 w-16" /> {/* Value */}
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

        {/* Authors Section */}
        <div>
            <Skeleton className="h-6 w-32 mb-3" /> {/* Co-Authors Title */}
            <div className="space-y-3">
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
            </div>
        </div>
        
        <Separator />
        
        {/* File Names Section */}
        <div>
            <Skeleton className="h-6 w-28 mb-3" /> {/* Files Title */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </div>

        <Separator />

        {/* Action Buttons Section */}
        <div className="flex justify-end space-x-3 pt-4">
          <Skeleton className="h-10 w-24" /> {/* Approve Button */}
          <Skeleton className="h-10 w-24" /> {/* Reject Button */}
        </div>
      </CardContent>
    </Card>
  );
}
