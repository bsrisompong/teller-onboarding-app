'use client';

import { ReactNode } from 'react';
import { MSWDevTools } from 'msw-devtools';
import { IS_DEVELOPMENT } from '@/config/constants';
import { db, handlers } from '@/testing/mocks';

import '@/testing/mocks/initialize';

export type MSWWrapperProps = {
  children: ReactNode;
};

export const MSWWrapper = ({ children }: MSWWrapperProps) => {
  return (
    <>
      {IS_DEVELOPMENT && <MSWDevTools db={db} handlers={handlers} />}
      {children}
    </>
  );
};
