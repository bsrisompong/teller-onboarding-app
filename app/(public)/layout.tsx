import React, { ReactNode } from 'react';
import PublicLayout from '@/layouts/PublicLayout';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return <PublicLayout>{children}</PublicLayout>;
};

export default Layout;
