
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function LoadingAuthorDashboardPage() {
  // This loading state now assumes step 1 or step 2 could be active based on some logic,
  // or defaults to showing step 1. For a more accurate skeleton, you might need logic here
  // or multiple loading files if routes were /author/dashboard/submit/step/1 etc.
  // For simplicity, we'll show a generic stepper skeleton that covers the idea.

  const showStep1Skeleton = true; // Default to showing Step 1 skeleton for now
  const showStep2Skeleton = false; // Change this to true if you want to test step 2 skeleton

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
                <Skeleton className="h-10 md:h-12 w-1/3 md:w-1/4 rounded-md" /> {/* Step 1 Active */}
                <Skeleton className="h-10 md:h-12 w-1/3 md:w-1/4 rounded-md bg-muted/50" /> {/* Step 2 */}
                <Skeleton className="h-10 md:h-12 w-1/3 md:w-1/4 rounded-md bg-muted/50" /> {/* Step 3 */}
              </div>
            </CardHeader>
            <CardContent>
              {/* Conditional Skeleton for Steps */}
              {showStep1Skeleton && !showStep2Skeleton && (
                <>
                  <Skeleton className="h-6 w-1/3 mb-4" /> {/* Step 1 title */}
                  <div className="space-y-6">
                    <div>
                      <Skeleton className="h-4 w-1/4 mb-2" /> {/* Label */}
                      <Skeleton className="h-10 w-full" />    {/* Input/Select */}
                    </div>
                    <div className="flex items-center space-x-3 p-4 border rounded-md">
                      <Skeleton className="h-5 w-5" />        {/* Checkbox */}
                      <Skeleton className="h-4 w-1/3" />      {/* Checkbox Label */}
                    </div>
                    <div>
                      <Skeleton className="h-4 w-1/4 mb-2" /> {/* Label */}
                      <Skeleton className="h-10 w-full" />    {/* Input */}
                    </div>
                    <div>
                      <Skeleton className="h-4 w-1/4 mb-2" /> {/* Label */}
                      <Skeleton className="h-24 w-full" />   {/* Textarea */}
                    </div>
                    <div>
                      <Skeleton className="h-4 w-1/4 mb-2" /> {/* Label */}
                      <Skeleton className="h-10 w-full" />    {/* Input */}
                    </div>
                  </div>
                </>
              )}

              {!showStep1Skeleton && showStep2Skeleton && (
                 <>
                  <Skeleton className="h-6 w-1/3 mb-4" /> {/* Step 2 title */}
                  <div className="space-y-6">
                    {/* Skeleton for one author entry */}
                    <div className="space-y-4 border border-border/50 p-4 rounded-md">
                        <Skeleton className="h-5 w-1/4 mb-2" /> {/* Author X */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Skeleton className="h-4 w-1/3 mb-1" /> {/* Label */}
                                <Skeleton className="h-10 w-full" />     {/* Input/Select */}
                            </div>
                            <div>
                                <Skeleton className="h-4 w-1/3 mb-1" /> {/* Label */}
                                <Skeleton className="h-10 w-full" />     {/* Input */}
                            </div>
                            <div>
                                <Skeleton className="h-4 w-1/3 mb-1" /> {/* Label */}
                                <Skeleton className="h-10 w-full" />     {/* Input */}
                            </div>
                            <div>
                                <Skeleton className="h-4 w-1/3 mb-1" /> {/* Label */}
                                <Skeleton className="h-10 w-full" />     {/* Input (Email) */}
                            </div>
                            <div>
                                <Skeleton className="h-4 w-1/3 mb-1" /> {/* Label */}
                                <Skeleton className="h-10 w-full" />     {/* Input (Affiliation) */}
                            </div>
                            <div>
                                <Skeleton className="h-4 w-1/3 mb-1" /> {/* Label */}
                                <Skeleton className="h-10 w-full" />     {/* Input (Country) */}
                            </div>
                        </div>
                    </div>
                    <Skeleton className="h-10 w-36" /> {/* Add More Author button */}
                  </div>
                </>
              )}


              {/* Navigation Buttons Skeleton */}
              <div className="mt-8 flex justify-between">
                <Skeleton className="h-10 w-24 rounded-md bg-muted/70" /> {/* Previous (disabled look if step 1) */}
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
