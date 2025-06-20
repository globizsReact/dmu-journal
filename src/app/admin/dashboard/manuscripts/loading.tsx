
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function LoadingAdminManuscriptsPage() {
  return (
    <Card className="w-full">
      <CardHeader>
        <Skeleton className="h-7 md:h-8 w-3/4 sm:w-1/2 mb-1" /> {/* Title: All Submitted Manuscripts */}
        <Skeleton className="h-4 w-full sm:w-2/3" /> {/* Description */}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]"><Skeleton className="h-5 w-3/4" /></TableHead>
                <TableHead><Skeleton className="h-5 w-32" /></TableHead>
                <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                <TableHead><Skeleton className="h-5 w-20" /></TableHead>
                <TableHead><Skeleton className="h-5 w-28" /></TableHead>
                <TableHead className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-full max-w-[230px]" /></TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-20 rounded-md" /> {/* Action button skeleton */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-2 py-4 mt-4">
            <Skeleton className="h-9 w-full sm:w-24 rounded-md" /> {/* Previous Button */}
            <Skeleton className="h-6 w-20 rounded-md" /> {/* Page info */}
            <Skeleton className="h-9 w-full sm:w-24 rounded-md" /> {/* Next Button */}
        </div>
      </CardContent>
    </Card>
  );
}
    
