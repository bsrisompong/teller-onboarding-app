'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { useDeleteSession, useSession } from '@/features/auth';

interface UseAuthGuardOptions {}

export const useAuthGuard = (props: UseAuthGuardOptions = {}) => {
  const router = useRouter();

  const { data: session, isLoading, isError, error } = useSession();
  const { mutate: deleteSession } = useDeleteSession();

  useEffect(() => {
    if (!isLoading && isError) {
      if (error instanceof Error && error.message === '401') {
        notifications.show({
          title: 'Session expired',
          message: 'Please login again',
          color: 'red',
        });
        router.push('/auth/login');
        deleteSession();
      }
    }
  }, [session, isLoading, router, error]);

  return {
    session,
    isLoading,
  };
};
