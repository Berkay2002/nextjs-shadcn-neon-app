'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { useUserSafe } from '@/lib/stack';

type NavItem = {
  title: string;
  href: string;
  description?: string;
};

const mainNavItems: NavItem[] = [
  { 
    title: 'Images', 
    href: '/generate/image',
    description: 'Generate stunning AI images from text prompts'
  },
  { 
    title: 'Videos', 
    href: '/generate/video',
    description: 'Create engaging AI-generated videos'
  },
  { 
    title: 'Music', 
    href: '/generate/music',
    description: 'Compose AI-generated music and soundtracks'
  },
  { 
    title: 'Dashboard', 
    href: '/dashboard',
    description: 'View your generation history and analytics'
  },
];

export default function Header() {
  // Always call hooks in the same order to prevent hook order violations
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useUserSafe();

  const UserSection = ({ isMobile = false }) => (
    <div className={`flex items-center gap-3 ${isMobile ? 'flex-col w-full' : ''}`}>
      {user ? (
        <>
          <Button variant="ghost" size="sm" className={`${isMobile ? 'w-full justify-start' : ''} px-3 py-2`}>
            <span className="truncate max-w-[120px]">
              {user.displayName || user.primaryEmail}
            </span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => user.signOut()}
            className={`${isMobile ? 'w-full' : ''} px-4 py-2`}
          >
            Sign Out
          </Button>
        </>
      ) : (
        <>
          <Button variant="ghost" size="sm" asChild className={`${isMobile ? 'w-full' : ''} px-4 py-2`}>
            <Link href="/handler/sign-in">Sign In</Link>
          </Button>
          <Button size="sm" asChild className={`${isMobile ? 'w-full' : ''} px-4 py-2`}>
            <Link href="/handler/sign-up">Sign Up</Link>
          </Button>
        </>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <img 
                src="/ai-hub-logo.png" 
                alt="AI Hub Logo" 
                className="h-8 w-auto"
              />
              <span className="hidden text-xl font-bold sm:inline-block">
                AI Generation Hub
              </span>
            </Link>
          </div>

          {/* Center - Desktop Navigation */}
          <div className="hidden md:flex items-center flex-1 justify-center max-w-2xl mx-8">
            <NavigationMenu>
              <NavigationMenuList className="space-x-2">
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-10 px-4 py-2 text-sm font-medium">
                    Generate
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[450px] gap-3 p-6 md:w-[550px] md:grid-cols-2 lg:w-[650px]">
                      {mainNavItems.slice(0, 3).map((item) => (
                        <ListItem
                          key={item.title}
                          title={item.title}
                          href={item.href}
                        >
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/dashboard" className="h-10 px-4 py-2 text-sm font-medium">
                      Dashboard
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        
          {/* Right side - User Section & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Desktop User Section */}
            <nav className="hidden md:flex">
              <UserSection />
            </nav>

            {/* Mobile Navigation */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm" className="h-10 w-10 px-0 hover:bg-accent">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] sm:w-[400px] px-6 py-6">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-center pb-4">
                    <Link 
                      href="/" 
                      className="flex items-center space-x-3"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <img 
                        src="/ai-hub-logo.png" 
                        alt="AI Hub Logo" 
                        className="h-8 w-auto"
                      />
                      <span className="text-xl font-bold">
                        AI Generation Hub
                      </span>
                    </Link>
                  </div>
                  
                  <Separator className="mb-6" />
                  
                  {/* Mobile Navigation */}
                  <nav className="flex flex-col space-y-2 flex-1">
                    <div className="text-sm font-semibold text-muted-foreground px-3 py-2 uppercase tracking-wider">
                      Generate
                    </div>
                    {mainNavItems.slice(0, 3).map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        className="flex flex-col gap-1 rounded-lg p-3 text-sm hover:bg-accent hover:text-accent-foreground transition-colors group"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="font-semibold group-hover:text-primary transition-colors">
                          {item.title}
                        </div>
                        <div className="text-muted-foreground text-xs leading-relaxed">
                          {item.description}
                        </div>
                      </Link>
                    ))}
                    
                    <Separator className="my-4" />
                    
                    <Link
                      href="/dashboard"
                      className="flex flex-col gap-1 rounded-lg p-3 text-sm hover:bg-accent hover:text-accent-foreground transition-colors group"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="font-semibold group-hover:text-primary transition-colors">
                        Dashboard
                      </div>
                      <div className="text-muted-foreground text-xs leading-relaxed">
                        View your generation history and analytics
                      </div>
                    </Link>
                  </nav>
                  
                  <Separator className="my-6" />
                  
                  {/* Mobile User Section */}
                  <div className="mt-auto">
                    <div className="text-sm font-semibold text-muted-foreground px-3 py-2 uppercase tracking-wider mb-3">
                      Account
                    </div>
                    <UserSection isMobile={true} />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link 
          href={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
