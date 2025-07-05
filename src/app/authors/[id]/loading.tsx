
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function LoadingAuthorDetailPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Author Profile Card */}
          <aside className="w-full md:w-1/3 lg:w-1/4">
            <div className="bg-card p-6 rounded-lg shadow-sm text-center">
              <Skeleton className="h-32 w-32 rounded-full mb-4 mx-auto" />
              <Skeleton className="h-7 w-3/4 mb-2 mx-auto" />
              <Skeleton className="h-4 w-1/2 mb-4 mx-auto" />
              <Separator />
              <div className="flex justify-around mt-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="text-center">
                    <Skeleton className="h-7 w-8 mx-auto mb-1" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Manuscripts List */}
          <section className="w-full md:w-2/3 lg:w-3/4">
            <Skeleton className="h-8 w-1/2 mb-6" />
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-card p-4 rounded-lg shadow-sm">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-3" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-5/6 mb-4" />
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
