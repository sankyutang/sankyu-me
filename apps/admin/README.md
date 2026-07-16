# sankyume admin

Astro SSR app that backs `admin.sankyu.me`.

- Stores content in **Cloudflare D1** (`DB` binding).
- On every CRUD save, renders the affected static pages with the Astro Container
  API and uploads them to the **R2** bucket bound as `SITE_BUCKET`.
- Best-effort purges Cloudflare cache for the changed URLs.

## Local setup

```bash
# from repo root
npm install
npm install --save-dev yaml

# 1. Create the D1 database (once)
wrangler d1 create sankyume_admin
# Copy the printed database_id into apps/admin/wrangler.toml

# 2. Run schema migration locally
cd apps/admin
wrangler d1 migrations apply sankyume_admin --local

# 3. (Optional) Seed from legacy src/content/
cd ../..
npx tsx scripts/import-content.ts > apps/admin/migrations/0002_seed.sql
cd apps/admin
wrangler d1 execute sankyume_admin --local --file=migrations/0002_seed.sql

# 4. Run dev
npm run dev
# Visit http://localhost:4321/admin
```

## R2 bucket

Create the bucket once:

```bash
wrangler r2 bucket create sankyume-site
```

Both `apps/admin` and `apps/site-worker` bind the same bucket. Admin writes;
worker reads.

## Cache purge env vars

Set as Pages secrets after the first deploy:

```bash
wrangler pages secret put CLOUDFLARE_API_TOKEN
wrangler pages secret put CLOUDFLARE_ZONE_ID
```

Cache purge is best-effort — pipeline does not fail if these are absent.

## Public-site release

Public HTML is rendered dynamically by Admin and stored in R2, but Astro's
hashed `/_astro/*` files come from the Admin build. Release them together:

```bash
cd apps/admin
export CF_ACCESS_CLIENT_ID=<Access service-token client id>
export CF_ACCESS_CLIENT_SECRET=<Access service-token client secret>
npm run release:production
```

The release builds once, uploads `dist/_astro/**` to `SITE_BUCKET` with
immutable caching, deploys that same `dist` to Pages, calls the protected
`/api/republish` endpoint, then verifies the public CSS references. It never
deletes old hashed assets.

Astro sessions require a `SESSION` KV binding. Configure the Pages project
deployment environments separately: Production uses
`sankyume-admin-session-production`, and Preview uses
`sankyume-admin-session-preview` (both with the binding name `SESSION`).

## Body media uploads

Post and Page Markdoc bodies can upload images to the bound R2 bucket. The
Cloudflare Stream video upload implementation is retained but currently
disabled by `ENABLE_STREAM_VIDEO_UPLOAD` in `src/lib/media.ts`, so no Stream
subscription or variables are needed now. When enabling it later, configure
these values for both production and preview deployments:

```bash
# Non-secret Pages variables
CLOUDFLARE_ACCOUNT_ID=<account id>
CLOUDFLARE_STREAM_CUSTOMER_CODE=<Stream customer code>

# Encrypted Pages secret; create with the minimum Stream Write permission
wrangler pages secret put CLOUDFLARE_STREAM_API_TOKEN
```

Images are limited to 10 MB (JPEG, PNG, GIF, WebP, AVIF). Once enabled, videos
use a one-time Stream direct-upload URL, are limited to 200 MB, and reserve up
to 30 minutes of Stream storage. Video files upload from the browser directly
to Stream; they do not pass through the Pages application.

## Routes

| Path                        | Purpose                          |
|-----------------------------|----------------------------------|
| `/admin`                    | Dashboard                        |
| `/admin/{collection}`       | List view                        |
| `/admin/{collection}/[id]`  | Edit form (use `new` to create)  |
| `/admin/site-settings`      | JSON editor for site settings    |
| `/api/collections/{c}`      | POST: create + publish           |
| `/api/collections/{c}/{id}` | PUT: update + publish · DELETE: remove + publish |
| `/api/site-settings`        | PUT: save + full republish       |
| `/api/republish`            | POST: rebuild every page         |
| `/api/uploads/r2`           | Multipart image upload to R2     |
| `/api/uploads/stream`       | Create one-time Stream video upload URL |

## Authentication

First phase relies on **Cloudflare Access** in front of `admin.sankyu.me`. The
app itself has no login flow.
