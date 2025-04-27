'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useGenerateTOTP, useVerifyTOTP } from '@/features/auth';

const totpSchema = z.object({
  code: z
    .string()
    .length(6, 'Code must be exactly 6 digits')
    .regex(/^\d+$/, 'Code must contain only numbers'),
});

type TotpFormData = z.infer<typeof totpSchema>;

interface UseTwoFAFormOptions {
  isSetup: boolean;
  onSuccess: () => void;
}

export const useTwoFAForm = ({ isSetup, onSuccess }: UseTwoFAFormOptions) => {
  const { verifyTOTP, isVerifying } = useVerifyTOTP();

  const {
    data: qrCodeData,
    isFetching: isQrCodeLoading,
    isSuccess,
  } = useGenerateTOTP({
    enabled: isSetup,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
    reset,
  } = useForm<TotpFormData>({
    resolver: zodResolver(totpSchema),
    mode: 'onSubmit',
  });

  const onSubmit = async (data: TotpFormData) => {
    clearErrors();
    try {
      const res = await verifyTOTP(data.code);
      if (res.success) {
        onSuccess();
      }
    } catch {
      reset();
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isVerifying,
    qrCodeData,
    isQrCodeLoading,
    isSuccess,
    onSubmit,
  };
};
