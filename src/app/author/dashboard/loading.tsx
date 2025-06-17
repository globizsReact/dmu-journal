
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function LoadingAuthorDashboardPage() {
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
              <Skeleton className="h-8 w-3/4 md:w-1/2 mx-auto mb-6" /> {/* Title: Submit New Manuscript */}
              {/* Stepper Skeleton */}
              <div className="flex items-start w-full mb-10 px-2 sm:px-4 md:px-8">
                {/* Step 1 Skeleton */}
                <div className="flex flex-col items-center text-center">
                  <Skeleton className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2" />
                  <Skeleton className="mt-2 h-4 w-20 md:w-28" />
                </div>
                {/* Line Skeleton */}
                <Skeleton className="flex-1 h-1 mt-[18px] md:mt-[22px]" />
                {/* Step 2 Skeleton */}
                <div className="flex flex-col items-center text-center">
                  <Skeleton className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2" />
                  <Skeleton className="mt-2 h-4 w-20 md:w-28" />
                </div>
                {/* Line Skeleton */}
                <Skeleton className="flex-1 h-1 mt-[18px] md:mt-[22px]" />
                {/* Step 3 Skeleton */}
                <div className="flex flex-col items-center text-center">
                  <Skeleton className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2" />
                  <Skeleton className="mt-2 h-4 w-20 md:w-28" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Generic Skeleton for active step's content (e.g., Step 1 shown) */}
              <Skeleton className="h-6 w-1/3 mb-4" /> 
              <div className="space-y-6">
                <div>
                  <Skeleton className="h-4 w-1/4 mb-2" /> 
                  <Skeleton className="h-10 w-full" />    
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-md">
                  <Skeleton className="h-5 w-5" />        
                  <Skeleton className="h-4 w-1/3" />     
                </div>
                 <div>
                  <Skeleton className="h-4 w-1/4 mb-2" /> 
                  <Skeleton className="h-24 w-full" /> {/* Textarea skeleton */}   
                </div>
                 <div>
                  <Skeleton className="h-4 w-1/4 mb-2" /> 
                  <Skeleton className="h-10 w-full" />    
                </div>
              </div>
              
              {/* Navigation Buttons Skeleton */}
              <div className="mt-8 flex justify-between">
                <Skeleton className="h-10 w-24 rounded-md bg-muted/70" /> {/* Previous (might be disabled) */}
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
