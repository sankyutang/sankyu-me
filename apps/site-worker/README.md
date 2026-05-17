# sankyume site worker

50-line Cloudflare Worker that serves the public site (`sankyu.me`) from the R2
bucket the admin app writes to.

## Routing

- `/` → `index.html`
- `/foo/` → `foo/index.html`
- `/foo` (no extension) → `foo/index.html`
- `/foo.png` → `foo.png` (passes through)
- Anything missing → `404.html` (status 404)

Cache headers come from the R2 object's `httpMetadata.cacheControl`. Falls back to
- `assets/*`, `editor/*`, `_astro/*` → `immutable, max-age=31536000`
- everything else → `public, max-age=60, s-maxage=3600`

## Deploy

```bash
wrangler r2 bucket create sankyume-site   # once
wrangler deploy
# Then in the Cloudflare dashboard, bind sankyu.me as a custom domain on this worker.
```
