import { GoogleAuth } from 'google-auth-library';

/**
 * Creates a GoogleAuth instance using credentials from environment variables.
 * Supports both file path (legacy) and JSON string (for deployment) formats.
 */
export function createGoogleAuth(): GoogleAuth {
  const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (!credentials) {
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS environment variable is required');
  }

  // Check if credentials is a JSON string or file path
  if (credentials.startsWith('{')) {
    // Parse as JSON string (for Vercel deployment)
    try {
      const serviceAccountKey = JSON.parse(credentials);
      return new GoogleAuth({
        credentials: serviceAccountKey,
        scopes: [
          'https://www.googleapis.com/auth/cloud-platform',
          'https://www.googleapis.com/auth/generative-language'
        ]
      });
    } catch (error) {
      throw new Error('Failed to parse GOOGLE_APPLICATION_CREDENTIALS as JSON: ' +
        (error instanceof Error ? error.message : 'Unknown error'));
    }
  } else {
    // Treat as file path (for local development)
    return new GoogleAuth({
      keyFile: credentials,
      scopes: [
        'https://www.googleapis.com/auth/cloud-platform',
        'https://www.googleapis.com/auth/generative-language'
      ]
    });
  }
}

/**
 * Gets the project ID from the Google Auth configuration or environment variable
 */
export async function getProjectId(): Promise<string> {
  // First try to get from environment variable (more reliable for deployment)
  const envProjectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
  if (envProjectId) {
    return envProjectId;
  }

  // Fallback to extracting from auth credentials
  const auth = createGoogleAuth();
  const projectId = await auth.getProjectId();

  if (!projectId) {
    throw new Error('Unable to determine Google Cloud project ID from credentials or environment');
  }

  return projectId;
}

/**
 * Gets the Google Cloud location from environment variable
 */
export function getCloudLocation(): string {
  const location = process.env.GOOGLE_CLOUD_LOCATION;
  if (!location) {
    throw new Error('GOOGLE_CLOUD_LOCATION environment variable is required');
  }
  return location;
}