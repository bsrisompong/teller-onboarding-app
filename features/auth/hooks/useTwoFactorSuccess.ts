'use client';

import { useRouter } from 'next/navigation';
import { useTimeout } from '@mantine/hooks';

interface UseTwoFactorSuccessOptions {
  onSuccess?: () => void;
  redirectDelay?: number;
}

export const useTwoFactorSuccess = ({
  onSuccess,
  redirectDelay = 3 * 1000, // 3 seconds default
}: UseTwoFactorSuccessOptions = {}) => {
  const router = useRouter();

  const { start } = useTimeout(() => {
    onSuccess?.();
    router.replace('/');
  }, redirectDelay);

  return {
    startRedirect: start,
  };
};
