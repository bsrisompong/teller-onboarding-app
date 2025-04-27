'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconShieldCheck, IconShieldCheckFilled } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import QRCode from 'react-qr-code';
import { z } from 'zod';
import {
  Button,
  Center,
  Divider,
  Group,
  Loader,
  Paper,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useTimeout } from '@mantine/hooks';
import { useGenerateTOTP, useVerifyTOTP } from '@/features/auth';
import { useSession } from '@/features/auth/apis/useSession';
import { SessionType } from '@/features/auth/types';

const totpSchema = z.object({
  code: z
    .string()
    .length(6, 'Code must be exactly 6 digits')
    .regex(/^\d+$/, 'Code must contain only numbers'),
});

type TotpFormData = z.infer<typeof totpSchema>;

const TwoFactorAuthPage = () => {
  const [qrCodeUri, setQrCodeUri] = useState<string | null>(null);
  const [verifySuccess, setVerifySuccess] = useState<boolean>(false);

  const { verifyTOTP, isVerifying } = useVerifyTOTP();

  const { data: session, isLoading: isSessionLoading, isSuccess: isSessionSuccess } = useSession();
  const isSetup = session?.type === SessionType.SETUP_2FA;

  const router = useRouter();
  const { start } = useTimeout(() => router.replace('/'), 5 * 1000); // 5 seconds

  const {
    data: qrCodeData,
    isFetching: isQrCodeLoading,
    isSuccess,
  } = useGenerateTOTP({
    enabled: isSessionSuccess && isSetup,
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

  useEffect(() => {
    if (isSetup && isSuccess && qrCodeData) {
      setQrCodeUri(qrCodeData.uri);
    }
  }, [isSuccess, qrCodeData, session?.type]);

  const onSubmit = async (data: TotpFormData) => {
    clearErrors();
    try {
      const res = await verifyTOTP(data.code);
      // TODO : If success, show
      if (res.success) {
        setVerifySuccess(true);
        start();
      }
    } catch {
      reset();
    }
  };

  const renderContent = () => {
    if (isSessionLoading) {
      return (
        <Center h="100%" w="100%">
          <Loader />
        </Center>
      );
    }

    if (verifySuccess) {
      return (
        <Center h="100%" w="100%">
          <Stack justify="center" align="center">
            <IconShieldCheckFilled size={60} color="var(--mantine-color-green-filled)" />
            <Text size="lg" fw={700} ta="center">
              Two-factor authentication (2FA)
              <br />
              verified successfully
            </Text>
            <Button onClick={() => router.replace('/')} color="green">
              Done
            </Button>
          </Stack>
        </Center>
      );
    }

    return (
      <>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="lg">
            {isSetup ? (
              <Title order={2} ta="center" mt="md">
                Enable two-factor authentication (2FA)
              </Title>
            ) : (
              <Title order={2} ta="center" mt="md">
                Two-Factor Authentication
              </Title>
            )}
            {isSetup && qrCodeUri && (
              <>
                <Stack>
                  <Title order={3} ta="center">
                    Scan the QR code
                  </Title>

                  <Group justify="center">
                    {isQrCodeLoading ? (
                      <Skeleton height={200} width={200} />
                    ) : (
                      <QRCode value={qrCodeUri} size={200} />
                    )}
                  </Group>
                  <Text size="md" ta="center">
                    Use an authenticator app or extension to scan the QR code
                  </Text>
                </Stack>
                <Divider />
              </>
            )}
            <TextInput
              label={isSetup ? 'Verify 6-digit code' : 'Enter 6-digit code'}
              placeholder="000000"
              maxLength={6}
              size="md"
              required
              error={errors.code?.message}
              disabled={isSubmitting || isVerifying}
              {...register('code', {
                onChange: () => {
                  clearErrors();
                },
              })}
            />

            <Button type="submit" size="md" loading={isSubmitting || isVerifying} color="green">
              Verify
            </Button>
          </Stack>
        </form>
      </>
    );
  };

  return (
    <>
      <Paper radius="md" p="xl" withBorder>
        {renderContent()}
      </Paper>
    </>
  );
};

export default TwoFactorAuthPage;
