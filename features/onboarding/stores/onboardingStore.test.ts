import { act } from '@testing-library/react';
import { OnboardingStep, useOnboardingStore } from './onboardingStore';

const sampleCustomerInfo = {
  name: 'John',
  surname: 'Doe',
  citizenId: '1234567890123',
  accountNumber: '1234567890',
};

const sampleFile = {
  id: 'file1',
  name: 'passport.pdf',
};

describe('onboardingStore', () => {
  beforeEach(() => {
    act(() => {
      useOnboardingStore.getState().reset();
    });
  });

  it('should have initial state', () => {
    const state = useOnboardingStore.getState();
    expect(state.customerInfo).toEqual({ name: '', surname: '', citizenId: '', accountNumber: '' });
    expect(state.uploadedFiles).toEqual([]);
    expect(state.currentStep).toBe(0);
  });

  it('should set customer info', () => {
    act(() => {
      useOnboardingStore.getState().setCustomerInfo(sampleCustomerInfo);
    });
    expect(useOnboardingStore.getState().customerInfo).toEqual(sampleCustomerInfo);
  });

  it('should add and remove uploaded files', () => {
    act(() => {
      useOnboardingStore.getState().addUploadedFile(sampleFile);
    });
    expect(useOnboardingStore.getState().uploadedFiles).toHaveLength(1);
    act(() => {
      useOnboardingStore.getState().removeUploadedFile('file1');
    });
    expect(useOnboardingStore.getState().uploadedFiles).toHaveLength(0);
  });

  it('should reset state', () => {
    act(() => {
      useOnboardingStore.getState().setCustomerInfo(sampleCustomerInfo);
      useOnboardingStore.getState().addUploadedFile(sampleFile);
      useOnboardingStore.getState().reset();
    });
    expect(useOnboardingStore.getState().customerInfo).toEqual({
      name: '',
      surname: '',
      citizenId: '',
      accountNumber: '',
    });
    expect(useOnboardingStore.getState().uploadedFiles).toEqual([]);
  });

  it('should return correct step key', () => {
    // Step 1: KeyIn
    expect(useOnboardingStore.getState().getStepKey()).toBe(OnboardingStep.KeyIn);
    // Step 2: UploadDocument
    act(() => {
      useOnboardingStore.getState().setCustomerInfo(sampleCustomerInfo);
    });
    expect(useOnboardingStore.getState().getStepKey()).toBe(OnboardingStep.UploadDocument);
    // Step 3: Verify
    act(() => {
      useOnboardingStore.getState().addUploadedFile(sampleFile);
    });
    expect(useOnboardingStore.getState().getStepKey()).toBe(OnboardingStep.Verify);
  });
});
