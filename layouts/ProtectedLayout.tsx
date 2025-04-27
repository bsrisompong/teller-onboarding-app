'use client';

import React, { ReactNode } from 'react';
import { useAuthGuard } from '@/features/auth';

interface ProtectedLayoutProps {
  children: ReactNode;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  const { session, isLoading } = useAuthGuard();

  if (isLoading) return <div>Loading...</div>;
  if (!session) return null; // Or a session expired message

  return <div className="Protected-layout">{children}</div>;
};

export default ProtectedLayout;
