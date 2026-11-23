#!/usr/bin/env node
/**
 * Build an offline, self-contained preview of the Hokkaido travelogue
 * using the real apps/admin Markdoc renderer + paper reading layout CSS.
 *
 * Does NOT write production D1/R2. Images stay local; paths are relative
 * so the zip opens without a running server.
 */
import { createRequire } from 'node:module'
import { mkdirSync, readFileSync, writeFileSync, cpSync, existsSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import Markdoc from '@markdoc/markdoc'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '../..')
const SRC = process.env.HOKKAIDO_SRC || '/tmp/hokkaido-migration'
const OUT = process.env.HOKKAIDO_OUT || '/opt/cursor/artifacts/hokkaido-migration-preview'
const PAPER_CSS = join(ROOT, 'apps/admin/src/styles/paper.css')

const META = {
  title: '[多图游记]冬天北海道这么大，我们偏要走这里',
  slug: 'travel-in-Hokkaido-japan',
  date: '2013-02-02',
  summary: '南方的孩子冬天去看雪',
  category: '心情随笔',
  tags: ['旅行', '日本', '北海道', '冬天'],
  author: '三桥',
  url: 'https://sankyu.me/posts/travel-in-Hokkaido-japan',
}

function stripFrontMatter(md) {
  if (!md.startsWith('---')) return md
  const end = md.indexOf('\n---', 3)
  if (end === -1) return md
  return md.slice(end + 4).replace(/^\s+/, '')
}

