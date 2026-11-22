# Local (non-production) verification

Date: 2026-11-22. Environment: local Wrangler / Astro only. No production D1/R2/Worker deploy.

## Feeds / robots (admin `astro dev` → `/render/*`)

- `GET /render/rss.xml` → `application/rss+xml`, starts with `<?xml`, no `<!DOCTYPE html>`, `</link>` present, `xml.etree` parse OK
- `GET /render/sitemap.xml` → `application/xml`, parse OK
- `GET /render/robots.txt` → keeps Baiduspider Disallow, adds `Sitemap: https://sankyu.me/sitemap.xml`

## Pages (same render path)

- Home title: `三桥 · 一人公司 / 独立开发者 / FDE`; description non-empty; aligned with About positioning
- Products: no `$10,600` / `3 件` fake stats; no in-development product names; empty state is neutral「暂无公开产品。」
- About: approved timeline/meta retained (三桥 / Guangzhou / OPC / FDE)
- Footer subscribe: natural CTA + privacy (email only for operator-sent updates; no auto marketing); no invented deletion-request workflow

## Site-worker local (`wrangler dev` :8787 + local R2 objects + local D1)

- Favicon SVG/ICO and `/images/og-default.png` → 200
- `POST /api/subscribe` created `preview@example.com` in local `subscribers`
- Invalid email → 400 `invalid_email`
- Duplicate → 200 `duplicate`
- Honeypot → 200 without insert

## Production external note

Live `https://sankyu.me/robots.txt` currently returns **Cloudflare Managed** content (no Sitemap). Repo publishes `robots.txt` to R2, but zone Managed robots may override until the operator adds Sitemap in CF dashboard or disables Managed robots.
