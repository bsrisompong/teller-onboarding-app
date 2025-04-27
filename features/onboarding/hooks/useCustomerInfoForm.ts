'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { notifications } from '@mantine/notifications';
import { useApplicationMutation } from '../api/application';
import { useOnboardingStore } from '../stores/onboardingStore';

const customerInfoSchema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่อ'),
  surname: z.string().min(1, 'กรุณากรอกนามสกุล'),
  citizenId: z.string().regex(/^\d{13}$/, 'หมายเลขบัตรประชาชนต้องมี 13 หลัก'),
  accountNumber: z.string().regex(/^\d{10,12}$/, 'หมายเลขบัญชีควรมี 10-12 หลัก'),
});

type customerInfo = z.infer<typeof customerInfoSchema>;

export function useCustomerInfoForm(onSuccess?: () => void) {
  const { customerInfo, setNewApplication } = useOnboardingStore();
  const { mutateAsync: createApplication, isPending } = useApplicationMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<customerInfo>({
    resolver: zodResolver(customerInfoSchema),
  });

  // prefill customer info
  useEffect(() => {
    if (customerInfo) {
      reset(customerInfo);
    }
  }, [customerInfo, reset]);

  const onSubmit = async (data: customerInfo) => {
    try {
      const res = await createApplication(data);
      setNewApplication({
        customerId: res.customer.id,
        applicationId: res.application.id,
        customerInfo: data,
      });
      notifications.show({
        title: 'บันทึกข้อมูลสำเร็จ!',
        message: 'ข้อมูลของคุณถูกบันทึกเรียบร้อย',
        color: 'green',
      });
      reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isPending,
  };
}
