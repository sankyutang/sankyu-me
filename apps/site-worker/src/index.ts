/// <reference types="@cloudflare/workers-types" />

import { handleSubscribe } from './subscribe'

interface Env {
  SITE_BUCKET: R2Bucket
  /** Same D1 as admin (`sankyume_admin`). Optional until bound in production. */
  DB?: D1Database
  SUBSCRIBE_IP_SECRET?: string
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
    case 'ico': return 'image/x-icon'
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
  if (key === 'favicon.svg' || key === 'favicon.ico' || key.startsWith('images/')) {
    return 'public, max-age=86400, s-maxage=604800'
  }
  return 'public, max-age=60, s-maxage=3600'
}

/**
 * Look up an R2 object, with a compatibility alias for legacy public URLs.
 * Older admin uploads advertised `/assets/editor/…` while storing keys at
 * `editor/…`. If `assets/…` misses, retry without the `assets/` prefix.
 */
async function getObject(bucket: R2Bucket, key: string): Promise<{ key: string; obj: R2ObjectBody } | null> {
  const primary = await bucket.get(key)
  if (primary) return { key, obj: primary }
  if (key.startsWith('assets/')) {
    const stripped = key.slice('assets/'.length)
    if (stripped) {
      const alt = await bucket.get(stripped)
      if (alt) return { key: stripped, obj: alt }
    }
  }
  return null
}

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/api/subscribe') {
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'access-control-allow-methods': 'POST, OPTIONS',
            'access-control-allow-headers': 'content-type',
            'access-control-max-age': '86400',
          },
        })
      }
      if (request.method !== 'POST') {
        return json({ ok: false, error: 'method_not_allowed' }, 405)
      }
      const result = await handleSubscribe(env.DB, request, {
        ipHashSecret: env.SUBSCRIBE_IP_SECRET || 'sankyu-subscribe',
      })
      return json(result.body, result.status)
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('method not allowed', { status: 405 })
    }
    const requestedKey = resolveKey(url.pathname)
    const hit = await getObject(env.SITE_BUCKET, requestedKey)
    if (hit) {
      const { key, obj } = hit
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
