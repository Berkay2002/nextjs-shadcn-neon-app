'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUserSafe } from '@/lib/stack';

export default function Header() {
  const user = useUserSafe();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              AI Generation Hub
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/generate/image"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Images
            </Link>
            <Link
              href="/generate/video"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Videos
            </Link>
            <Link
              href="/generate/music"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Music
            </Link>
            <Link
              href="/dashboard"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Dashboard
            </Link>
          </nav>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search or other features can go here */}
          </div>
          
          <nav className="flex items-center space-x-2">
            {user ? (
              <>
                <Button variant="ghost" size="sm">
                  {user.displayName || user.primaryEmail}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => user.signOut()}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/handler/sign-in">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/handler/sign-up">Sign Up</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}