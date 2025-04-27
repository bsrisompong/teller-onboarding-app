import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
// libs
import apiClient from '@/libs/api-client';
// types
import { CreateAppicationPayload, CreateApplicationResponse } from '../types';

const applicationApi = {
  create: async (data: CreateAppicationPayload): Promise<CreateApplicationResponse> => {
    const response = await apiClient.post('/application/create', data);
    return response?.data;
  },
};

export const useApplicationMutation = (
  options?: UseMutationOptions<CreateApplicationResponse, Error, CreateAppicationPayload>
): UseMutationResult<CreateApplicationResponse, Error, CreateAppicationPayload> => {
  return useMutation({
    mutationFn: applicationApi.create,
    ...options,
    onError: (error, variables, context) => {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      });
    },
  });
};
