# Blogify — Project Overview

This document explains the full Blogify project (frontend + backend), database models and relations, all API endpoints, authentication and authorization flows, how to run locally, environment variables, security features, and where to find the OpenAPI spec.

---

## Project structure

- Root
  - `index.html`, `package.json`, frontend sources (Vite)
  - `PROJECT_OVERVIEW.md`, `README.md`
- `src/` (frontend)
  - `App.jsx`, `main.jsx`, `App.css` and React pages/components. Public pages live under `src/pages/public/`.
- `textbackend/` (backend)
  - `package.json` - backend dependencies and scripts
  - `.env.example` - example environment variables
  - `openapi.yaml` - OpenAPI 3.0 specification for the backend API
  - `postman_collection.json` - Postman collection with authenticated request examples
  - `EXPLAIN.md` - developer oriented explanation (models, endpoints, run steps)
  - `prisma/schema.prisma` - Prisma schema, models and relations
  - `prisma/seed.js` - seed script (creates roles + admin user)
  - `src/` - backend source
    - `config/` - configuration helpers
    - `controllers/` - express controllers for resources (auth, posts, users, categories, tags, comments, pages, media, settings, newsletter, dashboard)
    - `routes/` - route definitions
    - `middlewares/` - validation, auth, error handler, response wrapper, rate limiting
    - `utils/` - Prisma client, JWT helpers, slug generator
    - `uploads/` - uploaded files

---

## Database models & relations (summary)
Defined in `textbackend/prisma/schema.prisma` — key models:

- `User` (id, email, username, password, name, bio, roleId, posts[], comments[], media[], refreshTokens[]) — soft-delete via `deletedAt`.
- `Role` (id, name) — one-to-many with `User`. Typical roles: `Admin`, `Author`, `Reader`.
- `Post` (id, title, slug, excerpt, content, status, authorId, categories[], tags[], comments[], mediaId, views, isFeatured) — many-to-many with `Category` and `Tag`, relations to `User`, `Comment`, optional `Media`.
- `Category` (id, name, slug) — many-to-many with `Post`.
- `Tag` (id, name) — many-to-many with `Post`.
- `Comment` (id, content, authorId, postId, parentId, createdAt, deletedAt) — nested comments via `parentId`.
- `Page` (id, title, slug, content, deletedAt) — static pages.
- `Media` (id, filename, filepath, mimetype, size, width, height, uploaderId, createdAt) — uploaded file metadata.
- `Setting` (id, key, value) — key/value site settings.
- `NewsletterSubscriber` (id, email, createdAt)
- `RefreshToken` (id, token, userId, revoked, expiresAt) — persisted refresh tokens
- `Audit` (id, action, entity, entityId, payload, userId, createdAt)

Refer to `prisma/schema.prisma` for exact types and indexes.

---

## API endpoints (summary)
All endpoints are under `http://localhost:4000` by default; OpenAPI available at `textbackend/openapi.yaml` for full details.

Consistent response format:

```json
{ "success": true|false, "data": {...}, "error": "message" }
```

Authentication: JWT access tokens (short-lived) + refresh tokens (persisted). Authorization via roles `Admin`, `Author`, `Reader`.

Key endpoints (examples):

- POST /api/auth/register
  - Auth: none
  - Body: { "email": "user@example.com", "username": "user", "password": "secret" }
  - Response: { success: true, data: { user: {...}, access: "<jwt>", refresh: "<jwt>" } }

- POST /api/auth/login
  - Body: { "email": "...", "password": "..." }
  - Response: { success: true, data: { user: {...}, access, refresh } }

- POST /api/auth/refresh
  - Body: { "refresh": "<refresh-token>" }
  - Response: { success: true, data: { access: "<new-access>" } }

- POST /api/auth/logout
  - Body: { "refresh": "<refresh-token>" }
  - Revokes refresh token.

- GET /api/posts
  - Public; query: `page`, `perPage`, `q` (search)
  - Response: { data: { posts: [...], meta: { total } } }

- GET /api/posts/{slug}
  - Public; returns post by slug; increments views

- POST /api/posts
  - Auth: `Author|Admin`; Body validated by Zod
  - Sanitized HTML content stored

