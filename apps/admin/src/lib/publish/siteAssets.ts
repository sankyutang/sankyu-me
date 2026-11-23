import { putObject } from './r2'
import { AVATAR_PNG_B64, FAVICON_ICO_B64, OG_DEFAULT_PNG_B64 } from './siteAssetBytes'

/**
 * Bundled public site assets that must exist on the R2-published origin
 * (favicon / default OG / blog avatar). Uploaded alongside HTML/XML on full republish.
 * Bodies are embedded so Cloudflare Pages SSR does not need node:fs.
 */

const SVG_FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="sankyu.me">
  <rect width="64" height="64" rx="32" fill="#c8553d"/>
  <text x="32" y="42" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="34" font-style="italic" fill="#f5f1e8">S</text>
</svg>
`

function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

export interface SiteAssetSpec {
  key: string
  contentType: string
  cacheControl: string
  body: string | Uint8Array
}

export const SITE_ASSET_SPECS: SiteAssetSpec[] = [
  {
    key: 'favicon.svg',
    contentType: 'image/svg+xml',
    cacheControl: 'public, max-age=86400, s-maxage=604800',
    body: SVG_FAVICON,
  },
  {
    key: 'favicon.ico',
    contentType: 'image/x-icon',
    cacheControl: 'public, max-age=86400, s-maxage=604800',
    body: b64ToBytes(FAVICON_ICO_B64),
  },
  {
    key: 'images/og-default.png',
    contentType: 'image/png',
    cacheControl: 'public, max-age=86400, s-maxage=604800',
    body: b64ToBytes(OG_DEFAULT_PNG_B64),
  },
  {
    key: 'images/avatar.png',
    contentType: 'image/png',
    cacheControl: 'public, max-age=86400, s-maxage=604800',
    body: b64ToBytes(AVATAR_PNG_B64),
  },
]

export async function publishSiteAssets(bucket: R2Bucket): Promise<{ uploaded: string[] }> {
  const uploaded: string[] = []
  for (const spec of SITE_ASSET_SPECS) {
    await putObject(bucket, spec.key, spec.body, {
      contentType: spec.contentType,
      cacheControl: spec.cacheControl,
    })
    uploaded.push(spec.key)
  }
  return { uploaded }
}
