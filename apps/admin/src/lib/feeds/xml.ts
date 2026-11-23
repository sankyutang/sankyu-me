/** Pure-string RSS 2.0 / sitemap builders — never go through Astro HTML serialization. */

export function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function normalizeBaseUrl(url: string): string {
  return url.replace(/\/$/, '')
}

export interface RssPost {
  slug: string
  title: string
  excerpt?: string | null
  published_at?: string | null
}

export interface RssInput {
  siteName: string
  siteDescription?: string | null
  siteUrl: string
  posts: RssPost[]
}

/** Build a well-formed RSS 2.0 document (UTF-8 XML declaration, closed <link> tags). */
export function buildRssXml(input: RssInput): string {
  const base = normalizeBaseUrl(input.siteUrl)
  const items = input.posts
    .map((p) => {
      const loc = `${base}/posts/${p.slug}`
      const parts = [
        `    <item>`,
        `      <title>${escapeXml(p.title)}</title>`,
        `      <link>${escapeXml(loc)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(loc)}</guid>`,
      ]
      if (p.published_at) {
        parts.push(`      <pubDate>${escapeXml(new Date(p.published_at).toUTCString())}</pubDate>`)
      }
      if (p.excerpt) {
        parts.push(`      <description>${escapeXml(p.excerpt)}</description>`)
      }
      parts.push(`    </item>`)
      return parts.join('\n')
    })
    .join('\n')

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<rss version="2.0">`,
    `  <channel>`,
    `    <title>${escapeXml(input.siteName)}</title>`,
    `    <link>${escapeXml(base)}</link>`,
    `    <description>${escapeXml(input.siteDescription || '')}</description>`,
    items,
    `  </channel>`,
    `</rss>`,
    ``,
  ].join('\n')
}

export interface SitemapUrl {
  loc: string
  lastmod?: string | null
}

export function buildSitemapXml(urls: SitemapUrl[]): string {
  const body = urls
    .map((u) => {
      const lines = [`  <url>`, `    <loc>${escapeXml(u.loc)}</loc>`]
      if (u.lastmod) {
        lines.push(`    <lastmod>${escapeXml(new Date(u.lastmod).toISOString())}</lastmod>`)
      }
      lines.push(`  </url>`)
      return lines.join('\n')
    })
    .join('\n')

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    body,
    `</urlset>`,
    ``,
  ].join('\n')
}

export function collectSitemapUrls(opts: {
  siteUrl: string
  posts: { slug: string; updated_at?: string | null }[]
  products: { slug: string; updated_at?: string | null }[]
  podcasts: { slug: string; updated_at?: string | null }[]
  videos: { slug: string; updated_at?: string | null }[]
  pages: { slug: string; updated_at?: string | null }[]
}): SitemapUrl[] {
  const base = normalizeBaseUrl(opts.siteUrl)
  const urls: SitemapUrl[] = [
    { loc: `${base}/` },
    { loc: `${base}/posts` },
    { loc: `${base}/products` },
    { loc: `${base}/media` },
    { loc: `${base}/pages` },
    { loc: `${base}/about` },
  ]
  for (const p of opts.posts) urls.push({ loc: `${base}/posts/${p.slug}`, lastmod: p.updated_at })
  for (const p of opts.products) urls.push({ loc: `${base}/products/${p.slug}`, lastmod: p.updated_at })
  for (const p of opts.podcasts) {
    urls.push({ loc: `${base}/media/podcasts/${p.slug}`, lastmod: p.updated_at })
  }
  for (const v of opts.videos) {
    urls.push({ loc: `${base}/media/videos/${v.slug}`, lastmod: v.updated_at })
  }
  for (const p of opts.pages) urls.push({ loc: `${base}/pages/${p.slug}`, lastmod: p.updated_at })
  return urls
}
