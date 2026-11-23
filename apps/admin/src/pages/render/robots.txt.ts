import type { APIRoute } from 'astro'
import { buildRobotsTxt } from '@/lib/feeds/robots'
import { getSiteSettings } from '@/lib/db/queries'

export const GET: APIRoute = async ({ locals }) => {
  const env = locals.runtime.env
  const settings = await getSiteSettings(env.DB)
  const siteUrl = settings.siteUrl || env.SITE_BASE_URL || 'https://sankyu.me'
  const body = buildRobotsTxt(siteUrl)
  return new Response(body, {
    status: 200,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=60, s-maxage=3600',
    },
  })
}
