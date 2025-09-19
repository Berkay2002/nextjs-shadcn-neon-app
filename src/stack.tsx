import "server-only";

import { StackServerApp } from "@stackframe/stack";

// Check if we're in a build environment
const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL;

export const stackServerApp = (() => {
  // Don't initialize Stack during build time if env vars are missing
  if (isBuildTime || !process.env.NEXT_PUBLIC_STACK_PROJECT_ID) {
    // For build time, we need to return a valid app instance but it won't be functional
    console.warn('Stack environment variables not configured. Using mock configuration.');
    return null;
  }

  try {
    return new StackServerApp({
      tokenStore: "nextjs-cookie",
    });
  } catch (error) {
    console.error('Failed to initialize Stack server app:', error);
    return null;
  }
})();
