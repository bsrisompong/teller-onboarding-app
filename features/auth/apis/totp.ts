import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
// libs
import apiClient from '@/libs/api-client';
import { queryClient } from '@/libs/react-query';
// types
import { TotpGenerateResponse, TotpVerifyResponse } from '../types';

export const totpAPI = {
  /**
   * Generates a new TOTP secret and returns a QR code URI for setting up 2FA.
   * The URI can be used to generate a QR code that users can scan with their authenticator app.
   *
   * @returns {Promise<{ uri: string }>} A promise that resolves to an object containing the QR code URI
   * @throws {Error} If the API request fails
   */
  generate: async (): Promise<TotpGenerateResponse> => {
    const { data } = await apiClient.post<TotpGenerateResponse>('/auth/totp/generate');
    return data;
  },

  /**
   * Verifies a TOTP code submitted by the user.
   * This is used to confirm that the user has successfully set up their authenticator app
   * or to authenticate during the 2FA process.
   *
   * @param {string} code - The 6-digit TOTP code from the user's authenticator app
   * @returns {Promise<{ success: boolean }>} A promise that resolves to an object indicating whether the code was valid
   * @throws {Error} If the API request fails
   */
  verify: async (code: string): Promise<TotpVerifyResponse> => {
    const { data } = await apiClient.post<TotpVerifyResponse>('/auth/totp/verify', { code });
    return data;
  },
};

export const useGenerateTOTP = (
  options?: Omit<UseQueryOptions<TotpGenerateResponse>, 'queryKey' | 'queryFn'>
) => {
  const queryResult = useQuery({
    queryKey: ['totp'],
    queryFn: totpAPI.generate,
    ...options,
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return { ...queryResult };
};

export const useVerifyTOTP = (options?: UseMutationOptions<TotpVerifyResponse>) => {
  const { mutateAsync: verifyTOTP, isPending: isVerifying } = useMutation({
    mutationKey: ['verify-totp'],
    mutationFn: totpAPI.verify,
    onSuccess: (res) => {
      notifications.show({
        title: 'Success',
        message: '2FA verification successful',
        color: 'green',
      });
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'Invalid code. Please try again.',
        color: 'red',
      });
      // refresh session
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
  });

  return {
    verifyTOTP,
    isVerifying,
  };
};
