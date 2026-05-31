# EXPLAIN - Blogify Backend

This document explains models, relations, endpoints, how to run, env variables, structure and common errors.

## Models & Relations

- `User` - primary user model. Relations: `role`, `posts`, `comments`, `commentReactions`, `postReactions`, `media`, `refreshTokens`, `writerApplications`, `passwordResetTokens`, `auditLogs`. New signups are `Reader` accounts with `emailVerified=false` until the verification token is confirmed.
- `Role` - roles like `Admin`, `Author`, `Reader`. One-to-many with `User`.
- `Post` - blog posts. Fields: `title`, `slug`, rich HTML `content`, `excerpt`, `status`, `scheduledAt`, `isScheduled`, `metaTitle`, `metaDescription`, `ogImage`. Relations: `author` (User), `categories` (Category[]), `tags` (Tag[]), `comments`, optional `media`.
- `Category` - categories with `name` and `slug`. Many-to-many with `Post` (via implicit relation).
- `Tag` - tags for posts. Many-to-many with `Post`.
- `Comment` - comments referencing `post` and `author`.
  - Note: `Comment` includes `approved` boolean (default false), optional `parentId` for replies, and public listing only returns approved comments.
- `CommentReaction` - one user reaction per comment/type, currently used for comment likes.
- `PostReaction` - one logged-in user reaction per post, used for article like/dislike counts.
- `Page` - static pages with `title`, `slug`, `content`.
- `Media` - uploaded files metadata: `filename`, public `filepath`, original/optimized/WebP paths, `mimetype`, original/optimized sizes, optional dimensions, `uploader`.
- `Setting` - key/value pairs for site settings.
- `NewsletterSubscriber` - subscriber emails.
- `WriterApplication` - Reader-to-Author approval queue. Stores applicant, status, reviewer, review note, and timestamps.
- `RefreshToken` - store refresh tokens with `token`, `userId`, `revoked`, `expiresAt`.
- `PasswordResetToken` - stores one-time password reset token hashes with expiration and used timestamps.
- `AuditLog` - admin audit trail for role changes, post publish/schedule actions, comment moderation, and writer application decisions.

## Key Endpoints (method, path, auth)

- POST /api/auth/register - register user. Body: `{ email, username, password, name? }`. Returns `access` and `refresh` tokens.
- POST /api/auth/login - login. Body: `{ email, password }`. Returns `access` and `refresh`.
- POST /api/auth/refresh - refresh access token. Body: `{ refresh }`. Returns new `access`.
- POST /api/auth/logout - revoke refresh. Body: `{ refresh }`.
- POST /api/auth/forgot-password - public password reset request. Always returns a generic success message and logs the reset token until email delivery is configured.
- POST /api/auth/reset-password - public password reset. Body: `{ token, password }`. Consumes a valid reset token and revokes active refresh tokens.
- POST /api/auth/resend-verification - authenticated user can request a new email verification token.
- POST /api/auth/verify-email - public email verification. Body: `{ token }`. Tokens are stored hashed in the database.

- POST /api/writer/apply - authenticated Reader submits a writer application.
- GET /api/writer/applications - Admin-only list of pending writer applications.
- PATCH /api/writer/applications/:id/approve - Admin-only approval; promotes the applicant to `Author`.
- PATCH /api/writer/applications/:id/reject - Admin-only rejection.

- GET /api/home/featured-posts - public featured published posts.
- GET /api/home/recent-posts - public recent published posts.
- GET /api/home/stats - public homepage statistics.
- POST /api/home/newsletter/subscribe - public newsletter subscription.
- GET /sitemap.xml - public XML sitemap for visible pages and published posts.

- GET /api/posts - list posts. Query: `page`, `perPage`, `q` (search). Public callers only receive `PUBLISHED` posts; authenticated Admin/Author callers can see drafts.
- GET /api/posts/:slug - get post by slug. Public and published-only.
- POST /api/posts/:id/react - logged-in users can toggle `LIKE` or `DISLIKE` on a published post; email verification is not required for reader engagement.
- POST /api/posts - create post. Auth: verified `Author|Admin`. Body: `{ title, content, excerpt?, status?, isScheduled?, scheduledAt?, categories?: [id], tags?: [id], metaTitle?, metaDescription?, ogImage? }`.
- PUT /api/posts/:id - update post. Auth: `Author|Admin`.
- DELETE /api/posts/:id - soft-delete post. Auth: `Author|Admin`.

- GET /api/categories - list categories.
- POST /api/categories - create category. Auth: `Author|Admin`.

- POST /api/media - upload file (`multipart/form-data`, field `file`). Auth required. Image uploads are resized, compressed, and saved with WebP variants when possible.
- GET /api/media - list media.
 - DELETE /api/media/:id - delete media (Admin/Author). Removes DB record and attempts to unlink file on disk. Implements spec #10.

