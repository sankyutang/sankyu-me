#!/usr/bin/env node
/**
 * Prepare 9 approved Notion→blog posts for D1/R2 import.
 * Reads packages from MIGRATE_SRC (default /tmp/migrate-10).
 * Writes markdoc + upload manifest under MIGRATE_OUT (default /tmp/migrate-10-prepared).
 *
 * Does NOT touch production. Never includes the paused annual-review package.
 */
import { mkdirSync, readFileSync, writeFileSync, cpSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, extname, basename } from 'node:path'
import { createHash } from 'node:crypto'

const SRC = process.env.MIGRATE_SRC || '/tmp/migrate-10'
const OUT = process.env.MIGRATE_OUT || '/tmp/migrate-10-prepared'

/** Newest → oldest; excludes paused 2025-annual-review. */
const POSTS = [
  'thinking-and-understanding-of-front-end-technology-in-2025',
  'monthly-202405-issue',
  'summary-of-2023',
  'rediscover-hongkong',
  'grown-of-the-front-end-team-in-2022',
  'awesome-indie-hacker-tools',
  'travel-in-varanasi-india',
  'travel-in-tasmania',
  'travel-study-ow-in-madakim-malaysia',
]

const MIME = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
}

function stripFrontMatter(md) {
  if (!md.startsWith('---')) return { fm: '', body: md }
  const end = md.indexOf('\n---', 3)
  if (end === -1) return { fm: '', body: md }
  return { fm: md.slice(3, end), body: md.slice(end + 4).replace(/^\s+/, '') }
}

function ymFromDate(dateStr) {
  const [y, m] = String(dateStr).slice(0, 10).split('-')
  return { y, m }
}

/** Convert simple Notion-exported HTML tables to GFM markdown tables. */
function htmlTablesToMarkdown(md) {
  return md.replace(/<table>[\s\S]*?<\/table>/gi, (block) => {
    const rows = [...block.matchAll(/<tr>([\s\S]*?)<\/tr>/gi)].map((m) => m[1])
    if (!rows.length) return block
    const cells = rows.map((row) =>
      [...row.matchAll(/<t[dh]>([\s\S]*?)<\/t[dh]>/gi)].map((c) => {
        let t = c[1]
        t = t.replace(/\*\*([^*]+)\*\*/g, '**$1**')
        t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '[$1]($2)')
        t = t.replace(/<[^>]+>/g, '')
        t = t.replace(/\s+/g, ' ').trim()
        t = t.replace(/\|/g, '\\|')
        return t || ' '
      }),
    )
    const width = Math.max(...cells.map((r) => r.length), 1)
    const norm = cells.map((r) => {
      const x = [...r]
      while (x.length < width) x.push(' ')
      return x
    })
    const header = norm[0]
    const sep = header.map(() => '---')
    const body = norm.slice(1)
    const lines = [
      `| ${header.join(' | ')} |`,
      `| ${sep.join(' | ')} |`,
      ...body.map((r) => `| ${r.join(' | ')} |`),
    ]
    return `\n${lines.join('\n')}\n`
  })
}

function codeTagsToBackticks(md) {
  return md.replace(/<code>([\s\S]*?)<\/code>/gi, (_, inner) => {
    const t = String(inner).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    if (t.includes('`')) return `\`${t.replace(/`/g, "'")}\``
    return `\`${t}\``
  })
}

function toMarkdoc(body, slug, date) {
  let md = body
  md = md.replace(/^#\s+[^\n]+\n+/, '')
  md = htmlTablesToMarkdown(md)
  md = codeTagsToBackticks(md)
  const { y, m } = ymFromDate(date)
  const prefix = `/editor/${y}/${m}/${slug}`
  md = md.replace(/!\[([^\]]*)\]\(images\/([^)]+)\)/g, (_, alt, file) => {
    // HEIC already converted to jpg in source tree
    const f = file.replace(/\.heic$/i, '.jpg')
    return `![${alt}](${prefix}/${f})`
  })
  return md.trim() + '\n'
}

function ctypeFor(file) {
  return MIME[extname(file).toLowerCase()] || 'application/octet-stream'
}

