
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ManuscriptDetailsForm, { type ManuscriptDetailsData } from '@/components/author/forms/ManuscriptDetailsForm';
import AuthorDetailsForm, { type AuthorDetailsData } from '@/components/author/forms/AuthorDetailsForm';
import UploadFilesForm, { type UploadFilesData } from '@/components/author/forms/UploadFilesForm';
import { cn } from '@/lib/utils';
import { Check, CheckCircle2 } from 'lucide-react';
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
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    
    setIsSubmitted(true);
    // Form data will be reset if "Submit Another Journal" is clicked
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmitAnother = () => {
    setIsSubmitted(false);
    setCurrentStep(1);
    setFormDataStep1(null);
    setFormDataStep2(null);
    // Individual forms (like UploadFilesForm) should reset their own internal state (e.g., file names)
    // or be reset via their `key` prop if necessary for full reset.
    // The form in UploadFilesForm is reset via its `form.reset()` call in its onSubmit.
  };

  const isStepComplete = (stepId: number): boolean => {
    if (stepId === 1 && formDataStep1) return true;
    if (stepId === 2 && formDataStep1 && formDataStep2) return true;
    // Step 3 is complete once submitted, not just by filling data.
    // For UI, it's complete if we are past it or viewing the submission success.
    if (isSubmitted && stepId <= 3) return true; 
    return false;
  };

  let maxReachableStep = 1;
  if (formDataStep1) maxReachableStep = 2;
  if (formDataStep1 && formDataStep2) maxReachableStep = 3;
  if (currentStep > maxReachableStep && !isSubmitted) maxReachableStep = currentStep;


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl font-headline font-bold text-primary text-center mb-6">
          {isSubmitted ? 'Submission Confirmed' : 'Submit New Manuscript'}
        </CardTitle>
        {!isSubmitted && (
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
                          ? "bg-primary border-primary text-primary-foreground scale-110 shadow-lg"
                          : isStepComplete(step.id)
                          ? "bg-green-600 border-green-600 text-white"
                          : "bg-card border-border text-foreground"
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
                      "flex-1 h-1 mt-[18px] md:mt-[22px] transition-colors duration-500 ease-in-out",
                      isStepComplete(step.id) && (currentStep > step.id || isStepComplete(step.id +1))
                        ? "bg-green-600"
                        : "bg-border" 
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isSubmitted ? (
          <div className="text-center py-8 px-4">
            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-headline font-semibold text-primary mb-3">
              Your Journal Has Successfully Been Submitted
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              A Confirmation Has Been Sent To Your Email.
              Our Team Will Review Your Journal For Publishing.
            </p>
            <Button 
              onClick={handleSubmitAnother}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
            >
              Submit Another Journal
            </Button>
          </div>
        ) : (
          <>
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
          </>
        )}
        
        <div className="text-center mt-10 text-sm text-muted-foreground">
            2025 Academic Journal
        </div>
      </CardContent>
    </Card>
  );
}
