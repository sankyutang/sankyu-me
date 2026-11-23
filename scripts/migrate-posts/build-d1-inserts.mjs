#!/usr/bin/env node
/**
 * Emit SQL INSERT statements for prepared posts (stdout).
 * Idempotent: DELETE BY slug then INSERT (never touches other slugs).
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const PREP = process.env.MIGRATE_OUT || '/tmp/migrate-10-prepared'
const man = JSON.parse(readFileSync(join(PREP, 'MANIFEST.json'), 'utf8'))

function sq(s) {
  if (s === null || s === undefined) return 'NULL'
  return `'${String(s).replace(/'/g, "''")}'`
}

const lines = ['BEGIN;']
for (const p of man.posts) {
  const post = JSON.parse(readFileSync(join(PREP, p.slug, 'post.json'), 'utf8'))
  const body = readFileSync(join(PREP, p.slug, 'content.markdoc'), 'utf8')
  lines.push(`DELETE FROM posts WHERE slug = ${sq(post.slug)};`)
  lines.push(
    `INSERT INTO posts (slug, title, excerpt, cover_image, status, published_at, featured, category, tags, seo_title, seo_description, content_markdoc, created_at, updated_at)
VALUES (
  ${sq(post.slug)},
  ${sq(post.title)},
  ${sq(post.excerpt)},
  ${sq(post.cover_image)},
  'published',
  ${sq(post.published_at)},
  0,
  ${sq(post.category)},
  ${sq(JSON.stringify(post.tags || []))},
  ${sq(post.seo_title)},
  ${sq(post.seo_description)},
  ${sq(body)},
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);`,
  )
}
lines.push('COMMIT;')
process.stdout.write(lines.join('\n') + '\n')
