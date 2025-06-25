
'use client';

import { useState, useEffect } from 'react'; // Added useEffect
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ManuscriptDetailsForm, { type ManuscriptDetailsData } from '@/components/author/forms/ManuscriptDetailsForm';
import AuthorDetailsForm, { type AuthorDetailsData } from '@/components/author/forms/AuthorDetailsForm';
import UploadFilesForm, { type UploadFilesData } from '@/components/author/forms/UploadFilesForm';
import { cn } from '@/lib/utils';
import { Check, CheckCircle2, Loader2 } from 'lucide-react';
import React from 'react';
import { useToast } from '@/hooks/use-toast';


const steps = [
  { id: 1, title: 'Manuscript Information' },
  { id: 2, title: 'Author Details' },
  { id: 3, title: 'Upload Files & Submit' }, // Updated title
];

export default function SubmitManuscriptStepper() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formDataStep1, setFormDataStep1] = useState<ManuscriptDetailsData | null>(null);
  const [formDataStep2, setFormDataStep2] = useState<AuthorDetailsData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      setAuthToken(token);
      if (!token) {
        // Optionally, redirect or show message if no token, though page access should be guarded
        console.warn("Auth token not found. Submissions will likely fail.");
      }
    }
  }, []);


  const handleNextFromStep1 = (data: ManuscriptDetailsData) => {
    setFormDataStep1(data);
    setCurrentStep(2);
  };

  const handleNextFromStep2 = (data: AuthorDetailsData) => {
    setFormDataStep2(data);
    setCurrentStep(3);
  };
  
  const handleFinish = async (dataStep3: UploadFilesData) => {
    if (!formDataStep1 || !formDataStep2) {
      toast({
        title: 'Error',
        description: 'Previous step data is missing. Please go back and complete all steps.',
        variant: 'destructive',
      });
      return;
    }

    if (!authToken) {
      toast({
        title: 'Authentication Error',
        description: 'You are not logged in. Please log in to submit a manuscript.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    const submissionPayload = {
      manuscriptDetails: formDataStep1,
      authorDetails: formDataStep2,
      files: {
        coverLetterFileName: dataStep3.coverLetterFile?.name,
        manuscriptFileName: dataStep3.manuscriptFile.name,
        supplementaryFilesName: dataStep3.supplementaryFiles?.name,
        thumbnailImagePath: dataStep3.thumbnailImagePath,
        thumbnailImageHint: dataStep3.thumbnailImageHint,
        agreedToTerms: dataStep3.authorAgreement,
      }
    };

    console.log('Submitting manuscript with payload:', JSON.stringify(submissionPayload, null, 2));
    
    try {
      const response = await fetch('/api/manuscripts/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(submissionPayload),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'Submission Successful!',
          description: `Manuscript "${formDataStep1.articleTitle}" submitted. ID: ${result.manuscriptId}`,
          variant: 'default',
        });
        setIsSubmitted(true);
      } else {
        toast({
          title: 'Submission Failed',
          description: result.error || 'An unknown error occurred.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: 'Network Error',
        description: 'Could not connect to the server. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmitAnother = () => {
    setIsSubmitted(false);
    setIsSubmitting(false);
    setCurrentStep(1);
    setFormDataStep1(null);
    setFormDataStep2(null);
    // The UploadFilesForm will reset its own file inputs and agreement checkbox
    // when its internal form.reset() is called upon successful submission or if a key is used to re-mount it.
  };

  const isStepComplete = (stepId: number): boolean => {
    if (isSubmitted && stepId <= 3) return true;
    if (stepId < currentStep) return true; // All previous steps are considered complete
    if (stepId === 1 && formDataStep1) return true;
    if (stepId === 2 && formDataStep1 && formDataStep2) return true;
    return false;
  };

  let maxReachableStep = 1;
  if (formDataStep1) maxReachableStep = 2;
  if (formDataStep1 && formDataStep2) maxReachableStep = 3;
  if (currentStep > maxReachableStep && !isSubmitted) {
     // Allow navigation to current step even if prior data isn't fully "validated" by next click
     // This is primarily for allowing navigation back and forth.
     maxReachableStep = currentStep;
  }


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
                      if (step.id <= maxReachableStep && step.id !== currentStep && !isSubmitting) {
                        setCurrentStep(step.id);
                      }
                    }}
                    disabled={isSubmitting || (step.id > maxReachableStep && step.id !== currentStep)}
                    className={cn(
                      "flex flex-col items-center focus:outline-none",
                      step.id <= maxReachableStep && !isSubmitting ? "cursor-pointer" : "cursor-default",
                      (isSubmitting || (step.id > maxReachableStep && step.id !== currentStep)) && "opacity-60"
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ease-in-out",
                        currentStep === step.id
                          ? "bg-primary border-primary text-primary-foreground scale-110 shadow-lg"
                          : isStepComplete(step.id) && step.id < currentStep // Mark previous steps as complete
                          ? "bg-green-600 border-green-600 text-white"
                          : "bg-card border-border text-foreground"
                      )}
                    >
                      {isStepComplete(step.id) && step.id < currentStep ? ( // Checkmark only for truly completed previous steps
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
                          : isStepComplete(step.id) && step.id < currentStep
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
                       isStepComplete(step.id) && (currentStep > step.id || isStepComplete(step.id +1) || (currentStep === step.id +1 && isStepComplete(step.id) ))
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
              A Confirmation Has Been Sent To Your Email (mock).
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
                isSubmitting={isSubmitting}
              />
            )}
            {currentStep === 2 && ( 
               <AuthorDetailsForm 
                onValidatedNext={handleNextFromStep2} 
                initialData={formDataStep2} 
                onPrevious={handlePrevious}
                isSubmitting={isSubmitting}
              />
            )}
            {currentStep === 3 && (
              <UploadFilesForm
                onFinish={handleFinish}
                onPrevious={handlePrevious}
                isSubmitting={isSubmitting}
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
