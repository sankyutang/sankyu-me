/**
 * One-shot importer: read legacy `src/content/*` (Keystatic format) and emit a
 * SQL seed file you can pipe into D1:
 *
 *   npx tsx scripts/import-content.ts > apps/admin/migrations/0002_seed.sql
 *   cd apps/admin && wrangler d1 execute sankyume_admin --local --file=migrations/0002_seed.sql
 *   # or --remote
 *
 * Run from the monorepo root. Output is pure SQL on stdout.
 */
import fs from 'node:fs'
import path from 'node:path'
import { parse as parseYaml } from 'yaml'

const ROOT = path.resolve(process.cwd(), 'src/content')

interface Frontmatter {
  [key: string]: any
}

function sq(s: string | null | undefined): string {
  if (s === null || s === undefined) return 'NULL'
  return `'${String(s).replace(/'/g, "''")}'`
}
function jsonLit(v: any): string {
  return sq(JSON.stringify(v ?? []))
}
function intLit(b: boolean | undefined | null): string {
  return b ? '1' : '0'
}
function numLit(n: number | undefined | null): string {
  return n === null || n === undefined || Number.isNaN(Number(n)) ? 'NULL' : String(Number(n))
}
function tsLit(s: string | null | undefined): string {
  if (!s) return 'NULL'
  const d = new Date(s)
  return isNaN(d.getTime()) ? 'NULL' : sq(d.toISOString())
}

function splitFrontmatter(raw: string): { data: Frontmatter; body: string } {
  if (!raw.startsWith('---')) return { data: {}, body: raw }
  const end = raw.indexOf('\n---', 3)
  if (end === -1) return { data: {}, body: raw }
  const yamlText = raw.slice(3, end).replace(/^\n/, '')
  const body = raw.slice(end + 4).replace(/^\n/, '')
  return { data: parseYaml(yamlText) ?? {}, body }
}

function readEntry(filePath: string): { slug: string; data: Frontmatter; body: string } | null {
  // Two layouts:
  //   1) collection/<slug>.{md,mdoc,yaml}                — single file
  //   2) collection/<slug>/index.{md,mdoc}               — directory with body file
  // (Keystatic with format.contentField uses .mdoc; videos use yaml-only.)
  const stat = fs.statSync(filePath)
  if (stat.isDirectory()) {
    const slug = path.basename(filePath)
    const indexCandidates = ['index.mdoc', 'index.md', 'content.mdoc', 'content.md']
    let body = ''
    let data: Frontmatter = {}
    // Keystatic actually stores: <slug>.mdoc next to <slug>/ for the body images.
    // Frontmatter lives in <slug>.mdoc (sibling file) — handled by caller.
    for (const c of indexCandidates) {
      const p = path.join(filePath, c)
      if (fs.existsSync(p)) {
        const parsed = splitFrontmatter(fs.readFileSync(p, 'utf8'))
        data = parsed.data
        body = parsed.body
        break
      }
    }
    return { slug, data, body }
  }
  const slug = path.basename(filePath).replace(/\.(md|mdoc|yaml|yml|json)$/i, '')
  const raw = fs.readFileSync(filePath, 'utf8')
  if (filePath.endsWith('.yaml') || filePath.endsWith('.yml')) {
    return { slug, data: parseYaml(raw) ?? {}, body: '' }
  }
  if (filePath.endsWith('.json')) {
    return { slug, data: JSON.parse(raw), body: '' }
  }
  const parsed = splitFrontmatter(raw)
  return { slug, data: parsed.data, body: parsed.body }
}

function walkCollection(dir: string): { slug: string; data: Frontmatter; body: string }[] {
  if (!fs.existsSync(dir)) return []
  // Group: for each <slug>.mdoc that has a sibling <slug>/ directory, merge.
  const items: { slug: string; data: Frontmatter; body: string }[] = []
  const entries = fs.readdirSync(dir)
  const dirs = new Set(entries.filter((e) => fs.statSync(path.join(dir, e)).isDirectory()))
  for (const entry of entries) {
    const full = path.join(dir, entry)
    const stat = fs.statSync(full)
    if (stat.isDirectory()) {
      // Skip if a matching <entry>.mdoc exists — it carries frontmatter; merge there.
      if (entries.includes(`${entry}.mdoc`) || entries.includes(`${entry}.md`)) continue
      const read = readEntry(full)
      if (read) items.push(read)
      continue
    }
    const base = entry.replace(/\.(md|mdoc|yaml|yml|json)$/i, '')
    const read = readEntry(full)
    if (!read) continue
    // If a sibling directory exists, try to read body from there too.
    if (dirs.has(base) && !read.body) {
      const dirRead = readEntry(path.join(dir, base))
      if (dirRead?.body) read.body = dirRead.body
    }
    items.push({ ...read, slug: base })
  }
  return items
}

