'use client';

import React from 'react';
import QRCode from 'react-qr-code';
import { Button, Divider, Group, Skeleton, Stack, Text, TextInput, Title } from '@mantine/core';
import { useTwoFAForm } from '@/features/auth/hooks/useTwoFAForm';

interface TwoFAFormProps {
  isSetup: boolean;
  onSuccess: () => void;
}

const TwoFAForm = ({ isSetup, onSuccess }: TwoFAFormProps) => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isVerifying,
    qrCodeData,
    isQrCodeLoading,
    isSuccess,
    onSubmit,
  } = useTwoFAForm({ isSetup, onSuccess });

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-testid="two-factor-form">
      <Stack gap="lg">
        {isSetup ? (
          <Title order={2} ta="center" mt="md" data-testid="setup-title">
            Enable two-factor authentication (2FA)
          </Title>
        ) : (
          <Title order={2} ta="center" mt="md" data-testid="verify-title">
            Two-Factor Authentication
          </Title>
        )}
        {isSetup && isSuccess && qrCodeData && (
          <>
            <Stack data-testid="qr-code-section">
              <Title order={3} ta="center" data-testid="qr-code-title">
                Scan the QR code
              </Title>

              <Group justify="center">
                {isQrCodeLoading ? (
                  <Skeleton height={200} width={200} data-testid="qr-code-skeleton" />
                ) : (
                  <QRCode value={qrCodeData.uri} size={200} data-testid="qr-code" />
                )}
              </Group>
              <Text size="md" ta="center" data-testid="qr-code-instruction">
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
          data-testid="code-input"
          {...register('code')}
        />

        <Button
          type="submit"
          size="md"
          loading={isSubmitting || isVerifying}
          disabled={isSubmitting || isVerifying}
          color="green"
          data-testid="verify-button"
        >
          Verify
        </Button>
      </Stack>
    </form>
  );
};

export default TwoFAForm;
