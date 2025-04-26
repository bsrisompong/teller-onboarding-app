import React, { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { Container } from '@mantine/core';

interface PublicLayoutProps {
  children: ReactNode;
}

const PublicLayout = async ({ children }: PublicLayoutProps) => {
  // TODO: Implement actual authentication check
  const isAuthenticated = false; // This should be replaced with actual auth check

  if (isAuthenticated) {
    redirect('/customer-info');
  }

  return <Container size="xl">{children}</Container>;
};

export default PublicLayout;
