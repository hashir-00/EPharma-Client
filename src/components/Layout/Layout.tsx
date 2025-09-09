import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary-light/10">
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;