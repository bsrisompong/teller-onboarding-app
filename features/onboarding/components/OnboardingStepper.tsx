import { IconCircleCheck, IconFile, IconSearch, IconUser } from '@tabler/icons-react';
import { Stepper } from '@mantine/core';
// stores
import { useOnboardingStore } from '../stores/onboardingStore';

export function OnboardingStepper() {
  const { currentStep, setCurrentStep } = useOnboardingStore();

  const maxStep = 3;

  return (
    <Stepper
      active={currentStep}
      onStepClick={setCurrentStep}
      completedIcon={<IconCircleCheck size={18} />}
      my={{
        base: 'xs',
        sm: 'md',
        md: 50,
      }}
    >
      <Stepper.Step
        icon={<IconUser size={18} />}
        label="กรอกข้อมูลส่วนตัว"
        description="กรอกข้อมูลส่วนตัว"
        disabled={maxStep < 1}
      />
      <Stepper.Step
        icon={<IconFile size={18} />}
        label="อัพโหลดเอกสาร"
        description="อัพโหลดเอกสาร"
        disabled={maxStep < 2}
      />
      <Stepper.Step
        icon={<IconSearch size={18} />}
        label="ยืนยันข้อมูล"
        description="ยืนยันข้อมูล"
        disabled={maxStep < 3}
      />
    </Stepper>
  );
}

export default OnboardingStepper;
