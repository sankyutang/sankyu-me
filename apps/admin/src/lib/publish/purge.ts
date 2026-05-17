// Cloudflare cache purge — best-effort, never throws.
// Docs: https://developers.cloudflare.com/api/operations/zone-purge

export async function purgeUrls(env: Env, urls: string[]): Promise<{ ok: boolean; error?: string }> {
  if (!env.CLOUDFLARE_API_TOKEN || !env.CLOUDFLARE_ZONE_ID || urls.length === 0) {
    return { ok: true } // silently skip when not configured
  }
  // CF API accepts max 30 files per call. Chunk just in case.
  const chunks: string[][] = []
  for (let i = 0; i < urls.length; i += 30) chunks.push(urls.slice(i, i + 30))

  for (const files of chunks) {
    try {
      const res = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${env.CLOUDFLARE_ZONE_ID}/purge_cache`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ files }),
        }
      )
      if (!res.ok) {
        return { ok: false, error: `purge ${res.status}: ${await res.text()}` }
      }
    } catch (err) {
      return { ok: false, error: (err as Error).message }
    }
  }
  return { ok: true }
}

export function keyToUrl(siteBase: string, key: string): string {
  const base = siteBase.replace(/\/$/, '')
  if (key === 'index.html') return `${base}/`
  if (key.endsWith('/index.html')) return `${base}/${key.slice(0, -'index.html'.length)}`
  return `${base}/${key}`
}
