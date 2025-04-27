import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '@/libs/api-client';
import { JWTPayload } from '@/libs/jwt';

export type SessionData = Pick<JWTPayload, 'userId' | 'email' | 'name' | 'picture' | 'type'>;

export const sessionAPI = {
  get: async (): Promise<JWTPayload> => {
    const { data } = await apiClient.get<JWTPayload>('/auth/me');
    return data;
  },
  logout: async () => {
    await apiClient.post('/auth/logout');
  },
};

export const useGetSession = (options?: UseQueryOptions<SessionData>) => {
  return useQuery({
    queryKey: ['session'],
    queryFn: sessionAPI.get,
    ...options,
  });
};

export const useDeleteSession = (options?: UseMutationOptions<void, Error, void>) => {
  return useMutation({
    mutationFn: sessionAPI.logout,
    ...options,
  });
};
