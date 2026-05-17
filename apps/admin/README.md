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

## Authentication

First phase relies on **Cloudflare Access** in front of `admin.sankyu.me`. The
app itself has no login flow.
