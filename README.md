# Next.js + shadcn/ui + Neon Database App

A modern full-stack application built with Next.js, TypeScript, shadcn/ui, Tailwind CSS, and Neon PostgreSQL database.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Neon PostgreSQL
- **ORM**: Drizzle ORM
- **Linting**: ESLint

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your Neon database URL and other required variables.

3. **Generate and run database migrations**:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   └── ui/             # shadcn/ui components
├── lib/                # Utility functions
│   ├── db/             # Database configuration
│   │   ├── index.ts    # Database connection
│   │   └── schema.ts   # Database schema
│   └── utils.ts        # Utility functions
├── types/              # TypeScript type definitions
└── hooks/              # Custom React hooks
```

## Database

The project uses Neon PostgreSQL with Drizzle ORM. The database schema is defined in `src/lib/db/schema.ts` and includes:

- **users** table - User management
- **posts** table - Example posts (with user relationship)

## Adding shadcn/ui Components

Add new components using the shadcn/ui CLI:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add form
```

## Deployment

This app can be deployed to Vercel, Netlify, or any platform that supports Next.js applications. Make sure to set up your environment variables in your deployment platform.
