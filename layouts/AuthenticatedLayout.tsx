import React, { ReactNode } from 'react';

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  // TODO: Add authentication check
  return <div className="authenticated-layout">{children}</div>;
};

export default AuthenticatedLayout;
