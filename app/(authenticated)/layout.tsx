import React, { ReactNode } from 'react';
import AuthenticatedLayout from '../../layouts/AuthenticatedLayout';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
};

export default Layout;
