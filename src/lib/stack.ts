'use client';

import { useUser, useStackApp } from '@stackframe/stack';

// Re-export Stack hooks for easier imports
export { useUser, useStackApp } from '@stackframe/stack';

// Additional Stack utilities
export type { User } from '@stackframe/stack';

// Helper function to check if user is authenticated
export function useIsAuthenticated() {
  const user = useUser();
  return !!user;
}

// Helper function to get user display name
export function useUserDisplayName() {
  const user = useUser();
  return user?.displayName || user?.primaryEmail || 'User';
}
