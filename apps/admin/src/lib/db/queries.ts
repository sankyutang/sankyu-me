import type {
  Collection,
  Page,
  PageRow,
  Podcast,
  PodcastRow,
  Post,
  PostRow,
  Product,
  ProductRow,
  SiteSettings,
  Video,
  VideoRow,
} from './types'

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export const hydrate = {
  post(row: PostRow): Post {
    return {
      ...row,
      tags: parseJson<string[]>(row.tags, []),
      related_posts: parseJson<string[]>(row.related_posts, []),
      featured: !!row.featured,
    }
  },
  product(row: ProductRow): Product {
    return {
      ...row,
      featured: !!row.featured,
      tags: parseJson<string[]>(row.tags, []),
      highlights: parseJson(row.highlights, []),
      audience: parseJson<string[]>(row.audience, []),
      faq: parseJson(row.faq, []),
      related_posts: parseJson<string[]>(row.related_posts, []),
    }
  },
  podcast(row: PodcastRow): Podcast {
    return {
      ...row,
      external_links: parseJson(row.external_links, []),
      related_posts: parseJson<string[]>(row.related_posts, []),
    }
  },
  page(row: PageRow): Page {
    return row
  },
  video(row: VideoRow): Video {
    return row
  },
}

// ---------- Posts ----------
export async function listPosts(db: D1Database, opts: { status?: string } = {}) {
  const where = opts.status ? 'WHERE status = ?1' : ''
  const stmt = db.prepare(
    `SELECT * FROM posts ${where} ORDER BY featured DESC, published_at DESC, id DESC`
  )
  const result = opts.status ? await stmt.bind(opts.status).all<PostRow>() : await stmt.all<PostRow>()
  return (result.results ?? []).map(hydrate.post)
}

export async function getPost(db: D1Database, slug: string) {
  const row = await db.prepare('SELECT * FROM posts WHERE slug = ?1').bind(slug).first<PostRow>()
  return row ? hydrate.post(row) : null
}

export async function getPostById(db: D1Database, id: number) {
  const row = await db.prepare('SELECT * FROM posts WHERE id = ?1').bind(id).first<PostRow>()
  return row ? hydrate.post(row) : null
}

// ---------- Products ----------
export async function listProducts(db: D1Database, opts: { status?: string } = {}) {
  const where = opts.status ? 'WHERE status = ?1' : ''
  const stmt = db.prepare(
    `SELECT * FROM products ${where} ORDER BY featured DESC, id DESC`
  )
  const result = opts.status
    ? await stmt.bind(opts.status).all<ProductRow>()
    : await stmt.all<ProductRow>()
  return (result.results ?? []).map(hydrate.product)
}

export async function getProduct(db: D1Database, slug: string) {
  const row = await db.prepare('SELECT * FROM products WHERE slug = ?1').bind(slug).first<ProductRow>()
  return row ? hydrate.product(row) : null
}

// ---------- Podcasts ----------
export async function listPodcasts(db: D1Database, opts: { status?: string } = {}) {
  const where = opts.status ? 'WHERE status = ?1' : ''
  const stmt = db.prepare(
    `SELECT * FROM podcasts ${where} ORDER BY published_at DESC, id DESC`
  )
  const result = opts.status
    ? await stmt.bind(opts.status).all<PodcastRow>()
    : await stmt.all<PodcastRow>()
  return (result.results ?? []).map(hydrate.podcast)
}

export async function getPodcast(db: D1Database, slug: string) {
  const row = await db.prepare('SELECT * FROM podcasts WHERE slug = ?1').bind(slug).first<PodcastRow>()
  return row ? hydrate.podcast(row) : null
}

// ---------- Videos ----------
export async function listVideos(db: D1Database, opts: { status?: string } = {}) {
  const where = opts.status ? 'WHERE status = ?1' : ''
  const stmt = db.prepare(
    `SELECT * FROM videos ${where} ORDER BY published_at DESC, id DESC`
  )
  const result = opts.status ? await stmt.bind(opts.status).all<VideoRow>() : await stmt.all<VideoRow>()
  return (result.results ?? []).map(hydrate.video)
}

// ---------- Pages ----------
export async function listPages(db: D1Database) {
  const result = await db.prepare('SELECT * FROM pages ORDER BY slug ASC').all<PageRow>()
  return (result.results ?? []).map(hydrate.page)
}

export async function getPage(db: D1Database, slug: string) {
  const row = await db.prepare('SELECT * FROM pages WHERE slug = ?1').bind(slug).first<PageRow>()
  return row ? hydrate.page(row) : null
}

// ---------- Site settings ----------
const SITE_KEY = 'site'
const DEFAULTS: SiteSettings = {
  siteName: 'sankyu.me',
  siteUrl: 'https://sankyu.me',
  siteDescription: '',
  defaultSeoTitle: 'sankyu.me',
  defaultSeoDescription: '',
  defaultOgImage: null,
  mainNav: [],
  socialLinks: [],
  introHeadline: '',
  introBody: '',
  footerEmoji: '👋',
}

export async function getSiteSettings(db: D1Database): Promise<SiteSettings> {
  const row = await db
    .prepare('SELECT value FROM site_settings WHERE key = ?1')
    .bind(SITE_KEY)
    .first<{ value: string }>()
  if (!row) return DEFAULTS
  try {
    return { ...DEFAULTS, ...(JSON.parse(row.value) as Partial<SiteSettings>) }
  } catch {
    return DEFAULTS
  }
}

export async function setSiteSettings(db: D1Database, settings: SiteSettings) {
  await db
    .prepare(
      'INSERT INTO site_settings(key, value) VALUES (?1, ?2) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
    )
    .bind(SITE_KEY, JSON.stringify(settings))
    .run()
}

// ---------- Generic upsert by collection ----------
// Keys must match the table column names; complex values (arrays/objects) are
// JSON-stringified by the caller. Used by both admin handlers and the import script.
export async function upsertBySlug(
  db: D1Database,
  collection: Collection,
  data: Record<string, unknown>
) {
  const cols = Object.keys(data)
  if (cols.length === 0) throw new Error('upsert: empty data')
  const placeholders = cols.map((_, i) => `?${i + 1}`).join(', ')
  const updates = cols
    .filter((c) => c !== 'slug')
    .map((c) => `${c} = excluded.${c}`)
    .concat(`updated_at = CURRENT_TIMESTAMP`)
    .join(', ')
  const sql = `INSERT INTO ${collection} (${cols.join(', ')}) VALUES (${placeholders})
    ON CONFLICT(slug) DO UPDATE SET ${updates}`
  await db.prepare(sql).bind(...cols.map((c) => data[c])).run()
}

export async function deleteBySlug(db: D1Database, collection: Collection, slug: string) {
  await db.prepare(`DELETE FROM ${collection} WHERE slug = ?1`).bind(slug).run()
}
