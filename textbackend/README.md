# Blogify Backend

This is the Blogify backend built with Express and Prisma. Local development uses
SQLite by default, while production can run the same models against PostgreSQL
with a production `DATABASE_URL` and matching Prisma datasource provider.

See EXPLAIN.md for full documentation of models and endpoints.

Quick commands:

Install:

```bash
npm install
```

Configure environment:

```bash
cp .env.example .env
```

Use `DATABASE_URL="file:./dev.db"` for local SQLite. For production, use a
PostgreSQL URL such as `postgresql://user:password@host:5432/blogify?schema=public`
and run migrations against that environment.

Generate Prisma client and migrate:

```bash
npm run prisma:generate
npm run prisma:migrate
```

Seed:

```bash
npm run seed
```

Dev:

```bash
npm run dev
```

Feature verification:

```bash
node scripts/verify-new-features.js
```

The verification script starts the API on a temporary local port and checks the
new production CMS flows against Prisma: email verification, scheduled posts,
public visibility, nested comments, reactions, audit logs, and image
optimization.
