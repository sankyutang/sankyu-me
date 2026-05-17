import type { Collection } from '../db/types'
import { planFullSite, planPaths, type Op } from './affectedPaths'
import { renderKey } from './render'
import { deleteObject, hashBody, putObject } from './r2'
import { keyToUrl, purgeUrls } from './purge'
import {
  listPages,
  listPodcasts,
  listPosts,
  listProducts,
  listVideos,
  listWorks,
} from '../db/queries'

export interface PublishContext {
  db: D1Database
  bucket: R2Bucket
  env: Env
  originRequest: Request   // used to self-fetch /_render/* routes
}

export interface PublishReport {
  rendered: string[]
  removed: string[]
  failed: { key: string; error: string }[]
  purged: boolean
  purgeError?: string
}

async function logEntry(db: D1Database, path: string, hash: string | null, status: 'ok' | 'error', message?: string) {
  await db
    .prepare('INSERT INTO publish_log(path, content_hash, status, message) VALUES (?1, ?2, ?3, ?4)')
    .bind(path, hash, status, message ?? null)
    .run()
}

async function processPlan(ctx: PublishContext, plan: { render: string[]; remove: string[] }): Promise<PublishReport> {
  const report: PublishReport = { rendered: [], removed: [], failed: [], purged: false }

  for (const key of plan.render) {
    try {
      const out = await renderKey(key, ctx.originRequest)
      if (!out) {
        report.failed.push({ key, error: 'no renderer' })
        await logEntry(ctx.db, key, null, 'error', 'no renderer')
        continue
      }
      await putObject(ctx.bucket, key, out.body, {
        contentType: out.contentType,
        cacheControl: key.startsWith('assets/')
          ? 'public, max-age=31536000, immutable'
          : 'public, max-age=60, s-maxage=3600',
      })
      const hash = await hashBody(out.body)
      report.rendered.push(key)
      await logEntry(ctx.db, key, hash, 'ok')
    } catch (err) {
      const message = (err as Error).message
      report.failed.push({ key, error: message })
      await logEntry(ctx.db, key, null, 'error', message)
    }
  }

  for (const key of plan.remove) {
    try {
      await deleteObject(ctx.bucket, key)
      report.removed.push(key)
      await logEntry(ctx.db, key, null, 'ok', 'deleted')
    } catch (err) {
      report.failed.push({ key, error: (err as Error).message })
    }
  }

  const urls = [...plan.render, ...plan.remove].map((k) => keyToUrl(ctx.env.SITE_BASE_URL, k))
  const purgeResult = await purgeUrls(ctx.env, urls)
  report.purged = purgeResult.ok
  if (!purgeResult.ok) report.purgeError = purgeResult.error

  return report
}

export async function publishEntity(
  ctx: PublishContext,
  collection: Collection,
  slug: string,
  op: Op,
  meta: { featured?: boolean } = {}
): Promise<PublishReport> {
  const plan = planPaths(collection, slug, op, meta)
  return processPlan(ctx, plan)
}

export async function publishFullSite(ctx: PublishContext): Promise<PublishReport> {
  const [posts, works, products, podcasts, videos, pages] = await Promise.all([
    listPosts(ctx.db),
    listWorks(ctx.db),
    listProducts(ctx.db),
    listPodcasts(ctx.db),
    listVideos(ctx.db),
    listPages(ctx.db),
  ])
  const plan = planFullSite({
    posts: posts.map((p) => p.slug),
    works: works.map((w) => w.slug),
    products: products.map((p) => p.slug),
    podcasts: podcasts.map((p) => p.slug),
    videos: videos.map((v) => v.slug),
    pages: pages.map((p) => p.slug),
  })
  return processPlan(ctx, plan)
}
