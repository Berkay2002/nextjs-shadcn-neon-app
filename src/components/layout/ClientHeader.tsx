'use client';

import dynamic from 'next/dynamic';

// Dynamically import Header with no SSR to avoid Stack Auth Suspense issues
const Header = dynamic(() => import('./Header'), { 
  ssr: false,
  loading: () => (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <div className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              AI Generation Hub
            </span>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none"></div>
          <nav className="flex items-center space-x-2">
            <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
            <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
          </nav>
        </div>
      </div>
    </header>
  )
});

export default function ClientHeader() {
  return <Header />;
}