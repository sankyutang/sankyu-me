import type { APIRoute } from 'astro'
import { publishFullSite } from '@/lib/publish'

export const POST: APIRoute = async ({ locals, request }) => {
  try {
    const env = locals.runtime.env
    if (!env?.DB) return Response.json({ ok: false, error: 'DB binding missing' }, { status: 500 })
    if (!env?.SITE_BUCKET) return Response.json({ ok: false, error: 'SITE_BUCKET binding missing' }, { status: 500 })
    const report = await publishFullSite({ db: env.DB, bucket: env.SITE_BUCKET, env, originRequest: request })
    return Response.json({ ok: true, report })
  } catch (err) {
    const e = err as Error
    return Response.json({ ok: false, error: e.message, stack: e.stack }, { status: 500 })
  }
}
