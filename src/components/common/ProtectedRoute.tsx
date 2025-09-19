'use client';

import { useUserSafe } from '@/lib/stack';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  fallbackMessage?: string;
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true,
  fallbackMessage = "Please sign in to access this feature" 
}: ProtectedRouteProps) {
  const user = useUserSafe();

  // If authentication is not required, always render children
  if (!requireAuth) {
    return <>{children}</>;
  }

  // If user is authenticated, render children
  if (user) {
    return <>{children}</>;
  }

  // If not authenticated, show sign-in prompt
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Authentication Required</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            {fallbackMessage}
          </p>
          <div className="flex gap-2 justify-center">
            <Button asChild>
              <Link href="/handler/sign-in">Sign In</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/handler/sign-up">Sign Up</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}