
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function LoadingAuthorDashboardPage() {
  // For simplicity, this skeleton shows a combined view.
  // You can make this conditional based on a query param or route segment if needed.

  return (
    <div className="flex flex-col min-h-screen bg-muted">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1 container mx-auto py-8 px-4 md:px-6 lg:px-8">
        {/* Sidebar Skeleton */}
        <aside className="w-full lg:w-64 self-start">
          <div className="mb-6 px-3 pt-3">
            <Skeleton className="h-6 w-1/3 mb-1" />
            <Skeleton className="h-4 w-1/2 mb-6" />
          </div>
          <div className="space-y-3 px-3 pb-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full bg-destructive/50" /> {/* Logout button skeleton */}
          </div>
        </aside>

        {/* Main Content Skeleton - Stepper */}
        <main className="flex-1 lg:ml-8 mt-8 lg:mt-0">
          <Card className="w-full">
            <CardHeader>
              <Skeleton className="h-8 w-3/4 md:w-1/2 mx-auto mb-2" /> {/* Title: Submit New Manuscript */}
              {/* Step Indicators Skeleton */}
              <div className="flex justify-center space-x-2 md:space-x-4 my-6">
                <Skeleton className="h-10 md:h-12 w-1/3 md:w-1/4 rounded-md" /> {/* Step 1 (could be active) */}
                <Skeleton className="h-10 md:h-12 w-1/3 md:w-1/4 rounded-md bg-muted/50" /> {/* Step 2 */}
                <Skeleton className="h-10 md:h-12 w-1/3 md:w-1/4 rounded-md bg-muted/50" /> {/* Step 3 */}
              </div>
            </CardHeader>
            <CardContent>
              {/* Generic Skeleton for any active step's content */}
              {/* Example for Step 1 / Step 2 like fields */}
              {/* <Skeleton className="h-6 w-1/3 mb-4" /> 
              <div className="space-y-6">
                <div>
                  <Skeleton className="h-4 w-1/4 mb-2" /> 
                  <Skeleton className="h-10 w-full" />    
                </div>
                 <div className="flex items-center space-x-3 p-4 border rounded-md">
                  <Skeleton className="h-5 w-5" />        
                  <Skeleton className="h-4 w-1/3" />     
                </div>
                ... more fields ...
              </div> */}

              {/* More specific for Step 3: Upload Files */}
              <Skeleton className="h-6 w-1/3 mb-6" /> {/* Step 3 Title */}
              <div className="space-y-5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-border/30 pb-4">
                    <Skeleton className="h-5 w-1/4" /> {/* Label: Cover Letter, etc. */}
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-24" /> {/* Choose File button */}
                      <Skeleton className="h-5 w-32" /> {/* No File Chosen / filename */}
                    </div>
                  </div>
                ))}
                <Skeleton className="h-px w-full bg-border my-6" /> {/* Separator */}
                <div className="flex items-center justify-center space-x-3 p-4">
                  <Skeleton className="h-5 w-5" /> {/* Checkbox */}
                  <Skeleton className="h-4 w-3/4" /> {/* Checkbox Label */}
                </div>
              </div>


              {/* Navigation Buttons Skeleton */}
              <div className="mt-8 flex justify-between">
                <Skeleton className="h-10 w-24 rounded-md bg-muted/70" /> {/* Previous */}
                <Skeleton className="h-10 w-24 rounded-md" />             {/* Next / Finish */}
              </div>
               <Skeleton className="h-4 w-1/3 mx-auto mt-10" /> {/* 2025 Academic Journal */}
            </CardContent>
          </Card>
        </main>
      </div>
      <Footer />
    </div>
  );
}
