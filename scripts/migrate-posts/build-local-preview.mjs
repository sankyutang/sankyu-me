#!/usr/bin/env node
/** Offline multi-post preview index from prepared markdoc (local images). */
import { mkdirSync, readFileSync, writeFileSync, cpSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import Markdoc from '@markdoc/markdoc'

const PREP = process.env.MIGRATE_OUT || '/tmp/migrate-10-prepared'
const OUT = process.env.PREVIEW_OUT || '/opt/cursor/artifacts/migrate-nine-preview'
const man = JSON.parse(readFileSync(join(PREP, 'MANIFEST.json'), 'utf8'))

function render(src) {
  return Markdoc.renderers.html(Markdoc.transform(Markdoc.parse(src)))
}

mkdirSync(OUT, { recursive: true })
const cards = []
for (const p of man.posts) {
  const dir = join(PREP, p.slug)
  const post = JSON.parse(readFileSync(join(dir, 'post.json'), 'utf8'))
  let md = readFileSync(join(dir, 'content.markdoc'), 'utf8')
  // local relative images for offline zip
  md = md.replaceAll(`/editor/${post.published_at.slice(0, 4)}/${post.published_at.slice(5, 7)}/${p.slug}/`, 'images/')
  const html = render(md)
  const postOut = join(OUT, p.slug)
  mkdirSync(postOut, { recursive: true })
  if (existsSync(join(dir, 'images'))) cpSync(join(dir, 'images'), join(postOut, 'images'), { recursive: true })
  writeFileSync(
    join(postOut, 'index.html'),
    `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${escape(post.title)} · preview</title><meta name="robots" content="noindex"/><style>body{font-family:system-ui,sans-serif;max-width:720px;margin:2rem auto;padding:0 1rem;line-height:1.7}img{max-width:100%;height:auto}pre{overflow:auto;background:#f6f6f6;padding:1rem}</style></head><body><p><a href="../index.html">← 预览目录</a></p><p>${escape(post.published_at.slice(0,10))} · 三桥</p><h1>${escape(post.title)}</h1>${post.excerpt ? `<p><em>${escape(post.excerpt)}</em></p>` : ''}<article>${html}</article></body></html>`,
  )
  cards.push(`<li><a href="./${p.slug}/index.html">${escape(p.date)} — ${escape(p.title)}</a> (${p.uploads} assets)</li>`)
}
writeFileSync(
  join(OUT, 'index.html'),
  `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"/><title>9 posts migration preview</title><meta name="robots" content="noindex"/></head><body><h1>9 篇迁移本地预览（未发布）</h1><p>不含暂停的年终总结。</p><ol>${cards.join('')}</ol></body></html>`,
)
console.log('preview →', OUT)

function escape(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}
