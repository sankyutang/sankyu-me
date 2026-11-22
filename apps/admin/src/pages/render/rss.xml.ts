import type { APIRoute } from 'astro'
import { buildRssXml } from '@/lib/feeds/xml'
import { SITE_POSITIONING, firstNonEmpty } from '@/lib/seo/defaults'
import { getSiteSettings, listPosts } from '@/lib/db/queries'

export const GET: APIRoute = async ({ locals }) => {
  const env = locals.runtime.env
  const [settings, posts] = await Promise.all([
    getSiteSettings(env.DB),
    listPosts(env.DB, { status: 'published' }),
  ])
  const siteUrl = settings.siteUrl || env.SITE_BASE_URL || 'https://sankyu.me'
  const xml = buildRssXml({
    siteName: settings.siteName || 'sankyu.me',
    siteDescription: firstNonEmpty(
      settings.siteDescription,
      settings.defaultSeoDescription,
      SITE_POSITIONING.defaultSeoDescription
    ),
    siteUrl,
    posts,
  })
  return new Response(xml, {
    status: 200,
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
      'cache-control': 'public, max-age=60, s-maxage=3600',
    },
  })
}
