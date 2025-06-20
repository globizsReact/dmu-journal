
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function LoadingAdminUsersPage() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
            <Skeleton className="h-8 w-1/2 md:w-1/3 mb-2" /> {/* Title: All Users */}
        </CardTitle>
        <CardDescription>
            <Skeleton className="h-4 w-3/4 md:w-1/2" /> {/* Description */}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading users...</p>
      </CardContent>
    </Card>
  );
}
