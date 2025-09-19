import "server-only";

import { StackServerApp } from "@stackframe/stack";

// Check if we're in a build environment
const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL;

export const stackServerApp = (() => {
  // Check for required environment variables
  const hasRequiredEnvVars = process.env.NEXT_PUBLIC_STACK_PROJECT_ID &&
                            process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY &&
                            process.env.STACK_SECRET_SERVER_KEY;

  // Don't initialize Stack during build time if env vars are missing
  if (isBuildTime || !hasRequiredEnvVars) {
    if (!hasRequiredEnvVars) {
      console.warn('Stack environment variables not configured. Missing required variables.');
      console.warn('Required: NEXT_PUBLIC_STACK_PROJECT_ID, NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY, STACK_SECRET_SERVER_KEY');
    } else {
      console.warn('Stack environment variables not configured. Using mock configuration.');
    }
    return null;
  }

  try {
    return new StackServerApp({
      tokenStore: "nextjs-cookie",
      urls: {
        signIn: '/handler/sign-in',
        signUp: '/handler/sign-up',
        afterSignIn: '/',
        afterSignUp: '/',
      }
    });
  } catch (error) {
    console.error('Failed to initialize Stack server app:', error);
    return null;
  }
})();
