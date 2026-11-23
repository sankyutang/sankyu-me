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
import { SITE_POSITIONING, firstNonEmpty } from './seo/defaults'

const FALLBACK_COLOR = '#2e6ceb'

/**
 * Legacy uploads used ASSET_BASE_URL=`…/assets` while storing R2 keys under
 * `editor/…`, producing broken `/assets/editor/…` public URLs. Rewrite those
 * to the working `/editor/…` path; leave other `/assets/…` keys alone.
 */
export function normalizePublicAssetUrl(url: string): string {
  return url.replace(/^(https?:\/\/[^/?#]+)\/assets\/(editor\/)/i, '$1/$2')
}

export function assetUrl(base: string | undefined, src: string | null): string | undefined {
  if (!src) return undefined
  if (/^https?:\/\//.test(src)) return normalizePublicAssetUrl(src)
  const cleanedBase = (base || '').replace(/\/$/, '').replace(/\/assets$/i, '')
  if (!cleanedBase) return normalizePublicAssetUrl(src.startsWith('/') ? src : `/${src}`)
  return normalizePublicAssetUrl(`${cleanedBase}/${src.replace(/^\//, '')}`)
}

/** First usable absolute asset URL from cover/og candidates (for meta tags). */
export function absoluteAssetUrl(
  siteUrl: string | undefined,
  assetBase: string | undefined,
  ...candidates: Array<string | null | undefined>
): string | undefined {
  const origin = (siteUrl || assetBase || '').replace(/\/$/, '').replace(/\/assets$/i, '')
  for (const candidate of candidates) {
    const resolved = assetUrl(assetBase || siteUrl, candidate ?? null)
    if (!resolved) continue
    if (/^https?:\/\//.test(resolved)) return resolved
    if (!origin) return resolved
    return `${origin}${resolved.startsWith('/') ? resolved : `/${resolved}`}`
  }
  return undefined
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

/** Natural public bio — not design-spec copy. Settings fields win when present. */
const DEFAULT_INTRO_ZH =
  '广州。2024 年起做一人公司：独立开发与 FDE，也写 AI 实践与生活。前大厂前端。'

const DEFAULT_SOCIAL: SocialLink[] = [
  { id: 'x', label: 'X · @imsankyu', url: 'https://x.com/imsankyu' },
  { id: 'github', label: 'GitHub · sankyutang', url: 'https://github.com/sankyutang' },
]

export function adaptProfile(s: SiteSettings): Profile {
  // Keep approved About intro wording; do not substitute SEO marketing copy.
  const intro = firstNonEmpty(s.introBody, s.siteDescription, DEFAULT_INTRO_ZH)
  return {
    name_zh: SITE_POSITIONING.nameZh,
    name_en: SITE_POSITIONING.nameEn,
    handle: 'sankyu',
    title_zh: firstNonEmpty(s.introHeadline, SITE_POSITIONING.titleZh),
    title_en: SITE_POSITIONING.titleEn,
    intro_zh: intro,
    intro_en: '',
    // No separate "now" field in site_settings yet — avoid duplicating intro in NowCard.
    now_zh: '',
    now_en: '',
    location: SITE_POSITIONING.location,
    email: SITE_POSITIONING.email,
    avatar_initial: 'S',
  }
}

export function adaptSocial(s: SiteSettings): SocialLink[] {
  const fromSettings = (s.socialLinks || [])
    .filter((l) => l.url && l.url !== '#')
    .map((l) => ({
      id: socialIdFromPlatform(l.platform),
      label: l.platform,
      url: l.url,
    }))
  if (fromSettings.length === 0) return DEFAULT_SOCIAL

  const ids = new Set(fromSettings.map((l) => l.id))
  const merged = [...fromSettings]
  for (const fallback of DEFAULT_SOCIAL) {
    if (!ids.has(fallback.id)) merged.push(fallback)
  }
  return merged.map((l) => {
    if (l.id === 'x' && (!l.label || l.label === 'X')) return { ...l, label: 'X · @imsankyu' }
    if (l.id === 'github' && (!l.label || /^github$/i.test(l.label))) {
      return { ...l, label: 'GitHub · sankyutang' }
    }
    return l
  })
}
