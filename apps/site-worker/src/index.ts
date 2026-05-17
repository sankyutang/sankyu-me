/// <reference types="@cloudflare/workers-types" />

interface Env {
  SITE_BUCKET: R2Bucket
}

function resolveKey(pathname: string): string {
  let key = pathname.replace(/^\/+/, '')
  if (key === '') return 'index.html'
  if (key.endsWith('/')) return `${key}index.html`
  // Treat anything without a file extension as a directory page.
  const last = key.split('/').pop() ?? ''
  if (!last.includes('.')) return `${key}/index.html`
  return key
}

function mimeFor(key: string, fallback?: string | null): string {
  if (fallback) return fallback
  const ext = key.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'html': return 'text/html; charset=utf-8'
    case 'css': return 'text/css; charset=utf-8'
    case 'js': return 'application/javascript; charset=utf-8'
    case 'json': return 'application/json; charset=utf-8'
    case 'xml': return 'application/xml; charset=utf-8'
    case 'svg': return 'image/svg+xml'
    case 'png': return 'image/png'
    case 'jpg':
    case 'jpeg': return 'image/jpeg'
    case 'webp': return 'image/webp'
    case 'avif': return 'image/avif'
    case 'woff2': return 'font/woff2'
    case 'woff': return 'font/woff'
    case 'txt': return 'text/plain; charset=utf-8'
    default: return 'application/octet-stream'
  }
}

function cacheFor(key: string): string {
  if (key.startsWith('assets/') || key.startsWith('editor/') || key.startsWith('_astro/')) {
    return 'public, max-age=31536000, immutable'
  }
  return 'public, max-age=60, s-maxage=3600'
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('method not allowed', { status: 405 })
    }
    const key = resolveKey(url.pathname)
    const obj = await env.SITE_BUCKET.get(key)
    if (obj) {
      const headers = new Headers()
      headers.set('content-type', mimeFor(key, obj.httpMetadata?.contentType))
      headers.set('cache-control', obj.httpMetadata?.cacheControl ?? cacheFor(key))
      if (obj.httpEtag) headers.set('etag', obj.httpEtag)
      return new Response(request.method === 'HEAD' ? null : obj.body, { status: 200, headers })
    }
    // 404 fallback
    const fallback = await env.SITE_BUCKET.get('404.html')
    return new Response(fallback?.body ?? 'Not Found', {
      status: 404,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    })
  },
}
