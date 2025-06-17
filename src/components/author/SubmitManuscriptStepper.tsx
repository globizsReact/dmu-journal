
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ManuscriptDetailsForm, { type ManuscriptDetailsData } from '@/components/author/forms/ManuscriptDetailsForm';
import AuthorDetailsForm, { type AuthorDetailsData } from '@/components/author/forms/AuthorDetailsForm';
import UploadFilesForm, { type UploadFilesData } from '@/components/author/forms/UploadFilesForm';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Check } from 'lucide-react';
import React from 'react';

const steps = [
  { id: 1, title: 'Manuscript Information' },
  { id: 2, title: 'Author Details' },
  { id: 3, title: 'Upload Files' },
];

export default function SubmitManuscriptStepper() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formDataStep1, setFormDataStep1] = useState<ManuscriptDetailsData | null>(null);
  const [formDataStep2, setFormDataStep2] = useState<AuthorDetailsData | null>(null);
  // formDataStep3 is implicitly handled by onFinish which then resets the stepper
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
      description: "Your manuscript data has been logged to the console. The form has been reset.",
      variant: "default",
    });

    setCurrentStep(1); 
    setFormDataStep1(null);
    setFormDataStep2(null);
    // UploadFilesForm will reset its own internal state for file names upon re-render
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const isStepComplete = (stepId: number): boolean => {
    if (stepId === 1 && formDataStep1) return true;
    if (stepId === 2 && formDataStep1 && formDataStep2) return true;
    return false;
  };

  // Determine the furthest reachable step based on completed data
  let maxReachableStep = 1;
  if (formDataStep1) maxReachableStep = 2;
  if (formDataStep1 && formDataStep2) maxReachableStep = 3;
  // Ensure currentStep itself is considered reachable if it's ahead of data completion (e.g., after a reset or direct navigation if allowed)
  if (currentStep > maxReachableStep) maxReachableStep = currentStep;


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl font-headline font-bold text-primary text-center mb-6">
          Submit New Manuscript
        </CardTitle>
        {/* Step Indicators */}
        <div className="flex items-start w-full mb-10 px-2 sm:px-4 md:px-8">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center text-center">
                <button
                  onClick={() => {
                    if (step.id <= maxReachableStep && step.id !== currentStep) {
                      setCurrentStep(step.id);
                    }
                  }}
                  // Disable clicking on future, unreached steps
                  disabled={step.id > maxReachableStep && step.id !== currentStep}
                  className={cn(
                    "flex flex-col items-center focus:outline-none",
                    step.id <= maxReachableStep ? "cursor-pointer" : "cursor-default",
                    step.id > maxReachableStep && step.id !== currentStep && "opacity-60"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ease-in-out",
                      currentStep === step.id
                        ? "bg-primary border-primary text-primary-foreground scale-110 shadow-lg" // Active
                        : isStepComplete(step.id)
                        ? "bg-green-600 border-green-600 text-white" // Completed
                        : "bg-card border-border text-foreground" // Upcoming
                    )}
                  >
                    {isStepComplete(step.id) && currentStep !== step.id ? (
                      <Check className="w-4 h-4 md:w-5 md:h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <p
                    className={cn(
                      "mt-2 text-xs md:text-sm font-medium w-24 md:w-32 break-words transition-colors duration-300",
                      currentStep === step.id
                        ? "text-primary font-semibold"
                        : isStepComplete(step.id)
                        ? "text-green-700 dark:text-green-500"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </p>
                </button>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-1 mt-[18px] md:mt-[22px] transition-colors duration-500 ease-in-out", // Position line vertically centered with the circle's center
                    isStepComplete(step.id) && (currentStep > step.id || isStepComplete(step.id +1)) // Line from a completed step segment that leads to another completed or active step
                      ? "bg-green-600"
                      : "bg-border" 
                  )}
                />
              )}
            </React.Fragment>
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
          <UploadFilesForm
            onFinish={handleFinish}
            onPrevious={handlePrevious}
          />
        )}
        
        <div className="text-center mt-10 text-sm text-muted-foreground">
            2025 Academic Journal
        </div>
      </CardContent>
    </Card>
  );
}
