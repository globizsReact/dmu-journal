
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from 'lucide-react';

export default function LoadingAdminManuscriptsPage() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle><Skeleton className="h-8 w-72 mb-1" /></CardTitle> {/* All Submitted Manuscripts */}
        <CardDescription><Skeleton className="h-4 w-80" /></CardDescription> {/* Description */}
        <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Skeleton className="h-10 pl-8 w-full md:w-1/2 lg:w-1/3 rounded-md" /> {/* Search Input */}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]"><Skeleton className="h-5 w-48" /></TableHead>
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
                  <Skeleton className="h-4 w-36 mb-1" />
                  <Skeleton className="h-3 w-28" />
                </TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-24 rounded-md" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
         {/* Pagination Controls Skeleton */}
        <div className="flex items-center justify-end space-x-2 py-4 mt-4">
            <Skeleton className="h-9 w-24 rounded-md" /> {/* Previous Button */}
            <Skeleton className="h-6 w-20 rounded-md" /> {/* Page info */}
            <Skeleton className="h-9 w-24 rounded-md" /> {/* Next Button */}
        </div>
      </CardContent>
    </Card>
  );
}
    