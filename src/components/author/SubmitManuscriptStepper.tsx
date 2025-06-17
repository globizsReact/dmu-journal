
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ManuscriptDetailsForm, { type ManuscriptDetailsData } from '@/components/author/forms/ManuscriptDetailsForm';
import AuthorDetailsForm, { type AuthorDetailsData } from '@/components/author/forms/AuthorDetailsForm'; // New import
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, title: 'Manuscript Information' },
  { id: 2, title: 'Author Details' },
  { id: 3, title: 'Upload Files' },
];

// Placeholder form data types for other steps
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

  const canNavigateToStep = (stepId: number) => {
    if (stepId < currentStep) return true; // Allow navigation to previous, completed steps
    if (stepId === 1 && formDataStep1) return true;
    if (stepId === 2 && formDataStep1 && formDataStep2) return true; 
    // Add similar checks if forms for step 3 are implemented
    return false;
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
                // Mark as completed if step.id < currentStep and corresponding form data exists
                (step.id < currentStep && 
                  ( (step.id === 1 && formDataStep1) || (step.id === 2 && formDataStep2) )
                ) ? "bg-green-600 text-white" : "" 
              )}
              onClick={() => {
                if (canNavigateToStep(step.id)) {
                   setCurrentStep(step.id);
                }
              }}
              // Disable if trying to go to a future step that isn't the immediate next one,
              // or if data for previous steps isn't filled.
              disabled={step.id > currentStep && !(
                step.id === currentStep + 1 && 
                (
                  (currentStep === 1 && formDataStep1) ||
                  (currentStep === 2 && formDataStep2) ||
                  currentStep > 2 // If beyond implemented forms, allow next (for placeholder steps)
                )
              )}
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
           <AuthorDetailsForm 
            onValidatedNext={handleNextFromStep2} 
            initialData={formDataStep2} 
            onPrevious={handlePrevious}
          />
        )}
        {currentStep === 3 && (
          <div className="py-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Step 3: Upload Files</h3>
            <p className="text-muted-foreground">File upload form will be here.</p>
             <p className="text-muted-foreground mt-2">For now, click "Finish" to simulate submission or "Previous" to go back.</p>
            {/* Navigation Buttons for Step 3 */}
            <div className="mt-8 flex justify-between">
                <Button
                    onClick={handlePrevious}
                    variant="outline"
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800"
                >
                    Previous
                </Button>
                <Button 
                    onClick={() => handleFinish({manuscriptFile: null})}  // Simulate data for now
                    variant="default"
                    className="bg-green-600 hover:bg-green-700 text-white"
                >
                    Finish
                </Button>
            </div>
          </div>
        )}
        
        {/* Common Navigation buttons are now mostly handled within each form or specific step content */}
        {/* Step 1 (ManuscriptDetailsForm) has its own Next button */}
        {/* Step 2 (AuthorDetailsForm) has its own Next and Previous buttons */}
        {/* Step 3 (Placeholder) has its own Previous and Finish buttons */}

        <div className="text-center mt-10 text-sm text-muted-foreground">
            2025 Academic Journal
        </div>
      </CardContent>
    </Card>
  );
}
