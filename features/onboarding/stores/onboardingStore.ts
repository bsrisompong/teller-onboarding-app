import { nanoid } from 'nanoid/non-secure';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export enum OnboardingStep {
  KeyIn = 'key-in',
  UploadDocument = 'upload-document',
  Verify = 'verify',
}

export type CustomerInfo = {
  name: string;
  surname: string;
  citizenId: string;
  accountNumber: string;
};

export type UploadedFile = {
  id: string;
  name: string;
  type: string;
  base64: string; // TODO: Remove this later when we have a better way to handle the file
};

interface OnboardingStore {
  customerId: string | null;
  applicationId: string | null;
  customerInfo: CustomerInfo;
  uploadedFiles: UploadedFile[];
  currentStep: number;
  setCustomerInfo: (info: Partial<CustomerInfo> | CustomerInfo) => void;
  addUploadedFile: (file: UploadedFile) => void;
  removeUploadedFile: (id: string) => void;
  reset: () => void;
  setCurrentStep: (step: number) => void;
  getStepKey: () => OnboardingStep;
  setNewApplication: (info: {
    customerId: string;
    applicationId: string;
    customerInfo: CustomerInfo;
  }) => void;
}

const initialCustomerInfo: CustomerInfo = {
  name: '',
  surname: '',
  citizenId: '',
  accountNumber: '',
};

function isCustomerInfoComplete(info: CustomerInfo) {
  return Object.values(info).every((v) => !!v);
}

function getStepKey(customerInfo: CustomerInfo, uploadedFiles: UploadedFile[]): OnboardingStep {
  if (!isCustomerInfoComplete(customerInfo)) {
    return OnboardingStep.KeyIn;
  }
  if (uploadedFiles.length === 0) {
    return OnboardingStep.UploadDocument;
  }
  return OnboardingStep.Verify;
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      customerId: nanoid(),
      applicationId: nanoid(),
      customerInfo: initialCustomerInfo,
      uploadedFiles: [],
      currentStep: 0,
      setCustomerInfo: (info) =>
        set((state) => ({
          customerInfo:
            'name' in info && 'surname' in info && 'citizenId' in info && 'accountNumber' in info
              ? (info as CustomerInfo)
              : { ...state.customerInfo, ...info },
        })),
      addUploadedFile: (file) =>
        set((state) => ({ uploadedFiles: [...state.uploadedFiles, file] })),
      removeUploadedFile: (id) =>
        set((state) => ({
          uploadedFiles: state.uploadedFiles.filter((f) => f.id !== id),
        })),
      reset: () =>
        set({
          customerId: null,
          applicationId: null,
          customerInfo: initialCustomerInfo,
          uploadedFiles: [],
          currentStep: 0,
        }),
      setCurrentStep: (step) => set({ currentStep: step }),
      getStepKey: () => getStepKey(get().customerInfo, get().uploadedFiles),
      setNewApplication: (info) =>
        set({
          customerId: info.customerId,
          applicationId: info.applicationId,
          customerInfo: info.customerInfo,
          currentStep: 1,
        }),
    }),
    {
      name: 'onboarding-store',
      partialize: (state) => ({
        customerId: state.customerId,
        applicationId: state.applicationId,
        customerInfo: state.customerInfo,
        uploadedFiles: state.uploadedFiles,
      }),
    }
  )
);
