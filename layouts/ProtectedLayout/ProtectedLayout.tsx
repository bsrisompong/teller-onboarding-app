'use client';

import React, { ReactNode } from 'react';
import { AppShell, Container } from '@mantine/core';
import { Header } from '@/components/Header';
import { useAuthGuard } from '@/features/auth';

interface ProtectedLayoutProps {
  children: ReactNode;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  const { session, isLoading } = useAuthGuard();

  if (isLoading) return <div>Loading...</div>;
  if (!session) return null; // Or a session expired message

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 0, breakpoint: 'sm', collapsed: { mobile: true } }}
      className="protected-layout"
      padding="md"
    >
      <Header />
      <AppShell.Main>
        <Container>{children}</Container>
      </AppShell.Main>
    </AppShell>
  );
};

export default ProtectedLayout;
