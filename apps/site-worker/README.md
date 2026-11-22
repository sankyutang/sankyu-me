# sankyume site worker

50-line Cloudflare Worker that serves the public site (`sankyu.me`) from the R2
bucket the admin app writes to.

## Routing

- `/` → `index.html`
- `/foo/` → `foo/index.html`
- `/foo` (no extension) → `foo/index.html`
- `/foo.png` → `foo.png` (passes through)
- `/assets/editor/…` → falls back to `editor/…` when the `assets/`-prefixed key is missing (legacy upload URLs)
- `POST /api/subscribe` → JSON email capture into D1 (`subscribers`); no outbound mail
- Anything missing → `404.html` (status 404)

## Subscribe (D1)

Requires the `DB` binding to `sankyume_admin` and migration `0004_subscribers.sql`
applied (via `apps/admin`). Without the binding/table the endpoint returns `503`
and the footer form shows an honest “暂未开放” message — it will not fake success.

Cache headers come from the R2 object's `httpMetadata.cacheControl`. Falls back to
- `assets/*`, `editor/*`, `_astro/*` → `immutable, max-age=31536000`
- everything else → `public, max-age=60, s-maxage=3600`

## Deploy

```bash
wrangler r2 bucket create sankyume-site   # once
wrangler deploy
# Then in the Cloudflare dashboard, bind sankyu.me as a custom domain on this worker.
```
