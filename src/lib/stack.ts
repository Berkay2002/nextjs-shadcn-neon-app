'use client';

import { useUser } from '@stackframe/stack';

// Re-export Stack hooks for easier imports with error handling
export function useUserSafe() {
  try {
    return useUser();
  } catch {
    // During build time or when Stack isn't properly initialized
    // Silently handle the error to avoid console spam during build
    return null;
  }
}

// Keep the original export for compatibility
export { useUser } from '@stackframe/stack';

// Additional Stack utilities
export type { User } from '@stackframe/stack';

// Helper function to check if user is authenticated
export function useIsAuthenticated() {
  const user = useUserSafe();
  return !!user;
}

// Helper function to get user display name
export function useUserDisplayName() {
  const user = useUserSafe();
  return user?.displayName || user?.primaryEmail || 'User';
}
