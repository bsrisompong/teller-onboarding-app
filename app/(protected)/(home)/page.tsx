'use client';

import {
  CustomerInfoForm,
  OnboardingStepper,
  UploadDocumentForm,
  useOnboardingStore,
  VerifyForm,
} from '@/features/onboarding';

export default function HomePage() {
  const { currentStep } = useOnboardingStore();

  return (
    <>
      <OnboardingStepper />
      {currentStep === 0 && <CustomerInfoForm />}
      {currentStep === 1 && <UploadDocumentForm />}
      {currentStep === 2 && <VerifyForm />}
    </>
  );
}
