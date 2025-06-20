
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus } from 'lucide-react';

export default function LoadingAdminUsersPage() {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-grow">
                <Skeleton className="h-7 md:h-8 w-3/4 sm:w-1/2 mb-1" /> {/* Title: All Users */}
                <Skeleton className="h-4 w-full sm:w-2/3" /> {/* Description */}
            </div>
            <Skeleton className="h-10 w-full sm:w-32 rounded-md flex items-center justify-center"> {/* Add User Button */}
                 <UserPlus className="mr-2 h-4 w-4 text-muted-foreground" /> 
                 <span className="text-muted-foreground">Add User</span>
            </Skeleton>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]"><Skeleton className="h-5 w-12" /></TableHead>
                <TableHead><Skeleton className="h-5 w-32" /></TableHead>
                <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                <TableHead><Skeleton className="h-5 w-40" /></TableHead>
                <TableHead><Skeleton className="h-5 w-16" /></TableHead>
                <TableHead className="text-right w-[100px]"><Skeleton className="h-5 w-20 ml-auto" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                  <TableCell className="text-right space-x-1">
                    <Skeleton className="h-7 w-7 inline-block rounded-md" />
                    <Skeleton className="h-7 w-7 inline-block rounded-md" />
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
    
