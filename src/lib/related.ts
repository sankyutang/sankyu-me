// Build the cross-module "RELATED" list — port of getCrossRelated() from pages.jsx,
// with hash navigation replaced by route hrefs.
import type { Post, Product, Podcast, Video } from './data-source/types'
import type { RelatedItem } from '@/components/react/shells'
import { postHref, productHref, podcastHref, videoHref } from './links'

interface Pools {
  posts: Post[]
  products: Product[]
  podcasts: Podcast[]
  videos: Video[]
}

export function buildCrossRelated(currentModule: string, pools: Pools): RelatedItem[] {
  const items: RelatedItem[] = []
  if (currentModule !== 'posts' && pools.posts[0]) {
    const p = pools.posts[0]
    items.push({ id: p.id, kicker: 'POST · 文章', title: p.title_zh, excerpt: p.excerpt, meta: p.date, href: postHref(p.id) })
  }
  if (currentModule !== 'products' && pools.products[0]) {
    const p = pools.products[0]
    items.push({ id: p.id, kicker: 'PRODUCT · 产品', title: p.name_en, excerpt: p.desc, meta: p.mrr, href: productHref(p.id) })
  }
  if (currentModule !== 'podcasts' && items.length < 3 && pools.podcasts[0]) {
    const p = pools.podcasts[0]
    items.push({ id: p.id, kicker: 'PODCAST · 播客', title: p.title, excerpt: p.desc, meta: p.ep + ' · ' + p.duration, href: podcastHref(p.id) })
  }
  if (currentModule !== 'videos' && items.length < 3 && pools.videos[0]) {
    const p = pools.videos[0]
    items.push({ id: p.id, kicker: 'VIDEO · 视频', title: p.title, excerpt: p.platform + ' · ' + p.views + ' views', meta: p.duration, href: videoHref(p.id) })
  }
  return items.slice(0, 3)
}
