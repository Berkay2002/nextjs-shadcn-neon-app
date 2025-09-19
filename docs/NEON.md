Here’s a **NEON.md** file for your project, defining all **protocols**, **rules**, and best practices for safely and effectively integrating Neon Postgres (serverless, scalable Postgres) with your Next.js + TypeScript + AI app stack.

***

# NEON.md

## Project: AI Generation Hub

**Database: Neon Serverless Postgres**
**Frameworks: Next.js, Prisma, TypeScript**

***

## 1. **Purpose**

Centralize protocols, rules, and guidance for using Neon Postgres for user data, media metadata, app analytics, and AI usage within this monorepo. Ensures security, performance, and maintainability in your data layer.

***

## 2. **Integration and ORM**

- Use **Prisma** as the default ORM and schema migration tool.
    - Schema files in `/prisma/schema.prisma`
    - Generate client with `npx prisma generate`
- Connection string stored as `DATABASE_URL` in `.env.local`; **never commit your real DB URI**.

***

## 3. **Schema Management**

- All schema changes must go through `prisma migrate dev` or `prisma migrate deploy`, never raw SQL in production.
- Document schema changes in `/prisma/CHANGELOG.md` with migration reasons and date.
- Always use **UUID** (e.g. `@id @default(uuid())`) for primary keys unless a strong reason for incremental IDs.

***

## 4. **Development \& Deployment**

- Use Neon’s branch/branch preview features for PR-based dev/test DBs.
- **Never run destructive migrations on production without a backup.**
- Set up a “shadow” database for running migrations in CI (see Prisma docs).
- Production credentials should be stored in your secrets manager or deployment config (NOT checked-in).

***

## 5. **Data Modeling Rules**

- **Separate tables for users, generations, media, audit logs.**
- Media table stores metadata only (not raw files/base64!), just pointer/URI/cloud reference.
- Store all relevant Gemini/VEO/Lyria usage, costs, and per-request audit logs in `usage_logs` table.
- For API usage quotas, store totals and timestamps for each user.
- Sensitive fields (emails, IP addresses, OAuth tokens) must be encrypted at rest.

***

## 6. **Data Access \& Code Structure**

- All queries must use Prisma Client (no raw SQL unless strictly necessary).
- Abstract queries and mutations (e.g., `/src/lib/db/` or `/src/server/db/queries.ts`) for maintainability.
- Data validation at API input boundary (Zod, Yup, or similar, never trust direct user input).

***

## 7. **Security \& Privacy**

- Enforce *principle of least privilege*: restrict db user permissions in Neon to only what the app requires.
- NEVER log or expose raw API keys, passwords, or access tokens in logs or the database.
- Delete or anonymize dormant user data in line with your privacy policy or regulatory requirements.

***

## 8. **Backups \& Rollbacks**

- Neon provides automated daily backups (see Dashboard).
- Document manual backup protocol for critical migration events.
- Practice rollback with staging snapshots before running in production.

***

## 9. **Performance**

- Use appropriate indexes for all user, lookup, and analytics queries.
- Monitor slow queries and add `EXPLAIN ANALYZE` results to `/prisma/query-perf.md` if tuning is needed.
- Use connection pooling (Neon provides serverless pooling endpoints) for Next.js API routes.

***

## 10. **Cost Management**

- Use Neon’s free tier/branch previews for non-production work; monitor usage to avoid surprise overages.
- Periodically review unused branches, drop old preview environments.

***

## 11. **Observability**

- Enable query logging in Neon for all long-running requests.
- Integrate alert/metrics (e.g. via Neon’s dashboard or a third party) for dropped connections, spikes in read/write errors, or pool exhaustion.

***

## 12. **Documentation and Onboarding**

- New team members must read:
    - [Neon Docs](https://neon.tech/docs/introduction)
    - [Prisma Docs](https://www.prisma.io/docs)
    - This file!
- Provide `/docs/DB_USAGE.md` for example CRUD/database-access patterns.
- Audit schema and queries quarterly or before major releases.

***

## 13. **Extras \& Automation**

- PRs that touch `/prisma/schema.prisma` MUST describe intended data change.
- Set up GitHub Actions or similar to run `prisma db push` or `prisma migrate deploy` on automatic deploy, after running tests.
- Agree on review protocol for schema changes in standup or via Issue thread.

***

_Last updated: 2025-09-19_

***

If you want a **starter Prisma schema**, a sample onboarding doc, or a migration README, just ask!

