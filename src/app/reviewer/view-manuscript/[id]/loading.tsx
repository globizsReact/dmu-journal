
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export default function LoadingReviewerManuscriptDetailsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1 container mx-auto py-8 px-4 md:px-6 lg:px-8">
        <aside className="w-full lg:w-64 self-start">
            <div className="mb-6 px-3 pt-3">
                <Skeleton className="h-6 w-1/3 mb-1" />
                <Skeleton className="h-4 w-1/2 mb-6" />
            </div>
            <div className="space-y-3 px-3 pb-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
        </aside>
        <main className="flex-1 lg:ml-8 mt-8 lg:mt-0">
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                        <div className="flex-grow">
                            <Skeleton className="h-7 md:h-8 w-3/4 mb-1" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                        <Skeleton className="h-9 w-full sm:w-48 rounded-md" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="p-4 border rounded-md bg-muted/30">
                        <Skeleton className="h-6 w-24 mb-3" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="space-y-1">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-5 w-3/4" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <Separator />
                    <div>
                        <Skeleton className="h-6 w-28 mb-2" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                    <Separator />
                    <div className="pt-4">
                        <Skeleton className="h-5 w-20 mb-3" />
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Skeleton className="h-10 w-full sm:w-36" />
                            <Skeleton className="h-10 w-full sm:w-36" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </main>
      </div>
      <Footer />
    </div>
  );
}
