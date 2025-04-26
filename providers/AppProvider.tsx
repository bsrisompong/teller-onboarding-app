'use client';

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
// lib
import { queryClient } from '@/libs/react-query';
// theme
import { cssVariableResolver, theme } from '@/theme';

type AppProviderProps = {
  children: React.ReactNode;
};

const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <MantineProvider theme={theme} cssVariablesResolver={cssVariableResolver}>
      <ModalsProvider>
        <QueryClientProvider client={queryClient}>
          <Notifications />
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ModalsProvider>
    </MantineProvider>
  );
};

export default AppProvider;
