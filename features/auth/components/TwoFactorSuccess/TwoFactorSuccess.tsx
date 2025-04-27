'use client';

import { useRouter } from 'next/navigation';
import { IconShieldCheckFilled } from '@tabler/icons-react';
import { Button, Center, Stack, Text } from '@mantine/core';

interface TwoFactorSuccessProps {
  onDone?: () => void;
}

const TwoFactorSuccess = ({ onDone }: TwoFactorSuccessProps) => {
  const router = useRouter();

  const handleDone = () => {
    onDone?.();
    router.replace('/');
  };

  return (
    <Center h="100%" w="100%" data-testid="two-factor-success">
      <Stack justify="center" align="center">
        <IconShieldCheckFilled
          size={60}
          color="var(--mantine-color-green-filled)"
          data-testid="success-icon"
        />
        <Text size="lg" fw={700} ta="center" data-testid="success-message">
          Two-factor authentication (2FA)
          <br />
          verified successfully
        </Text>
        <Button onClick={handleDone} color="green" data-testid="done-button">
          Done
        </Button>
      </Stack>
    </Center>
  );
};

export default TwoFactorSuccess;
