import React, { ReactNode } from 'react';
import { ProtectedLayout } from '@/layouts/ProtectedLayout';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <ProtectedLayout>{children}</ProtectedLayout>;
};

export default Layout;
