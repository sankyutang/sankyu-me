// Renders an output key by issuing an internal fetch against our own
// `_render/*` Astro routes. Avoids the Container API (which pulls node:fs via
// Astro's markdown pipeline) — everything goes through normal Astro SSR.

export interface RenderResult {
  body: string
  contentType: string
}

/**
 * Map an R2 object key to the internal `_render/*` path that produces it.
 * Returns null for keys we don't know how to render.
 */
function keyToRenderPath(key: string): string | null {
  if (key === 'index.html') return '/render/home'
  if (key === '404.html') return '/render/notfound'
  if (key === 'sitemap.xml') return '/render/sitemap.xml'
  if (key === 'rss.xml') return '/render/rss.xml'

  if (key === 'blog/index.html') return '/render/blog'
  if (key === 'products/index.html') return '/render/products'
  if (key === 'podcast/index.html') return '/render/podcast'
  if (key === 'videos/index.html') return '/render/videos'

  const detail = key.match(/^([^/]+)\/([^/]+)\/index\.html$/)
  if (detail) {
    const [, base, slug] = detail
    if (base === 'blog') return `/render/blog/${slug}`
    if (base === 'products') return `/render/products/${slug}`
    if (base === 'podcast') return `/render/podcast/${slug}`
  }

  const topLevel = key.match(/^([^/]+)\/index\.html$/)
  if (topLevel) return `/render/page/${topLevel[1]}`

  return null
}

function contentTypeForKey(key: string): string {
  if (key.endsWith('.xml')) {
    return key === 'rss.xml'
      ? 'application/rss+xml; charset=utf-8'
      : 'application/xml; charset=utf-8'
  }
  return 'text/html; charset=utf-8'
}

/**
 * Render an output key to its full body using the originating request's origin
 * for self-fetching. CF Pages routes the request internally; no public hop.
 */
export async function renderKey(
  key: string,
  originRequest: Request
): Promise<RenderResult | null> {
  const path = keyToRenderPath(key)
  if (!path) return null
  const url = new URL(path, originRequest.url)
  // Forward cookies so Cloudflare Access (if enabled) lets us through.
  const headers = new Headers()
  const cookie = originRequest.headers.get('cookie')
  if (cookie) headers.set('cookie', cookie)
  headers.set('x-internal-publish', '1')
  const res = await fetch(url.toString(), { headers })
  if (!res.ok) {
    throw new Error(`render ${path} -> ${res.status}: ${(await res.text()).slice(0, 200)}`)
  }
  const body = await res.text()
  return { body, contentType: contentTypeForKey(key) }
}
