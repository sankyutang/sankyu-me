import type { APIRoute } from 'astro'
import { buildSitemapXml, collectSitemapUrls } from '@/lib/feeds/xml'
import {
  getSiteSettings,
  listPages,
  listPodcasts,
  listPosts,
  listProducts,
  listVideos,
} from '@/lib/db/queries'

export const GET: APIRoute = async ({ locals }) => {
  const env = locals.runtime.env
  const [settings, posts, products, podcasts, videos, pages] = await Promise.all([
    getSiteSettings(env.DB),
    listPosts(env.DB, { status: 'published' }),
    listProducts(env.DB),
    listPodcasts(env.DB, { status: 'published' }),
    listVideos(env.DB, { status: 'published' }),
    listPages(env.DB),
  ])
  const siteUrl = settings.siteUrl || env.SITE_BASE_URL || 'https://sankyu.me'
  const xml = buildSitemapXml(
    collectSitemapUrls({ siteUrl, posts, products, podcasts, videos, pages })
  )
  return new Response(xml, {
    status: 200,
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=60, s-maxage=3600',
    },
  })
}