function collectUploads(dir, slug, date, coverOk) {
  const { y, m } = ymFromDate(date)
  const uploads = []
  const imagesDir = join(dir, 'images')
  if (existsSync(imagesDir)) {
    for (const name of readdirSync(imagesDir).sort()) {
      if (name.startsWith('.')) continue
      if (/\.heic$/i.test(name)) continue // originals kept aside; use jpg
      const abs = join(imagesDir, name)
      if (!statSync(abs).isFile()) continue
      const buf = readFileSync(abs)
      uploads.push({
        local: abs,
        key: `editor/${y}/${m}/${slug}/${name}`,
        contentType: ctypeFor(name),
        bytes: buf.length,
        sha256: createHash('sha256').update(buf).digest('hex'),
        role: 'body',
      })
    }
  }
  const coverDir = join(dir, 'cover')
  if (coverOk && existsSync(coverDir)) {
    for (const name of readdirSync(coverDir).sort()) {
      if (name.startsWith('.')) continue
      const abs = join(coverDir, name)
      if (!statSync(abs).isFile()) continue
      const ext = extname(name).toLowerCase() || '.jpg'
      const buf = readFileSync(abs)
      uploads.push({
        local: abs,
        key: `editor/${y}/${m}/${slug}/cover${ext}`,
        contentType: ctypeFor(name),
        bytes: buf.length,
        sha256: createHash('sha256').update(buf).digest('hex'),
        role: 'cover',
      })
    }
  }
  return uploads
}

function coverDecision(meta) {
  const cover = meta.cover
  if (!cover || cover.present === false) return { use: false, reason: 'no_cover' }
  if (cover.unstable || cover.status === 'failed') return { use: false, reason: 'unstable_unsplash_or_failed' }
  if (cover.status === 'ok' && cover.local_file) return { use: true, reason: 'ok_local' }
  // cover files present on disk even if metadata path differs
  return { use: cover.status === 'ok', reason: cover.status || 'unknown' }
}

mkdirSync(OUT, { recursive: true })
const manifest = []

for (const slug of POSTS) {
  const dir = join(SRC, slug)
  if (!existsSync(dir)) throw new Error(`missing package: ${dir}`)
  const meta = JSON.parse(readFileSync(join(dir, 'metadata.json'), 'utf8'))
  const raw = readFileSync(join(dir, 'blog-ready.md'), 'utf8')
  const { body } = stripFrontMatter(raw)
  const date = meta.date
  const cover = coverDecision(meta)
  // Disk may still have cover/ even when unstable — only use when approved
  const hasCoverFiles = existsSync(join(dir, 'cover')) && readdirSync(join(dir, 'cover')).length > 0
  const useCover = cover.use && hasCoverFiles

  const markdoc = toMarkdoc(body, slug, date)
  const uploads = collectUploads(dir, slug, date, useCover)
  const coverUpload = uploads.find((u) => u.role === 'cover')

  const excerpt =
    meta.summary === null || meta.summary === undefined || meta.summary === ''
      ? null
      : String(meta.summary)

  const outDir = join(OUT, slug)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'content.markdoc'), markdoc)
  writeFileSync(
    join(outDir, 'post.json'),
    JSON.stringify(
      {
        slug: meta.slug,
        title: meta.title,
        excerpt,
        category: meta.category || null,
        tags: meta.tags || [],
        published_at: `${date}T00:00:00.000Z`,
        author: meta.author || '三桥',
        cover_image: coverUpload ? `https://sankyu.me/${coverUpload.key}` : null,
        seo_title: meta.title,
        seo_description: excerpt,
        status: 'published',
        cover_decision: { ...cover, useCover },
        image_count: uploads.filter((u) => u.role === 'body').length,
        markdoc_bytes: Buffer.byteLength(markdoc),
      },
      null,
      2,
    ),
  )
  writeFileSync(join(outDir, 'uploads.json'), JSON.stringify(uploads, null, 2))

  // copy images for local preview (already converted HEIC→jpg in SRC)
  const imgOut = join(outDir, 'images')
  if (existsSync(join(dir, 'images'))) cpSync(join(dir, 'images'), imgOut, { recursive: true })
  if (useCover && existsSync(join(dir, 'cover'))) cpSync(join(dir, 'cover'), join(outDir, 'cover'), { recursive: true })

  manifest.push({
    slug,
    date,
    title: meta.title,
    excerpt,
    cover: coverUpload?.key || null,
    uploads: uploads.length,
    markdoc_bytes: Buffer.byteLength(markdoc),
  })
  console.log(`OK ${date} ${slug} uploads=${uploads.length} cover=${useCover} markdoc=${Buffer.byteLength(markdoc)}`)
}

writeFileSync(join(OUT, 'MANIFEST.json'), JSON.stringify({ generated_at: new Date().toISOString(), posts: manifest }, null, 2))
const allUploads = []
for (const slug of POSTS) {
  const uploads = JSON.parse(readFileSync(join(OUT, slug, 'uploads.json'), 'utf8'))
  allUploads.push(...uploads)
}
writeFileSync(join(OUT, 'ALL-UPLOADS.json'), JSON.stringify(allUploads, null, 2))
console.log(`\nPrepared ${manifest.length} posts, ${allUploads.length} upload objects → ${OUT}`)
