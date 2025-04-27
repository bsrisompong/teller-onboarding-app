import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '@/libs/api-client';
import { JWTPayload } from '@/libs/jwt';

export const sessionAPI = {
  get: async (): Promise<JWTPayload> => {
    const { data } = await apiClient.get<JWTPayload>('/auth/me');
    return data;
  },
};

export const useSession = (options?: UseQueryOptions<JWTPayload>) => {
  return useQuery({
    queryKey: ['session'],
    queryFn: sessionAPI.get,
    ...options,
  });
};