function toMarkdocBody(md) {
  let body = stripFrontMatter(md)
  // DetailShell already renders the title — drop leading H1 duplicate
  body = body.replace(/^#\s+[^\n]+\n+/, '')
  // Keep local relative image paths for offline zip
  return body.trim() + '\n'
}

function renderMarkdoc(source) {
  const ast = Markdoc.parse(source)
  const transformed = Markdoc.transform(ast, { nodes: {}, tags: {} })
  return Markdoc.renderers.html(transformed)
}

function injectLazyAndIds(html) {
  let i = 0
  const toc = []
  let out = html.replace(/<h([23])(\s[^>]*)?>([\s\S]*?)<\/h\1>/gi, (_m, level, attrs = '', inner) => {
    const label = String(inner).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
    if (!label) return `<h${level}${attrs || ''}>${inner}</h${level}>`
    const existing = /id=["']([^"']+)["']/i.exec(attrs || '')
    const id = existing?.[1] || `section-${++i}`
    if (toc.length < 12) toc.push({ id, label: label.slice(0, 48) })
    const cleanedAttrs = (attrs || '').replace(/\s*id=["'][^"']*["']/i, '')
    return `<h${level}${cleanedAttrs} id="${id}">${inner}</h${level}>`
  })
  out = out.replace(/<img\b([^>]*?)>/gi, (_m, attrs) => {
    let a = attrs
    if (!/\bloading=/.test(a)) a += ' loading="lazy"'
    if (!/\bdecoding=/.test(a)) a += ' decoding="async"'
    return `<img${a}>`
  })
  return { html: out, toc }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildPage({ contentHtml, toc, paperCss }) {
  const tocHtml = toc.length
    ? `<nav class="toc" aria-label="目录"><p class="kicker">目录</p><ol>${toc
        .map((t) => `<li><a href="#${escapeHtml(t.id)}">${escapeHtml(t.label)}</a></li>`)
        .join('')}</ol></nav>`
    : ''

  const tagsLabel = META.category
  return `<!DOCTYPE html>
<html lang="zh-CN" data-theme="light" data-font="sans">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(META.title)} · 迁移预览（未发布）</title>
<meta name="description" content="${escapeHtml(META.summary)}" />
<meta name="robots" content="noindex,nofollow" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" />
<style>
${paperCss}
/* Preview-only layout chrome mirroring DetailShell / PaperLayout */
body.paper-bg { margin: 0; }
.preview-banner {
  background: #fff3cd; color: #664d03; border-bottom: 1px solid #ffecb5;
  padding: 0.65rem 1.25rem; font-size: 0.85rem; text-align: center;
}
.site-header-bar {
  max-width: 67.5rem; margin: 0 auto; padding: 0 1.25rem;
  min-height: 4rem; display: grid; grid-template-columns: 2.5rem 1fr auto;
  align-items: center; gap: 0.75rem;
}
.site-brand { justify-self: center; font-family: var(--font-display); font-weight: 700;
  font-size: 1.25rem; text-decoration: none; color: var(--ink-900); }
.article-wrap { max-width: 45rem; margin: 0 auto; padding: 2rem 1.25rem 4rem; }
.article-kicker { font-size: 0.8125rem; color: var(--ink-500); font-weight: 600; margin: 0 0 0.5rem; }
.article-title { font-family: var(--font-display); font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700; line-height: 1.35; color: var(--ink-900); margin: 0; overflow-wrap: anywhere; }
.article-summary { margin: 1rem 0 0; color: var(--ink-500); font-size: 1.05rem; line-height: 1.75; }
.article-meta { margin-top: 1.25rem; display: flex; flex-wrap: wrap; align-items: center;
  gap: 0.5rem 0.65rem; color: var(--ink-500); font-size: 0.9rem; }
.cover-none { margin: 1.5rem 0 2rem; padding: 1.25rem 1.35rem; border: 1px solid var(--paper-300);
  border-radius: var(--radius); background: linear-gradient(#eef1f4, #e4e8ec); color: var(--ink-300); font-size: 0.85rem; }
.side-meta { margin: 0 0 2rem; padding: 0; list-style: none; display: grid; gap: 0.35rem;
  font-size: 0.85rem; color: var(--ink-500); }
.side-meta strong { color: var(--ink-800); font-weight: 600; margin-right: 0.35rem; }
.toc { margin: 0 0 2rem; padding: 1rem 0 0; border-top: 1px solid var(--paper-300); }
.toc ol { margin: 0.5rem 0 0; padding-left: 1.1rem; }
.toc a { text-decoration: none; color: var(--ink-700); }
.toc a:hover { color: var(--accent); }
.preview-note { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--paper-300);
  font-size: 0.8rem; color: var(--ink-300); }
/* Travelogue photos: contain within prose width without stretching small GIFs */
.prose-article :where(img) {
  display: block;
  width: auto;
  max-width: 100%;
  height: auto;
  margin: 1.5em auto;
  border-radius: var(--radius);
}
@media (max-width: 640px) {
  .site-header-bar { padding: 0 1rem; }
  .article-wrap { padding: 1.25rem 1rem 3rem; }
}
</style>
</head>
<body class="paper-bg antialiased">
  <div class="preview-banner">
    迁移排版预览 · 未写入生产 D1/R2 · slug <code>${escapeHtml(META.slug)}</code> · 打开本 HTML 即可离线查看
  </div>
  <header class="site-header" style="background: rgba(255,255,255,0.96); border-bottom: 1px solid var(--paper-300);">
    <div class="site-header-bar">
      <span aria-hidden="true" style="width:2rem;height:2rem;border-radius:50%;background:var(--ink-900);display:inline-block;"></span>
      <a class="site-brand" href="${escapeHtml(META.url)}">sankyu.me</a>
      <span style="font-size:0.8rem;color:var(--ink-300);">预览</span>
    </div>
  </header>
  <main>
    <article class="article-wrap">
      <p class="article-kicker">${escapeHtml(tagsLabel)}</p>
      <h1 class="article-title">${escapeHtml(META.title)}</h1>
      <p class="article-summary">${escapeHtml(META.summary)}</p>
      <div class="article-meta">
        <span>${escapeHtml(META.author)}</span>
        <span aria-hidden="true">·</span>
        <span>${escapeHtml(META.date)}</span>
      </div>
      <div class="cover-none" role="note">本文无独立封面图（不使用 Notion Unsplash 封面）</div>
      <ul class="side-meta">
        <li><strong>日期</strong>${escapeHtml(META.date)}</li>
        <li><strong>标签</strong>${escapeHtml(META.tags.join('、'))}</li>
        <li><strong>分类</strong>${escapeHtml(META.category)}</li>
        <li><strong>正式 URL</strong><a href="${escapeHtml(META.url)}">${escapeHtml(META.url)}</a></li>
      </ul>
      ${tocHtml}
      <div class="prose-article">
${contentHtml}
      </div>
      <p class="preview-note">
        预览包由 scripts/hokkaido-preview/build-preview.mjs 生成；正文 Markdoc 渲染路径与 apps/admin 一致。
        确认上线前请勿当作已发布内容。
      </p>
    </article>
  </main>
</body>
</html>
`
}

function sqlEscape(s) {
  return String(s).replace(/'/g, "''")
}

function main() {
  if (!existsSync(join(SRC, 'blog-ready.md'))) {
    console.error('Missing blog-ready.md in', SRC)
    process.exit(1)
  }
  const md = readFileSync(join(SRC, 'blog-ready.md'), 'utf8')
  const markdoc = toMarkdocBody(md)
  const rawHtml = renderMarkdoc(markdoc)
  const { html: contentHtml, toc } = injectLazyAndIds(rawHtml)

  const imgRefs = [...markdoc.matchAll(/!\[[^\]]*\]\((images\/[^)]+)\)/g)].map((m) => m[1])
  const uniqueImgs = [...new Set(imgRefs)]

  // Reset output
  rmSync(OUT, { recursive: true, force: true })
  mkdirSync(join(OUT, 'images'), { recursive: true })
  mkdirSync(join(OUT, 'source'), { recursive: true })

  cpSync(join(SRC, 'images'), join(OUT, 'images'), { recursive: true })
  writeFileSync(join(OUT, 'source', 'content.markdoc'), markdoc)
  writeFileSync(join(OUT, 'source', 'blog-ready.md'), md)
  cpSync(join(SRC, 'MIGRATION-REPORT.md'), join(OUT, 'source', 'MIGRATION-REPORT.md'))
  cpSync(join(SRC, 'image-inventory.json'), join(OUT, 'source', 'image-inventory.json'))

  let paperCss = readFileSync(PAPER_CSS, 'utf8')
  // Preview applies the same max-width:auto rule we propose for production compat
  paperCss = paperCss.replace(
    /\.prose-article :where\(img\) \{[\s\S]*?\}/,
    `.prose-article :where(img) {
  display: block;
  width: auto;
  max-width: 100%;
  height: auto;
  margin: 1.5em auto;
  border-radius: var(--radius);
}`,
  )

  const page = buildPage({ contentHtml, toc, paperCss })
  writeFileSync(join(OUT, 'index.html'), page)

  // Fixture SQL for local D1 (paths use /hokkaido-preview/ for wrangler pages preview)
  const markdocForLocal = markdoc.replaceAll('(images/', '(/hokkaido-preview/images/')
  const fixtureSql = `-- Local-only fixture: Hokkaido full travelogue preview
-- DO NOT run with --remote
UPDATE posts SET
  title = '${sqlEscape(META.title)}',
  excerpt = '${sqlEscape(META.summary)}',
  cover_image = NULL,
  status = 'published',
  published_at = '2013-02-02T00:00:00.000Z',
  featured = 0,
  category = '${sqlEscape(META.category)}',
  tags = '${sqlEscape(JSON.stringify(META.tags))}',
  seo_title = '${sqlEscape(META.title)}',
  seo_description = '${sqlEscape(META.summary)}',
  og_image = NULL,
  content_markdoc = '${sqlEscape(markdocForLocal)}',
  updated_at = datetime('now')
WHERE slug = 'travel-in-Hokkaido-japan';

INSERT INTO posts (slug, title, excerpt, cover_image, status, published_at, featured, category, tags, seo_title, seo_description, og_image, related_posts, content_markdoc)
SELECT
  'travel-in-Hokkaido-japan',
  '${sqlEscape(META.title)}',
  '${sqlEscape(META.summary)}',
  NULL,
  'published',
  '2013-02-02T00:00:00.000Z',
  0,
  '${sqlEscape(META.category)}',
  '${sqlEscape(JSON.stringify(META.tags))}',
  '${sqlEscape(META.title)}',
  '${sqlEscape(META.summary)}',
  NULL,
  '[]',
  '${sqlEscape(markdocForLocal)}'
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE slug = 'travel-in-Hokkaido-japan');
`
  const fixtureDir = join(ROOT, 'apps/admin/fixtures')
  writeFileSync(join(fixtureDir, 'hokkaido-preview-post.sql'), fixtureSql)
  writeFileSync(join(OUT, 'source', 'hokkaido-preview-post.sql'), fixtureSql)

  // Stats
  const stats = {
    title: META.title,
    slug: META.slug,
    date: META.date,
    summary: META.summary,
    author: META.author,
    category: META.category,
    tags: META.tags,
    image_positions: imgRefs.length,
    unique_images: uniqueImgs.length,
    gif_separator_refs: imgRefs.filter((p) => p.endsWith('.gif')).length,
    toc_items: toc.length,
    markdoc_chars: markdoc.length,
    html_chars: contentHtml.length,
    out: OUT,
  }
  writeFileSync(join(OUT, 'PREVIEW-STATS.json'), JSON.stringify(stats, null, 2))
  console.log(JSON.stringify(stats, null, 2))
}

main()
