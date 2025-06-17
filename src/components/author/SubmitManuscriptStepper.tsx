
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ManuscriptDetailsForm, { type ManuscriptDetailsData } from '@/components/author/forms/ManuscriptDetailsForm';
import AuthorDetailsForm, { type AuthorDetailsData } from '@/components/author/forms/AuthorDetailsForm';
import UploadFilesForm, { type UploadFilesData } from '@/components/author/forms/UploadFilesForm'; // New import
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const steps = [
  { id: 1, title: 'Manuscript Information' },
  { id: 2, title: 'Author Details' },
  { id: 3, title: 'Upload Files' },
];

export default function SubmitManuscriptStepper() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formDataStep1, setFormDataStep1] = useState<ManuscriptDetailsData | null>(null);
  const [formDataStep2, setFormDataStep2] = useState<AuthorDetailsData | null>(null);
  // formDataStep3 is managed within UploadFilesForm for its local state (like file names)
  // but its validated data will be passed to handleFinish.
  const { toast } = useToast();

  const handleNextFromStep1 = (data: ManuscriptDetailsData) => {
    setFormDataStep1(data);
    setCurrentStep(2);
  };

  const handleNextFromStep2 = (data: AuthorDetailsData) => {
    setFormDataStep2(data);
    setCurrentStep(3);
  };
  
  const handleFinish = (dataStep3: UploadFilesData) => {
    // Combine all data and submit
    const finalSubmissionData = {
      manuscriptDetails: formDataStep1,
      authorDetails: formDataStep2,
      files: {
        coverLetter: dataStep3.coverLetterFile?.name || 'Not provided',
        manuscriptFile: dataStep3.manuscriptFile.name,
        supplementaryFiles: dataStep3.supplementaryFiles?.name || 'Not provided',
        agreedToTerms: dataStep3.authorAgreement,
      }
    };
    console.log('Submitting manuscript:', finalSubmissionData);
    
    toast({
      title: "Submission Successful (Simulated)",
      description: "Your manuscript data has been logged to the console.",
      variant: "default", // Or "success" if you have such a variant
    });

    // Reset to first step and clear data after successful "submission"
    setCurrentStep(1); 
    setFormDataStep1(null);
    setFormDataStep2(null);
    // formDataStep3 state is within UploadFilesForm, it will reset when re-rendered or on its own.
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const canNavigateToStep = (stepId: number) => {
    if (stepId < currentStep) return true; 
    if (stepId === 1 && formDataStep1) return true; // Already completed step 1
    if (stepId === 2 && formDataStep1 && formDataStep2) return true; // Completed step 1 & 2
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
          {steps.map((step) => (
            <Button
              key={step.id}
              variant={currentStep === step.id ? 'default' : 'outline'}
              className={cn(
                "px-3 py-2 md:px-6 md:py-3 text-xs md:text-sm rounded-md transition-all duration-300",
                currentStep === step.id ? "bg-green-600 hover:bg-green-700 text-white" : 
                                        "bg-gray-200 text-gray-700 hover:bg-gray-300",
                (step.id < currentStep && 
                  ( (step.id === 1 && formDataStep1) || (step.id === 2 && formDataStep1 && formDataStep2) ) // Check previous steps are complete
                ) ? "bg-green-600 text-white" : "" 
              )}
              onClick={() => {
                if (canNavigateToStep(step.id)) {
                   setCurrentStep(step.id);
                }
              }}
              disabled={step.id > currentStep && !( // Disable future steps if current isn't complete
                (step.id === currentStep + 1) &&
                ( (currentStep === 1 && formDataStep1) || (currentStep === 2 && formDataStep1 && formDataStep2) )
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
        {currentStep === 2 && formDataStep1 && ( // Ensure step 1 data exists before rendering step 2
           <AuthorDetailsForm 
            onValidatedNext={handleNextFromStep2} 
            initialData={formDataStep2} 
            onPrevious={handlePrevious}
          />
        )}
        {currentStep === 3 && formDataStep1 && formDataStep2 && ( // Ensure step 1 & 2 data exists
          <UploadFilesForm
            onFinish={handleFinish}
            onPrevious={handlePrevious}
            // No initialData needed for files in this simple setup,
            // but you could pass it if you stored file references/names
          />
        )}
        
        <div className="text-center mt-10 text-sm text-muted-foreground">
            2025 Academic Journal
        </div>
      </CardContent>
    </Card>
  );
}
