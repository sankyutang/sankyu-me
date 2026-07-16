import type { Collection } from '../db/types'

export type Op = 'upsert' | 'delete'

export interface PathPlan {
  // Object keys (relative to bucket root) to render & upload.
  render: string[]
  // Object keys to delete from the bucket.
  remove: string[]
}

// Map a (collection, slug, op) to the static object keys that need refresh.
// Detail page lives at `<base>/<slug>/index.html`; list at `<base>/index.html`.
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

  // Featured items appear on home — already covered above. Sitemap always refreshed.
  render.add('sitemap.xml')
  render.add('rss.xml')

  // Featured nudges home; nothing extra here since we always rebuild home.
  void ctx

  return { render: [...render], remove: [...remove] }
}

export function detailBaseFor(collection: Collection): string {
  switch (collection) {
    case 'posts':
      return 'blog'
    case 'products':
      return 'products'
    case 'podcasts':
      return 'podcast'
    case 'videos':
      return 'videos'
    case 'pages':
      return '' // top-level pages: /about/index.html
  }
}

export function listKeyFor(collection: Collection): string {
  const base = detailBaseFor(collection)
  return base ? `${base}/index.html` : 'index.html'
}

// Used by site_settings: rebuild everything.
export function planFullSite(slugs: {
  posts: string[]
  products: string[]
  podcasts: string[]
  videos: string[]
  pages: string[]
}): PathPlan {
  const render: string[] = ['index.html', 'sitemap.xml', 'rss.xml', '404.html']
  render.push('blog/index.html', 'products/index.html', 'podcast/index.html', 'videos/index.html')
  for (const s of slugs.posts) render.push(`blog/${s}/index.html`)
  for (const s of slugs.products) render.push(`products/${s}/index.html`)
  for (const s of slugs.podcasts) render.push(`podcast/${s}/index.html`)
  // videos collection currently only has a list view
  for (const s of slugs.pages) render.push(`${s}/index.html`)
  return { render, remove: [] }
}
