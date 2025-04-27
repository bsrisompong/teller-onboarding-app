import { IconCircleCheck, IconFile, IconSearch, IconUser } from '@tabler/icons-react';
import { Stepper } from '@mantine/core';
// stores
import { useOnboardingStore } from '../stores/onboardingStore';

function getMaxStep(applicationId: string | null, uploadedFiles: any[]) {
  if (!applicationId) return 0;
  if (uploadedFiles.length === 0) return 1;
  return 2;
}

export function OnboardingStepper() {
  const { currentStep, applicationId, uploadedFiles, setCurrentStep } = useOnboardingStore();

  const maxStep = getMaxStep(applicationId, uploadedFiles);

  return (
    <Stepper
      active={currentStep}
      onStepClick={setCurrentStep}
      completedIcon={<IconCircleCheck size={18} />}
      my={{
        base: 'xs',
        sm: 'md',
        md: 48,
      }}
    >
      <Stepper.Step
        icon={<IconUser size={18} />}
        label="กรอกข้อมูลส่วนตัว"
        description="กรอกข้อมูลส่วนตัว"
      />
      <Stepper.Step
        icon={<IconFile size={18} />}
        label="อัพโหลดเอกสาร"
        description="อัพโหลดเอกสาร"
        disabled={maxStep < 1}
      />
      <Stepper.Step
        icon={<IconSearch size={18} />}
        label="ยืนยันข้อมูล"
        description="ยืนยันข้อมูล"
        disabled={maxStep < 2}
      />
    </Stepper>
  );
}

export default OnboardingStepper;
