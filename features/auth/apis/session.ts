import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '@/libs/api-client';
import { JWTPayload } from '@/libs/jwt';

export const sessionAPI = {
  get: async (): Promise<JWTPayload> => {
    const { data } = await apiClient.get<JWTPayload>('/auth/me');
    return data;
  },
  delete: async () => {
    await apiClient.delete('/auth/logout');
  },
};

export const useSession = (options?: UseQueryOptions<JWTPayload>) => {
  return useQuery({
    queryKey: ['session'],
    queryFn: sessionAPI.get,
    ...options,
  });
};

export const useDeleteSession = (options?: UseMutationOptions<void, Error, void>) => {
  return useMutation({
    mutationFn: sessionAPI.delete,
    ...options,
  });
};
