
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookIcon } from 'lucide-react';

export default function LoadingAdminJournalsPage() {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-grow">
                <Skeleton className="h-7 md:h-8 w-3/4 sm:w-1/2 mb-1" /> {/* Title: Journal Categories */}
                <Skeleton className="h-4 w-full sm:w-2/3" /> {/* Description */}
            </div>
            <Skeleton className="h-10 w-full sm:w-44 rounded-md flex items-center justify-center"> {/* Add Category Button */}
                 <BookIcon className="mr-2 h-4 w-4 text-muted-foreground" /> 
                 <span className="text-muted-foreground">Add New Category</span>
            </Skeleton>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]"><Skeleton className="h-5 w-3/4" /></TableHead>
                <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                <TableHead><Skeleton className="h-5 w-20" /></TableHead>
                <TableHead><Skeleton className="h-5 w-32" /></TableHead>
                <TableHead className="text-right w-[100px]"><Skeleton className="h-5 w-20 ml-auto" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(4)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-full max-w-[280px]" />
                    <Skeleton className="h-3 w-4/5 mt-2" />
                  </TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell className="text-right space-x-1">
                    <Skeleton className="h-7 w-7 inline-block rounded-md" />
                    <Skeleton className="h-7 w-7 inline-block rounded-md" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
