# migrate-posts

Prepare approved Notion export packages for sankyu.me D1/R2 import.

## Scope

- Input: content + image packs under `MIGRATE_SRC` (default `/tmp/migrate-10`)
- Output: markdoc + upload manifests under `MIGRATE_OUT` (default `/tmp/migrate-10-prepared`)
- Does **not** write production D1/R2 by itself
- Never includes paused `2025-annual-review-indie-developer-growth`

## Prepare

```bash
node scripts/migrate-posts/prepare-batch.mjs
```

Transforms:

- Strip front matter / leading H1 (DetailShell renders title)
- `<code>…</code>` → markdown backticks
- HTML `<table>` → GFM tables (Markdoc escapes raw HTML)
- `images/N.ext` → `/editor/YYYY/MM/<slug>/N.ext`
- Unsplash/unstable covers → no cover (site typographic fallback)
- HEIC must already be converted to JPEG in the source `images/` tree

## Publish path (ops)

1. Backup D1 posts + live HTML
2. Upload `ALL-UPLOADS.json` objects to R2 `sankyume-site` via authorized Cloudflare connector / admin upload API
3. INSERT posts rows (do not modify existing ids 1–3)
4. Render via admin `/render/*` → put HTML to R2 → purge
5. Verify URLs, image HTTP 200, RSS/sitemap count

Do not create temporary staging Workers or Access tokens to bypass failed Access controls.
