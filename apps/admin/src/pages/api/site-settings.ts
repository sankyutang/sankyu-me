import type { APIRoute } from 'astro'
import { setSiteSettings } from '@/lib/db/queries'
import { publishFullSite } from '@/lib/publish'

export const PUT: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime.env
  let body: any
  try { body = await request.json() } catch { return new Response('invalid json', { status: 400 }) }
  await setSiteSettings(env.DB, body)
  const report = await publishFullSite({ db: env.DB, bucket: env.SITE_BUCKET, env, originRequest: request })
  return Response.json({ ok: true, report })
}
