import "server-only";

import { StackServerApp } from "@stackframe/stack";

function createStackServerApp() {
  // Check if we're in build mode or missing required env vars
  if (!process.env.NEXT_PUBLIC_STACK_PROJECT_ID) {
    // Return null for build time when env vars aren't available
    return null;
  }

  return new StackServerApp({
    tokenStore: "nextjs-cookie",
  });
}

export const stackServerApp = createStackServerApp();
