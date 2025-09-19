## Prisma Schema Additions

```prisma
model User {
  id              String      @id @default(uuid())
  email           String      @unique
  name            String?
  generations     Generation[]
  usage           UserUsage[]
  auditLogs       AuditLog[]
  quotas          Quota[]
  createdAt       DateTime    @default(now())
}

model Quota {
  id              String      @id @default(uuid())
  user            User        @relation(fields: [userId], references: [id])
  userId          String
  generationType  GenerationType
  dailyLimit      Int         // Ex: 10 images/day
  monthlyLimit    Int         // Ex: 250 images/month
  dailyUsed       Int         @default(0)
  monthlyUsed     Int         @default(0)
  lastReset       DateTime    @default(now())
  createdAt       DateTime    @default(now())
}

model Generation {
  id              String           @id @default(uuid())
  user            User             @relation(fields: [userId], references: [id])
  userId          String
  type            GenerationType
  prompt          String
  outputUri       String?
  status          GenerationStatus
  error           String?
  createdAt       DateTime         @default(now())
  cost            Float?           // Virtual USD or tokens
}

model UserUsage {
  id              String           @id @default(uuid())
  user            User             @relation(fields: [userId], references: [id])
  userId          String
  type            GenerationType
  count           Int              @default(0)
  lastUsed        DateTime
}

model AuditLog {
  id              String           @id @default(uuid())
  user            User?            @relation(fields: [userId], references: [id])
  userId          String?
  action          String
  input           String
  status          String
  createdAt       DateTime         @default(now())
  ip              String?
  system          String?
}

enum GenerationType {
  IMAGE
  VIDEO
  MUSIC
}

enum GenerationStatus {
  SUCCESS
  FAILED
}
```


***

## Protocols for Quotas and Cost Tracking

**1. Default Quota Assignment:**

- On user signup, assign a `Quota` row for each applicable `GenerationType` with reasonable defaults (e.g. 10 image, 2 video, 3 music generations per day).
- Optionally, set higher quotas for trusted/test users (admin override).

**2. On Each Generation Attempt:**

- Check `Quota.dailyUsed < Quota.dailyLimit` AND `Quota.monthlyUsed < Quota.monthlyLimit`.
- If limits would be exceeded, abort the generation and return a clear error to the user.
- On success, increment `dailyUsed` and `monthlyUsed`, update `lastUsed`.

**3. Reset Quotas:**

- Use scheduled jobs (e.g. on server at midnight UTC) to reset `dailyUsed` and, on first of month, `monthlyUsed`.
- Update `lastReset` field accordingly.

**4. Virtual Cost Tracking:**

- Each successful Generation can optionally write the API call's cost (if available from Google pricing) or “tokens used” to the `cost` field.
- Allows you to display “You have used \$X value of compute” or just see cost distribution in analytics.

**5. Transparency:**

- On the frontend, expose quota info and remaining daily/monthly quota to authenticated users.
- Always show a user-friendly message when a quota/cost threshold is hit.

**6. Analytics and Monitoring:**

- Query the usage/cost data for trend charts (“usage per type this month”, “top users”, “approaching limits”).
- Proactively alert yourself (via dashboard/email) if aggregate usage is on-track to burn all your Google Credits early!

***

## Why This Structure?

- **Scalable:** Easily adapt for billing in the future
- **Safe:** Prevents runaway spend on your cloud account
- **Auditable:** Supports analytics, dashboards, trend monitoring, and user transparency
- **Fair:** Enforces equity if lots of users start using your app

***

**TL;DR:**
Track quotas and costs even if purely for your own control—future-proofs your stack, enables transparency, and is trivial to implement with Prisma/Neon. Adjust limit values as you learn about your users and usage patterns!

If you want a sample all-in-one SQL migration, onboarding scripts, or quota scheduling pseudo code, just say the word!

