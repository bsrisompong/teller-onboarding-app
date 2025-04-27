'use client';

import { Alert, Box, Button, Stack, TextInput, Title } from '@mantine/core';
import { useCustomerInfoForm } from '@/features/onboarding';

interface CustomerInfoFormProps {
  onSuccess?: () => void;
}

export function CustomerInfoForm({ onSuccess }: CustomerInfoFormProps) {
  const { register, handleSubmit, errors, onSubmit } = useCustomerInfoForm(onSuccess);

  return (
    <Box maw={400} mx="auto" mt="xl">
      <Title order={2} mb="lg" ta="center">
        กรอกข้อมูลส่วนตัว
        <br />
        ของผู้มาทำธุรกรรม
      </Title>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          <TextInput
            label="ชื่อ"
            placeholder="กรอกชื่อ"
            {...register('name')}
            error={errors.name?.message}
            required
          />
          <TextInput
            label="นามสกุล"
            placeholder="กรอกนามสกุล"
            {...register('surname')}
            error={errors.surname?.message}
            required
          />
          <TextInput
            label="หมายเลขบัตรประชาชน"
            placeholder="กรอกหมายเลขบัตรประชาชน 13 หลัก"
            maxLength={13}
            {...register('citizenId')}
            error={errors.citizenId?.message}
            required
          />
          <TextInput
            label="หมายเลขบัญชี"
            placeholder="กรอกหมายเลขบัญชี 10-12 หลัก"
            maxLength={12}
            {...register('accountNumber')}
            error={errors.accountNumber?.message}
            required
          />
          <Button type="submit" fullWidth>
            ยืนยันการกรอกข้อมูล
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