- PUT /api/posts/{id}, DELETE /api/posts/{id}
  - Auth: `Author|Admin`; soft-delete implemented via `deletedAt` on delete

- Categories & Tags
  - CRUD endpoints under `/api/categories` and `/api/tags` with role-based access (create/update restricted to `Author`/`Admin`, delete restricted to `Admin`)

- Comments
  - POST /api/comments (auth required) — content sanitized
  - GET /api/comments/post/{postId}
  - DELETE /api/comments/{id} (soft-delete)

- Pages
  - Public CRUD for pages under `/api/pages` (create/update/delete require `Author|Admin`)

- Media
  - POST /api/media (multipart/form-data field `file`) — auth required; uploads saved to `/uploads` and metadata stored
  - File type and size limited via `MAX_UPLOAD_SIZE` and allowed MIME list

- Users
  - GET /api/users (Admin only) with pagination
  - GET /api/users/me (auth)
  - PUT /api/users/{id} (auth) — updates allowed fields; `Admin` can manage other users

- Settings
  - GET /api/settings (public)
  - POST/PUT/DELETE /api/settings — Admin only

- Newsletter
  - POST /api/newsletter/subscribe — upserts subscriber by email

- Dashboard
  - GET /api/dashboard/stats — Admin-only aggregates (users/posts/categories/comments/media/tags)

For full request/response schemas, examples, and auth details see `textbackend/openapi.yaml`.

---

## Authentication & authorization flow

- Registration creates user and persists a refresh token in the `RefreshToken` table; returns both access and refresh tokens.
- Access tokens are short-lived; use refresh token to obtain new access tokens via `/api/auth/refresh`.
- Logout revokes refresh tokens via `revoked` flag.
- `requireAuth` middleware validates access token and attaches `req.user` (including `role`). `requireRole` enforces role checks.

Security notes:
- Refresh tokens validated against DB records and expiry timestamps; revoked tokens are rejected.
- Inputs validated by Zod for all endpoints; invalid requests return 400 with clear errors.
- Rich HTML inputs are sanitized before storage using `sanitize-html`.
- Per-user rate limiting applied to write-heavy endpoints to prevent abuse.

---

## How to run locally

1. Backend

```bash
cd textbackend
npm install
cp .env.example .env
# Edit .env to set DATABASE_URL and secrets
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

2. Frontend

```bash
# from project root
npm install
npm run dev
```

Open `http://localhost:5173` for the frontend and `http://localhost:4000` for the backend API.

---

## Environment variables

Key backend variables (see `.env.example`):

- `DATABASE_URL` — PostgreSQL connection string
- `PORT` — backend port (default 4000)
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` — JWT secrets
- `JWT_ACCESS_EXP`, `JWT_REFRESH_EXP` — token expirations
- `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` — seed admin credentials
- `CORS_ORIGINS` — comma-separated allowed origins for CORS
- `MAX_UPLOAD_SIZE` — max upload size in bytes (default 5242880)

---

## Key features & security measures

- Full role-based auth (Admin/Author/Reader)
- JWT access + refresh token model; refresh tokens persisted and revocable
- Zod validation for all endpoints (strict request shapes)
- Input sanitization for rich HTML via `sanitize-html`
- File upload validation (Multer fileFilter + size limits)
- Per-user rate limiting + global rate limits
- Helmet + configurable CORS
- Centralized error handler and consistent response wrapper

---

## OpenAPI spec & Postman

- OpenAPI: `textbackend/openapi.yaml` (covers all endpoints and schemas)
- Postman: `textbackend/postman_collection.json` — includes `baseUrl` and `accessToken` variable with pre-request script to inject Authorization header. Use the `Login` request to obtain tokens and set `accessToken`.

---

## Common operational notes

- Ensure `uploads/` directory is writable by server process.
- Rotate JWT secrets and use secure random values in production.
- For production: set strict CSP and HSTS headers in `helmet` configuration.
- Consider background job to cleanup expired refresh tokens and purge old media files.

---

If you want, I can now run OpenAPI validation and add basic integration tests. For now, the above describes the full project and how to run it.