- GET /api/users - list users. Auth: `Admin`.
- GET /api/users/me - current user (requires access token).
 - POST /api/users/:id/disable - disable user (Admin only).
 - POST /api/users/:id/activate - activate user (Admin only).
  Note: `User` now includes `disabled` boolean to support enable/disable (spec #13).

- GET /api/dashboard/stats - Admin-only stats: counts of users/posts/categories/comments/media/tags.

Comments moderation:
- POST /api/comments - logged-in users can submit comments or replies with optional `parentId`; comments require approval before public display, but email verification is not required.
- GET /api/comments/post/:postId - public approved comments for a post, including `parentId` and reaction counts for threaded UIs.
- POST /api/comments/:id/approve - Admin/Author: approve a comment (sets `approved=true`).
- POST /api/comments/:id/reject - Admin/Author: reject (soft-delete) a comment.
- POST /api/comments/:id/react - logged-in users can toggle a `LIKE` reaction on an approved comment.

Audit logs:
- GET /api/audit-logs - Admin-only audit log list with optional `action`, `targetType`, and `performedById` filters.

Newsletter subscribers:
- POST /api/newsletter/subscribe - subscribe (public).
- GET /api/newsletter/subscribers - list subscribers (Admin only).
- DELETE /api/newsletter/subscribers/:id - remove subscriber (Admin only).

Responses follow a consistent shape:

```
{ success: true|false, data: ..., message: ... }
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
- `isScheduled` requires a future `scheduledAt`; scheduled posts are stored as drafts until the scheduler publishes them.
- Public post, homepage, and sitemap queries exclude drafts and future scheduled posts.
- UUID route params: validated via Zod `.uuid()`.
- `slug` params: must match /^[a-z0-9\-]+$/.

OpenAPI spec: see `openapi.yaml` at project root for the core API contract.
Postman collection: see `postman_collection.json` at project root. The newer
CMS extension routes are documented above and covered by
`scripts/verify-new-features.js`.

## How to run

1. Copy `.env.example` to `.env` and fill `DATABASE_URL`, JWT secrets.
2. Install dependencies: `npm install`.
3. Generate Prisma client: `npm run prisma:generate`.
4. Run migrations: `npm run prisma:migrate`.
5. Seed admin user: `npm run seed`.
6. Start dev server: `npm run dev` or production `npm start`.

## Environment variables

- `DATABASE_URL` - SQLite connection string for development (`file:./dev.db`) or PostgreSQL connection string for production.
- `PORT` - server port (default 4000).
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` - secrets for tokens.
- `JWT_ACCESS_EXP`, `JWT_REFRESH_EXP` - optional token expirations.
- `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` - seed admin credentials.
 - `CORS_ORIGINS` - comma-separated allowed origins for CORS (e.g. `http://localhost:5173`).
 - `MAX_UPLOAD_SIZE` - max upload file size in bytes (default `5242880` = 5MB).
 - `RATE_LIMIT_MAX` - global request limit per 15-minute window.
- `PASSWORD_RESET_TTL_MS` - password reset token lifetime in milliseconds.
 - `TRUST_PROXY` - set to `0` locally. In production behind a reverse proxy, set to the exact number of trusted proxies.
- `SITE_URL` - public frontend origin used when generating sitemap URLs.
- Frontend `VITE_API_URL` - API origin or base URL, such as `http://localhost:4000`, `http://localhost:5000`, or `https://api.example.com/api`.

## Background jobs and verification

The backend starts a lightweight scheduled-post publisher with the Express
server. It runs once on startup and then once per minute, publishing due
scheduled posts and recording `post_publish` audit log entries. Production
deployments with multiple API instances should move this work to a single cron
or queue worker.

The repository includes `scripts/verify-new-features.js`, a live API and Prisma
smoke harness for the CMS upgrades. It starts the backend on a temporary port,
creates disposable verification data, checks persistence, and runs four rounds
covering email verification, scheduling, public visibility, comments,
reactions, audit logs, and image optimization.

## SQLite and PostgreSQL

The checked-in Prisma schema is configured for SQLite so local development and
automated verification can run without an external database. The model design
uses portable Prisma field types and relations so production can run on
PostgreSQL by switching the datasource provider to `postgresql`, setting a
PostgreSQL `DATABASE_URL`, and running migrations in that environment.

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

- "Database connection error": ensure `DATABASE_URL` is correct. For PostgreSQL, confirm the database server is running.
- "prisma migrate" fails: run `npx prisma generate` then `npx prisma migrate dev --name init`.
- JWT verify errors: ensure secrets match and tokens haven't expired.
- File upload permission errors: ensure `uploads/` exists and is writable by the process.
