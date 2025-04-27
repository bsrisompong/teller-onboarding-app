'use client';

import React, { useState } from 'react';
import { Center, Loader, Paper } from '@mantine/core';
import { TwoFactorSuccess, useSession, useTwoFactorSuccess } from '@/features/auth';
import TwoFAForm from '@/features/auth/components/TwoFAForm/TwoFAForm';
import { SessionType } from '@/features/auth/types';

const TwoFactorAuthPage = () => {
  const [verifySuccess, setVerifySuccess] = useState<boolean>(false);
  const { startRedirect } = useTwoFactorSuccess();

  const { data: session, isLoading: isSessionLoading } = useSession();
  const isSetup = session?.type === SessionType.SETUP_2FA;

  const handleSuccess = () => {
    setVerifySuccess(true);
    startRedirect();
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
      return <TwoFactorSuccess />;
    }

    return <TwoFAForm isSetup={isSetup} onSuccess={handleSuccess} />;
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
