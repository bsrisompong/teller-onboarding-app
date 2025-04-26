import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import apiClient from '@/libs/api-client';
// types
import { GoogleAuthResponse, GoogleCallbackRequest, GoogleCallbackResponse } from '../types/api';

export const googleAuthApi = {
  /**
   * Initiates Google OAuth flow
   * @returns Promise with auth URL and session ID
   */
  initiate: async (): Promise<GoogleAuthResponse> => {
    const { data } = await apiClient.get<GoogleAuthResponse>('/auth/google');
    return data;
  },

  /**
   * Handles Google OAuth callback
   * @param params OAuth callback parameters
   * @returns Promise with session and user data
   */
  callback: async (params: GoogleCallbackRequest): Promise<GoogleCallbackResponse> => {
    const { data } = await apiClient.post<GoogleCallbackResponse>('/auth/callback', params);
    return data;
  },
};

export const useGoogleAuthMutation = () => {
  const { mutate: initiateAuth, isPending: isAuthLoading } = useMutation({
    mutationFn: googleAuthApi.initiate,
    onSuccess: (data) => {
      window.location.href = data.authUrl;
    },
    onError: () => {
      notifications.show({
        title: 'Authentication Error',
        message: 'Failed to initiate Google authentication',
        color: 'red',
      });
    },
  });

  return {
    initiateAuth,
    isAuthLoading,
  };
};
