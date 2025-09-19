import { type ServerUser } from '@stackframe/stack';
import { stackServerApp } from '../../stack';
import { createUserWithQuotas } from '../db/helpers';
import { headers } from 'next/headers';

// Get authenticated user from Stack Auth
export async function getAuthenticatedUser() {
  try {
    if (!stackServerApp) {
      console.warn('Stack server app not initialized');
      return null;
    }
    const user = await stackServerApp.getUser();
    return user;
  } catch (error) {
    console.error('Error getting authenticated user:', error);
    return null;
  }
}

// Ensure user exists in our database with proper setup
export async function ensureUserInDatabase(stackUser: ServerUser) {
  try {
    if (!stackUser || !stackUser.id) {
      throw new Error('Invalid user object');
    }

    // Create or update user in our database with default quotas
    const user = await createUserWithQuotas(
      stackUser.id,
      stackUser.primaryEmail || stackUser.serverMetadata?.email || 'unknown@example.com',
      stackUser.displayName || stackUser.serverMetadata?.name
    );

    return user;
  } catch (error) {
    console.error('Error ensuring user in database:', error);
    throw error;
  }
}

// Middleware function to verify authentication and set up user
export async function withAuth<T>(
  handler: (user: ServerUser, ...args: unknown[]) => Promise<T>
) {
  return async (...args: unknown[]): Promise<T> => {
    const stackUser = await getAuthenticatedUser();
    
    if (!stackUser) {
      throw new Error('User not authenticated');
    }

    // Ensure user exists in our database
    await ensureUserInDatabase(stackUser);
    
    return handler(stackUser, ...args);
  };
}

// API route helper for authentication
export async function withAuthApi(_request?: Request) {
  const stackUser = await getAuthenticatedUser();
  
  if (!stackUser) {
    return new Response(
      JSON.stringify({ error: 'Authentication required' }), 
      { 
        status: 401, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }

  // Ensure user exists in database
  await ensureUserInDatabase(stackUser);
  
  return stackUser;
}

// Get user IP address from request headers
export async function getUserIP(): Promise<string | undefined> {
  const headersList = await headers();
  const forwarded = headersList.get('x-forwarded-for');
  const realIP = headersList.get('x-real-ip');
  const connectingIP = headersList.get('cf-connecting-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP.trim();
  }

  if (connectingIP) {
    return connectingIP.trim();
  }

  return undefined;
}

// Get user agent from request headers
export async function getUserAgent(): Promise<string | undefined> {
  const headersList = await headers();
  return headersList.get('user-agent') || undefined;
}