import React, { ReactNode } from 'react';

interface ProtectedLayoutProps {
  children: ReactNode;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  return <div className="Protected-layout">{children}</div>;
};

export default ProtectedLayout;
