import type { APIRoute } from 'astro'
import { SCHEMAS } from '@/lib/admin/schemas'
import { coerceFormBody } from '@/lib/admin/form'
import { publishEntity } from '@/lib/publish'
import type { Collection } from '@/lib/db/types'

export const POST: APIRoute = async ({ params, request, locals }) => {
  const collection = params.collection as Collection
  if (!SCHEMAS[collection]) return new Response('unknown collection', { status: 400 })
  const env = locals.runtime.env
  let body: Record<string, unknown>
  try { body = await request.json() } catch { return new Response('invalid json', { status: 400 }) }

  let data: Record<string, unknown>
  try { data = coerceFormBody(collection, body) } catch (e) { return new Response((e as Error).message, { status: 400 }) }
  if (!data.slug) return new Response('missing slug', { status: 400 })

  const cols = Object.keys(data)
  const placeholders = cols.map((_, i) => `?${i + 1}`).join(', ')
  const sql = `INSERT INTO ${collection} (${cols.join(',')}) VALUES (${placeholders}) RETURNING id`
  const inserted = await env.DB.prepare(sql).bind(...cols.map((c) => data[c])).first<{ id: number }>()
  if (!inserted) return new Response('insert failed', { status: 500 })

  const report = await publishEntity(
    { db: env.DB, bucket: env.SITE_BUCKET, env, originRequest: request },
    collection,
    String(data.slug),
    'upsert',
    { featured: !!data.featured }
  )
  return Response.json({ id: inserted.id, slug: data.slug, report })
}
