# EXPLAIN - Blogify Backend

This document explains models, relations, endpoints, how to run, env variables, structure and common errors.

## Models & Relations

- `User` - primary user model. Relations: `role`, `posts`, `comments`, `media`, `refreshTokens`. Soft-delete with `deletedAt`.
- `Role` - roles like `Admin`, `Author`, `Reader`. One-to-many with `User`.
- `Post` - blog posts. Fields: `title`, `slug`, `content`, `excerpt`, `status`. Relations: `author` (User), `categories` (Category[]), `tags` (Tag[]), `comments`.
- `Category` - categories with `name` and `slug`. Many-to-many with `Post` (via implicit relation).
- `Tag` - tags for posts. Many-to-many with `Post`.
- `Comment` - comments referencing `post` and `author`.
  - Note: `Comment` now includes `approved` boolean (default false) to support moderation.
- `Page` - static pages with `title`, `slug`, `content`.
- `Media` - uploaded files metadata: `filename`, `filepath`, `mimetype`, `size`, optional dimensions, `uploader`.
- `Setting` - key/value pairs for site settings.
- `NewsletterSubscriber` - subscriber emails.
- `RefreshToken` - store refresh tokens with `token`, `userId`, `revoked`, `expiresAt`.
- `Audit` - audit log entries.

## Key Endpoints (method, path, auth)

- POST /api/auth/register - register user. Body: `{ email, username, password, name? }`. Returns `access` and `refresh` tokens.
- POST /api/auth/login - login. Body: `{ email, password }`. Returns `access` and `refresh`.
- POST /api/auth/refresh - refresh access token. Body: `{ refresh }`. Returns new `access`.
- POST /api/auth/logout - revoke refresh. Body: `{ refresh }`.

- GET /api/posts - list posts. Query: `page`, `perPage`, `q` (search). Public.
- GET /api/posts/:slug - get post by slug. Public.
- POST /api/posts - create post. Auth: `Author|Admin`. Body: `{ title, content, excerpt?, status?, categories?: [id], tags?: [id] }`.
- PUT /api/posts/:id - update post. Auth: `Author|Admin`.
- DELETE /api/posts/:id - soft-delete post. Auth: `Author|Admin`.

- GET /api/categories - list categories.
- POST /api/categories - create category. Auth: `Author|Admin`.

- POST /api/media - upload file (`multipart/form-data`, field `file`). Auth required. Stores file under `uploads/` and creates Media record.
- GET /api/media - list media.
 - DELETE /api/media/:id - delete media (Admin/Author). Removes DB record and attempts to unlink file on disk. Implements spec #10.

- GET /api/users - list users. Auth: `Admin`.
- GET /api/users/me - current user (requires access token).
 - POST /api/users/:id/disable - disable user (Admin only).
 - POST /api/users/:id/activate - activate user (Admin only).
  Note: `User` now includes `disabled` boolean to support enable/disable (spec #13).

- GET /api/dashboard/stats - Admin-only stats: counts of users/posts/categories/comments/media/tags.

Comments moderation:
- POST /api/comments/:id/approve - Admin/Author: approve a comment (sets `approved=true`).
- POST /api/comments/:id/reject - Admin/Author: reject (soft-delete) a comment.

Newsletter subscribers:
- POST /api/newsletter/subscribe - subscribe (public).
- GET /api/newsletter/subscribers - list subscribers (Admin only).
- DELETE /api/newsletter/subscribers/:id - remove subscriber (Admin only).

Responses follow a consistent shape:

```
{ success: true|false, data: ..., error: ... }
```

## Validation rules

- All request bodies, query params and route params use Zod validation.
- `email` fields: must be valid email and max 254 chars.
- `username`: 3-32 chars, only alphanumeric, `_` and `-`.
- `password`: min 8, max 128.
- `title` (posts/pages): 1-300 chars for posts, 1-200 for pages.
- `content`: required, sanitized HTML, max length enforced where appropriate.
- `excerpt`: max 512 chars.
- `status`: enum `DRAFT|PUBLISHED|ARCHIVED`.
- UUID route params: validated via Zod `.uuid()`.
- `slug` params: must match /^[a-z0-9\-]+$/.

OpenAPI spec: see `openapi.yaml` at project root.
Postman collection: see `postman_collection.json` at project root.

I updated the OpenAPI spec to include all routes (auth, users, posts, categories, tags, comments, pages, media, newsletter, dashboard, settings) and added corresponding schemas. The provided `postman_collection.json` includes a pre-request script to inject the `accessToken` environment variable into the `Authorization` header for authenticated requests. Use the `Login` request to obtain tokens and set `accessToken` in your Postman environment.

## How to run

1. Copy `.env.example` to `.env` and fill `DATABASE_URL`, JWT secrets.
2. Install dependencies: `npm install`.
3. Generate Prisma client: `npm run prisma:generate`.
4. Run migrations: `npm run prisma:migrate`.
5. Seed admin user: `npm run seed`.
6. Start dev server: `npm run dev` or production `npm start`.

## Environment variables

- `DATABASE_URL` - Postgres connection string.
- `PORT` - server port (default 4000).
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` - secrets for tokens.
- `JWT_ACCESS_EXP`, `JWT_REFRESH_EXP` - optional token expirations.
- `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` - seed admin credentials.
 - `CORS_ORIGINS` - comma-separated allowed origins for CORS (e.g. `http://localhost:5173`).
 - `MAX_UPLOAD_SIZE` - max upload file size in bytes (default `5242880` = 5MB).

## Project structure

textbackend/
- prisma/schema.prisma - Prisma models
- prisma/seed.js - seed script
- src/
  - config/ (reserved)
  - controllers/ - controllers for resources
  - middlewares/ - auth, validation, error handler
  - routes/ - express routes
  - utils/ - prisma client, jwt helpers, slug generator
  - server.js - express entry
- uploads/ - static uploads

## Common errors & fixes

- "Database connection error": ensure `DATABASE_URL` is correct and Postgres is running.
- "prisma migrate" fails: run `npx prisma generate` then `npx prisma migrate dev --name init`.
- JWT verify errors: ensure secrets match and tokens haven't expired.
- File upload permission errors: ensure `uploads/` exists and is writable by the process.
