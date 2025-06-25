
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function LoadingEditManuscriptPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4 md:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/2 mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent className="flex justify-center items-center py-20">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="ml-4 space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
