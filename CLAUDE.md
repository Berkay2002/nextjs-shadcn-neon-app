# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application built with TypeScript, using the App Router, shadcn/ui components, Tailwind CSS, and Neon PostgreSQL with Drizzle ORM. The project follows modern React patterns with server components and uses the "new-york" style variant for shadcn/ui.

## Development Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

## Database Commands

- `npm run db:generate` - Generate database migrations from schema changes
- `npm run db:migrate` - Apply pending migrations to the database
- `npm run db:studio` - Open Drizzle Studio for database management

## Architecture

### Database Layer
- **ORM**: Drizzle ORM with Neon PostgreSQL serverless driver
- **Configuration**: `drizzle.config.ts` points to schema at `src/lib/db/schema.ts`
- **Connection**: Database connection setup in `src/lib/db/index.ts`
- **Schema**: Uses `pgTable` with serial IDs, includes `users` and `posts` tables with foreign key relationships

### UI Components
- **shadcn/ui**: Configured with "new-york" style, CSS variables enabled
- **Path aliases**: `@/components`, `@/lib`, `@/hooks`, `@/components/ui` are configured
- **Icons**: Uses Lucide React for icons
- **Styling**: Tailwind CSS with neutral base color

### Environment Setup
Required environment variables (see `.env.example`):
- `DATABASE_URL` - Neon PostgreSQL connection string
- `NEXTAUTH_URL` - Application URL (for authentication if implemented)
- `NEXTAUTH_SECRET` - Secret key for authentication

## Adding shadcn/ui Components

Use the shadcn/ui CLI to add new components:
```bash
npx shadcn@latest add [component-name]
```

Components will be installed to `src/components/ui/` with proper TypeScript support and Tailwind integration.

## Database Workflow

1. Modify schema in `src/lib/db/schema.ts`
2. Generate migration: `npm run db:generate`
3. Apply migration: `npm run db:migrate`
4. Use Drizzle Studio for data inspection: `npm run db:studio`