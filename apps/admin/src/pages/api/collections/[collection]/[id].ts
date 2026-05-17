import type { APIRoute } from 'astro'
import { SCHEMAS } from '@/lib/admin/schemas'
import { coerceFormBody } from '@/lib/admin/form'
import { publishEntity } from '@/lib/publish'
import type { Collection } from '@/lib/db/types'

async function getSlug(env: Env, collection: Collection, id: number) {
  const r = await env.DB.prepare(`SELECT slug, featured FROM ${collection} WHERE id = ?1`)
    .bind(id)
    .first<{ slug: string; featured: number }>()
  return r
}

export const PUT: APIRoute = async ({ params, request, locals }) => {
  const collection = params.collection as Collection
  const id = Number(params.id)
  if (!SCHEMAS[collection] || !id) return new Response('bad request', { status: 400 })
  const env = locals.runtime.env
  let body: Record<string, unknown>
  try { body = await request.json() } catch { return new Response('invalid json', { status: 400 }) }

  let data: Record<string, unknown>
  try { data = coerceFormBody(collection, body) } catch (e) { return new Response((e as Error).message, { status: 400 }) }

  const cols = Object.keys(data)
  if (cols.length === 0) return new Response('no fields', { status: 400 })
  const sets = cols.map((c, i) => `${c} = ?${i + 1}`).join(', ')
  const sql = `UPDATE ${collection} SET ${sets}, updated_at = CURRENT_TIMESTAMP WHERE id = ?${cols.length + 1}`
  await env.DB.prepare(sql).bind(...cols.map((c) => data[c]), id).run()

  const after = await getSlug(env, collection, id)
  if (!after) return new Response('not found', { status: 404 })

  const report = await publishEntity(
    { db: env.DB, bucket: env.SITE_BUCKET, env, originRequest: request },
    collection,
    after.slug,
    'upsert',
    { featured: !!after.featured }
  )
  return Response.json({ id, slug: after.slug, report })
}

export const DELETE: APIRoute = async ({ params, locals, request }) => {
  const collection = params.collection as Collection
  const id = Number(params.id)
  if (!SCHEMAS[collection] || !id) return new Response('bad request', { status: 400 })
  const env = locals.runtime.env
  const existing = await getSlug(env, collection, id)
  if (!existing) return new Response('not found', { status: 404 })

  await env.DB.prepare(`DELETE FROM ${collection} WHERE id = ?1`).bind(id).run()

  const report = await publishEntity(
    { db: env.DB, bucket: env.SITE_BUCKET, env, originRequest: request },
    collection,
    existing.slug,
    'delete'
  )
  return Response.json({ id, report })
}
