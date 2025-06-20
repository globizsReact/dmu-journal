
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus, Search } from 'lucide-react';

export default function LoadingAdminUsersPage() {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <CardTitle><Skeleton className="h-8 w-32 mb-1" /></CardTitle> {/* All Users */}
                <CardDescription><Skeleton className="h-4 w-64" /></CardDescription> {/* Description */}
            </div>
            <Skeleton className="h-10 w-32 rounded-md flex items-center justify-center"> {/* Add User Button */}
                 <UserPlus className="mr-2 h-4 w-4 text-muted-foreground" /> 
                 <span className="text-muted-foreground">Add User</span>
            </Skeleton>
        </div>
        <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Skeleton className="h-10 pl-8 w-full md:w-1/2 lg:w-1/3 rounded-md" /> {/* Search Input */}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]"><Skeleton className="h-5 w-12" /></TableHead>
              <TableHead><Skeleton className="h-5 w-32" /></TableHead>
              <TableHead><Skeleton className="h-5 w-24" /></TableHead>
              <TableHead><Skeleton className="h-5 w-40" /></TableHead>
              <TableHead><Skeleton className="h-5 w-16" /></TableHead>
              <TableHead className="text-right w-[130px]"><Skeleton className="h-5 w-20 ml-auto" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-44" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                <TableCell className="text-right space-x-1">
                  <Skeleton className="h-7 w-7 inline-block rounded-md" />
                  <Skeleton className="h-7 w-7 inline-block rounded-md" />
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
    