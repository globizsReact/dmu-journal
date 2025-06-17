
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ManuscriptDetailsForm, { type ManuscriptDetailsData } from '@/components/author/forms/ManuscriptDetailsForm';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, title: 'Manuscript Information' },
  { id: 2, title: 'Author Details' },
  { id: 3, title: 'Upload Files' },
];

// Placeholder form data types for other steps
export type AuthorDetailsData = { coAuthors: string }; // Example
export type UploadFilesData = { manuscriptFile: File | null }; // Example

export default function SubmitManuscriptStepper() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formDataStep1, setFormDataStep1] = useState<ManuscriptDetailsData | null>(null);
  const [formDataStep2, setFormDataStep2] = useState<AuthorDetailsData | null>(null);
  const [formDataStep3, setFormDataStep3] = useState<UploadFilesData | null>(null);

  const handleNextFromStep1 = (data: ManuscriptDetailsData) => {
    setFormDataStep1(data);
    setCurrentStep(2);
  };

  const handleNextFromStep2 = (data: AuthorDetailsData) => {
    setFormDataStep2(data);
    setCurrentStep(3);
  };
  
  const handleFinish = (data: UploadFilesData) => {
    setFormDataStep3(data);
    // Combine all data and submit
    console.log('Submitting manuscript:', { ...formDataStep1, ...formDataStep2, ...data });
    // Here you would typically make an API call
    alert('Manuscript Submitted (Simulated)! Check console for data.');
    setCurrentStep(1); // Reset to first step or navigate away
    setFormDataStep1(null);
    setFormDataStep2(null);
    setFormDataStep3(null);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl font-headline font-bold text-primary text-center mb-2">
          Submit New Manuscript
        </CardTitle>
        {/* Step Indicators */}
        <div className="flex justify-center space-x-2 md:space-x-4 my-6">
          {steps.map((step, index) => (
            <Button
              key={step.id}
              variant={currentStep === step.id ? 'default' : 'outline'}
              className={cn(
                "px-3 py-2 md:px-6 md:py-3 text-xs md:text-sm rounded-md transition-all duration-300",
                currentStep === step.id ? "bg-green-600 hover:bg-green-700 text-white" : 
                                        "bg-gray-200 text-gray-700 hover:bg-gray-300",
                currentStep > step.id ? "bg-green-600 text-white" : "" // Completed steps
              )}
              onClick={() => {
                // Allow navigation to previous, completed steps
                if (step.id < currentStep) {
                   if (step.id === 1 && formDataStep1) setCurrentStep(step.id);
                   // Add similar checks if forms for step 2 and 3 are implemented
                }
              }}
              disabled={step.id > currentStep && !(step.id === currentStep + 1 && (currentStep === 1 ? formDataStep1 : true) )} // Simplistic disable for future steps
            >
              {step.id}. {step.title}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {currentStep === 1 && (
          <ManuscriptDetailsForm 
            onValidatedNext={handleNextFromStep1} 
            initialData={formDataStep1} 
          />
        )}
        {currentStep === 2 && (
          <div className="py-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Step 2: Author Details</h3>
            <p className="text-muted-foreground">Author details form will be here.</p>
            <p className="text-muted-foreground mt-2">For now, click "Next" to proceed or "Previous" to go back.</p>
          </div>
        )}
        {currentStep === 3 && (
          <div className="py-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Step 3: Upload Files</h3>
            <p className="text-muted-foreground">File upload form will be here.</p>
             <p className="text-muted-foreground mt-2">For now, click "Finish" to simulate submission or "Previous" to go back.</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={currentStep === 1}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800"
          >
            Previous
          </Button>

          {currentStep < steps.length && (
            <Button 
              onClick={() => {
                // For steps 2 and 3, we directly go next if they are just placeholders
                if (currentStep === 2) handleNextFromStep2({coAuthors: "test"}); // Simulate data for now
                // For step 1, the ManuscriptDetailsForm internal submit button handles it.
                // This button is primarily for placeholder steps 2 & 3.
                // If ManuscriptDetailsForm had its own next button, this logic would need adjustment.
                // For now, this next button will not be shown on step 1 if form handles its own next.
                // The ManuscriptDetailsForm will have its own "Next" button.
              }}
              variant="default"
              className="bg-green-600 hover:bg-green-700 text-white"
              // This button is only truly functional for step 2 for now.
              // Step 1's "Next" is inside ManuscriptDetailsForm.
              style={{ display: currentStep === 1 ? 'none' : 'inline-flex' }} 
            >
              Next
            </Button>
          )}

          {currentStep === steps.length && (
            <Button 
              onClick={() => handleFinish({manuscriptFile: null})}  // Simulate data for now
              variant="default"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Finish
            </Button>
          )}
        </div>
        <div className="text-center mt-10 text-sm text-muted-foreground">
            2025 Academic Journal
        </div>
      </CardContent>
    </Card>
  );
}
