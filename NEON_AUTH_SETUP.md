# Neon Auth Setup Instructions

This project is configured to use **Neon Auth** (Stack) for authentication. Follow these steps to complete the setup:

## 1. Install Neon Auth

Run the setup wizard to install and configure Neon Auth:

```bash
npx @stackframe/init-stack@latest --no-browser
```

This command will:
- Install the necessary Stack dependencies
- Set up auth routes automatically for Next.js (App Router)
- Create layout wrappers and handlers
- Generate the required configuration files

## 2. Get Your Neon Auth Keys

1. Go to the [Stack Dashboard](https://stack-auth.com/dashboard)
2. Create a new project or select your existing project
3. Copy the following environment variables from your project settings:
   - `NEXT_PUBLIC_STACK_PROJECT_ID`
   - `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`
   - `STACK_SECRET_SERVER_KEY`

## 3. Configure Environment Variables

Update your `.env.local` file with the keys from Step 2:

```env
# Neon Auth environment variables for Next.js
NEXT_PUBLIC_STACK_PROJECT_ID="your-neon-auth-project-id"
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="your-neon-auth-publishable-key"
STACK_SECRET_SERVER_KEY="your-neon-auth-secret-key"

# Your Neon connection string (for user data storage)
DATABASE_URL="your-neon-connection-string"
```

## 4. Test Your Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the authentication pages:
   - Sign up: [http://localhost:3000/handler/sign-up](http://localhost:3000/handler/sign-up)
   - Sign in: [http://localhost:3000/handler/sign-in](http://localhost:3000/handler/sign-in)

3. Create a test user to verify the setup is working correctly.

## 5. Database Integration

Users created through Neon Auth will automatically appear in your Neon Postgres database. You can query them directly using your database client or through your application code.

## 6. Update Components

After setup, update the following components to integrate with the actual Neon Auth state:

1. **Header Component** (`src/components/layout/Header.tsx`):
   - Replace the placeholder user state with actual Stack user state
   - Import and use Stack's authentication hooks

2. **Auth Pages** (if needed):
   - Customize the default auth pages in your `src/app/(auth)/` directory
   - The Stack setup wizard should handle most of this automatically

## 7. Required Dependencies

After running the setup wizard, ensure these dependencies are installed:

```json
{
  "@stackframe/stack": "latest",
  "@stackframe/stack-shared": "latest"
}
```

## Next Steps

Once Neon Auth is configured:

1. **Integrate with components**: Update the Header and other components to use real authentication state
2. **Set up protected routes**: Add authentication checks to generation pages
3. **User data**: Connect user accounts with generation history and usage tracking
4. **Database schema**: Update your database schema to include user-related tables

## Troubleshooting

- **Environment variables not working**: Make sure to restart your development server after updating `.env.local`
- **Auth routes not found**: Ensure the setup wizard completed successfully and created the handler routes
- **Database connection issues**: Verify your Neon connection string is correct and the database is accessible

For more detailed documentation, refer to:
- [Neon Auth Documentation](https://docs.neon.auth.com/)
- [Stack Framework Docs](https://docs.stack-auth.com/)