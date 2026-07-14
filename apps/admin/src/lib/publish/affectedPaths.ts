import type { Collection } from '../db/types'

export type Op = 'upsert' | 'delete'

export interface PathPlan {
  // Object keys (relative to bucket root) to render & upload.
  render: string[]
  // Object keys to delete from the bucket.
  remove: string[]
}

// Map a (collection, slug, op) to the static object keys that need refresh.
// Detail page lives at `<base>/<slug>/index.html`; list at `<listKey>`.
export function planPaths(
  collection: Collection,
  slug: string,
  op: Op,
  ctx: { featured?: boolean } = {}
): PathPlan {
  const detailBase = detailBaseFor(collection)
  const listKey = listKeyFor(collection)
  const detailKey = `${detailBase}/${slug}/index.html`

  const render = new Set<string>()
  const remove = new Set<string>()

  // List + home always re-render (home shows featured / latest from multiple collections)
  render.add(listKey)
  render.add('index.html')

  if (op === 'upsert') {
    render.add(detailKey)
  } else {
    remove.add(detailKey)
  }

  // Pages feed the /pages list; a page slug 'about' also nudges the bespoke About.
  if (collection === 'pages' && slug === 'about') render.add('about/index.html')

  render.add('sitemap.xml')
  render.add('rss.xml')

  void ctx
  return { render: [...render], remove: [...remove] }
}

// Detail base path per collection (Media merges podcasts + videos).
export function detailBaseFor(collection: Collection): string {
  switch (collection) {
    case 'posts':
      return 'posts'
    case 'products':
      return 'products'
    case 'podcasts':
      return 'media/podcasts'
    case 'videos':
      return 'media/videos'
    case 'pages':
      return 'pages'
  }
}

// List page key per collection (podcasts + videos share the merged Media list).
export function listKeyFor(collection: Collection): string {
  switch (collection) {
    case 'posts':
      return 'posts/index.html'
    case 'products':
      return 'products/index.html'
    case 'podcasts':
    case 'videos':
      return 'media/index.html'
    case 'pages':
      return 'pages/index.html'
  }
}

// Used by site_settings: rebuild everything.
export function planFullSite(slugs: {
  posts: string[]
  products: string[]
  podcasts: string[]
  videos: string[]
  pages: string[]
}): PathPlan {
  const render: string[] = [
    'index.html',
    'about/index.html',
    'sitemap.xml',
    'rss.xml',
    '404.html',
    'posts/index.html',
    'products/index.html',
    'media/index.html',
    'pages/index.html',
  ]
  for (const s of slugs.posts) render.push(`posts/${s}/index.html`)
  for (const s of slugs.products) render.push(`products/${s}/index.html`)
  for (const s of slugs.podcasts) render.push(`media/podcasts/${s}/index.html`)
  for (const s of slugs.videos) render.push(`media/videos/${s}/index.html`)
  for (const s of slugs.pages) render.push(`pages/${s}/index.html`)
  return { render, remove: [] }
}