// ----- collection -> row builders -----
function postRow(slug: string, d: Frontmatter, body: string): string {
  return `INSERT INTO posts (slug, title, excerpt, cover_image, status, published_at, featured, category, tags, reading_time, seo_title, seo_description, og_image, canonical_url, related_posts, content_markdoc) VALUES (
    ${sq(slug)}, ${sq(d.title)}, ${sq(d.excerpt)}, ${sq(d.coverImage)}, ${sq(d.status ?? 'draft')}, ${tsLit(d.publishedAt)},
    ${intLit(d.featured)}, ${sq(d.category)}, ${jsonLit(d.tags ?? [])}, ${numLit(d.readingTime)},
    ${sq(d.seoTitle)}, ${sq(d.seoDescription)}, ${sq(d.ogImage)}, ${sq(d.canonicalUrl)},
    ${jsonLit(d.relatedPosts ?? [])}, ${sq(body)}
  );`
}
function pageRow(slug: string, d: Frontmatter, body: string): string {
  const a = d as any
  return `INSERT INTO pages (slug, title, title_en, kind, category, glyph, excerpt, cover_color, published_at, seo_title, seo_description, og_image, content_markdoc) VALUES (
    ${sq(slug)}, ${sq(d.title)}, ${sq(a.titleEn)}, ${sq(a.kind ?? 'static')}, ${sq(a.category)}, ${sq(a.glyph)}, ${sq(a.excerpt)}, ${sq(a.coverColor ?? '#c8553d')}, ${tsLit(a.publishedAt)}, ${sq(d.seoTitle)}, ${sq(d.seoDescription)}, ${sq(d.ogImage)}, ${sq(body)}
  );`
}
function productRow(slug: string, d: Frontmatter, body: string): string {
  return `INSERT INTO products (slug, name, summary, cover_image, status, product_type, price_text, external_url, cta_text, featured, tags, highlights, audience, faq, related_posts, seo_title, seo_description, og_image, content_markdoc) VALUES (
    ${sq(slug)}, ${sq(d.name ?? d.title)}, ${sq(d.summary)}, ${sq(d.coverImage)}, ${sq(d.status ?? 'active')}, ${sq(d.productType ?? 'digital-product')},
    ${sq(d.priceText)}, ${sq(d.externalUrl)}, ${sq(d.ctaText ?? 'Get it')}, ${intLit(d.featured)},
    ${jsonLit(d.tags ?? [])}, ${jsonLit(d.highlights ?? [])}, ${jsonLit(d.audience ?? [])}, ${jsonLit(d.faq ?? [])}, ${jsonLit(d.relatedPosts ?? [])},
    ${sq(d.seoTitle)}, ${sq(d.seoDescription)}, ${sq(d.ogImage)}, ${sq(body)}
  );`
}
function podcastRow(slug: string, d: Frontmatter, body: string): string {
  const a = d as any
  return `INSERT INTO podcasts (slug, title, excerpt, cover_image, audio_url, duration, ep, guest, cover_color, chapters, published_at, status, external_links, related_posts, seo_title, seo_description, og_image, content_markdoc) VALUES (
    ${sq(slug)}, ${sq(d.title)}, ${sq(d.excerpt)}, ${sq(d.coverImage)}, ${sq(d.audioUrl)}, ${sq(d.duration)}, ${sq(a.ep)}, ${sq(a.guest)}, ${sq(a.coverColor ?? '#c8553d')}, ${jsonLit(a.chapters ?? [])}, ${tsLit(d.publishedAt)},
    ${sq(d.status ?? 'draft')}, ${jsonLit(d.externalLinks ?? [])}, ${jsonLit(d.relatedPosts ?? [])},
    ${sq(d.seoTitle)}, ${sq(d.seoDescription)}, ${sq(d.ogImage)}, ${sq(body)}
  );`
}
function videoRow(slug: string, d: Frontmatter): string {
  const a = d as any
  return `INSERT INTO videos (slug, title, platform, video_url, thumbnail, description, duration, views, likes, tags, cover_color, published_at, status) VALUES (
    ${sq(slug)}, ${sq(d.title)}, ${sq(d.platform ?? 'youtube')}, ${sq(d.videoUrl)}, ${sq(d.thumbnail)}, ${sq(d.description)}, ${sq(a.duration)}, ${sq(a.views)}, ${sq(a.likes)}, ${jsonLit(a.tags ?? [])}, ${sq(a.coverColor ?? '#c8553d')}, ${tsLit(d.publishedAt)}, ${sq(d.status ?? 'draft')}
  );`
}

function out(line: string) {
  process.stdout.write(line + '\n')
}

function main() {
  out('-- Seed data imported from src/content/')
  // D1 wraps each migration in its own transaction; do not emit BEGIN/COMMIT.
  for (const item of walkCollection(path.join(ROOT, 'posts'))) out(postRow(item.slug, item.data, item.body))
  for (const item of walkCollection(path.join(ROOT, 'pages'))) out(pageRow(item.slug, item.data, item.body))
  for (const item of walkCollection(path.join(ROOT, 'products'))) out(productRow(item.slug, item.data, item.body))
  for (const item of walkCollection(path.join(ROOT, 'podcasts'))) out(podcastRow(item.slug, item.data, item.body))
  for (const item of walkCollection(path.join(ROOT, 'videos'))) out(videoRow(item.slug, item.data))

  // site settings
  const ssCandidates = [
    path.join(ROOT, 'site-settings.json'),
    path.join(ROOT, 'site-settings', 'site-settings.json'),
    path.join(ROOT, 'site-settings', 'index.json'),
  ]
  for (const p of ssCandidates) {
    if (fs.existsSync(p)) {
      const json = JSON.parse(fs.readFileSync(p, 'utf8'))
      out(`INSERT INTO site_settings (key, value) VALUES ('site', ${sq(JSON.stringify(json))});`)
      break
    }
  }
}

main()
