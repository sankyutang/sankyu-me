// Maps D1 hydrated rows → the design component prop shapes (data-source/types).
import type {
  Post as PostRowH,
  Product as ProductRowH,
  Podcast as PodcastRowH,
  Video as VideoRowH,
  Page as PageRowH,
  SiteSettings,
} from './db/types'
import type {
  Post,
  Product,
  Podcast,
  Video,
  PageEntry,
  MediaItem,
  Profile,
  SocialLink,
} from './data-source/types'

const FALLBACK_COLOR = '#c8553d'

function assetUrl(base: string | undefined, src: string | null): string | undefined {
  if (!src) return undefined
  if (/^https?:\/\//.test(src)) return src
  if (!base) return src
  return `${base.replace(/\/$/, '')}/${src.replace(/^\//, '')}`
}

export function platformLabel(p: string | undefined | null): string {
  if (!p) return ''
  if (p.toLowerCase() === 'youtube') return 'YouTube'
  if (p.toLowerCase() === 'bilibili') return 'Bilibili'
  return p
}

export function socialIdFromPlatform(platform: string): string {
  const p = platform.toLowerCase()
  if (p.includes('twitter') || p === 'x') return 'x'
  if (p.includes('github')) return 'github'
  if (p.includes('weibo') || p.includes('微博')) return 'weibo'
  if (p.includes('小红书') || p.includes('xhs') || p.includes('red')) return 'xhs'
  if (p.includes('wechat') || p.includes('微信')) return 'wechat'
  if (p.includes('bilibili')) return 'bilibili'
  if (p.includes('youtube')) return 'youtube'
  if (p.includes('rss')) return 'rss'
  if (p.includes('mail') || p.includes('email')) return 'mail'
  return p
}

const PRODUCT_STATUS_MAP: Record<string, string> = {
  active: 'Live',
  'coming-soon': 'Beta',
  archived: 'Sunset',
}

export function adaptPost(r: PostRowH, assetBase?: string): Post {
  return {
    id: r.slug,
    title_zh: r.title,
    title_en: '',
    kicker: r.category || 'Essay · 札记',
    excerpt: r.excerpt || '',
    cover_color: FALLBACK_COLOR,
    cover_src: assetUrl(assetBase, r.cover_image),
    date: r.published_at ?? '',
    reading: r.reading_time ? `${r.reading_time} min` : '',
    tag: r.category || '文章',
    cover_emoji: '✒︎',
  }
}

export function adaptProduct(r: ProductRowH, assetBase?: string): Product {
  return {
    id: r.slug,
    name_zh: r.name,
    name_en: r.name,
    tagline: r.summary || '',
    status: PRODUCT_STATUS_MAP[r.status] || 'Live',
    year: '',
    mrr: '',
    arr: '—',
    users: '',
    price: r.price_text || '',
    url: r.external_url || '#',
    desc: r.summary || '',
    stack: r.tags || [],
    color: FALLBACK_COLOR,
    features: (r.highlights || []).map((h) => ({ title: h.title, desc: h.description })),
  }
}

export function adaptPodcast(r: PodcastRowH): Podcast {
  return {
    id: r.slug,
    ep: r.ep || '',
    title: r.title,
    guest: r.guest || '独白',
    date: r.published_at ?? '',
    duration: r.duration || '',
    desc: r.excerpt || '',
    cover_color: r.cover_color || FALLBACK_COLOR,
    chapters: r.chapters || [],
  }
}

export function adaptVideo(r: VideoRowH): Video {
  return {
    id: r.slug,
    title: r.title,
    platform: platformLabel(r.platform),
    date: r.published_at ?? '',
    duration: r.duration || '',
    views: r.views || '',
    likes: r.likes || '',
    cover_color: r.cover_color || FALLBACK_COLOR,
    desc: r.description || '',
    tags: r.tags || [],
  }
}

export function adaptPage(r: PageRowH): PageEntry {
  return {
    id: r.slug,
    kind: (r.kind as PageEntry['kind']) || 'static',
    category: r.category || '页 · PAGE',
    title_zh: r.title,
    title_en: r.title_en || '',
    glyph: r.glyph || r.slug[0]?.toUpperCase() || '·',
    cover_color: r.cover_color || FALLBACK_COLOR,
    desc: r.excerpt || '',
    date: r.published_at || '',
  }
}

export function mediaFeed(podcasts: PodcastRowH[], videos: VideoRowH[]): MediaItem[] {
  const items: MediaItem[] = [
    ...podcasts.map((p) => ({ ...adaptPodcast(p), kind: 'podcast' as const })),
    ...videos.map((v) => ({ ...adaptVideo(v), kind: 'video' as const })),
  ]
  return items.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function adaptProfile(s: SiteSettings): Profile {
  return {
    name_zh: '唐三九',
    name_en: 'Sankyu Tang',
    handle: 'sankyu',
    title_zh: '独立开发者 · 一人公司',
    title_en: 'Indie Maker',
    intro_zh: s.introBody || s.siteDescription || '',
    intro_en: '',
    now_zh: s.introBody || '',
    now_en: '',
    location: 'Hangzhou, CN',
    email: 'hi@sankyu.me',
    avatar_initial: 'S',
  }
}

export function adaptSocial(s: SiteSettings): SocialLink[] {
  return (s.socialLinks || []).map((l) => ({
    id: socialIdFromPlatform(l.platform),
    label: l.platform,
    url: l.url,
  }))
}
