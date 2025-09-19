'use client';

import ClientHeader from './ClientHeader';

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <ClientHeader />
      {children}
    </div>
  );
}
