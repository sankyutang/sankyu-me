// Real implementation — reads from Keystatic (mdoc/yaml in git) at build time.
// NOTE: createReader uses the filesystem, so pages consuming this must be
// prerendered (build-time). Field shapes are mapped onto the design shapes
// with sensible fallbacks where the CMS schema is sparser than the design.
import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../../../keystatic.config'
import type {
  Profile,
  SocialLink,
  Post,
  Product,
  MediaItem,
  Podcast,
  Video,
  PageEntry,
} from './types'

const reader = createReader(process.cwd(), keystaticConfig)

const FALLBACK_COLOR = '#c8553d'

function platformLabel(p: string | undefined): string {
  if (!p) return ''
  if (p.toLowerCase() === 'youtube') return 'YouTube'
  if (p.toLowerCase() === 'bilibili') return 'Bilibili'
  return p
}

function socialIdFromPlatform(platform: string): string {
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

export async function getProfile(): Promise<Profile> {
  let s: any = null
  try {
    s = await reader.singletons.siteSettings.read()
  } catch {}
  return {
    name_zh: '唐三九',
    name_en: 'Sankyu Tang',
    handle: 'sankyu',
    title_zh: '独立开发者 · 一人公司',
    title_en: 'Indie Maker',
    intro_zh: s?.introBody || s?.siteDescription || '',
    intro_en: '',
    now_zh: s?.introBody || '',
    now_en: '',
    location: 'Hangzhou, CN',
    email: 'hi@sankyu.me',
    avatar_initial: 'S',
  }
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  let s: any = null
  try {
    s = await reader.singletons.siteSettings.read()
  } catch {}
  const links = (s?.socialLinks || []) as { platform: string; url: string }[]
  return links.map((l) => ({
    id: socialIdFromPlatform(l.platform),
    label: l.platform,
    url: l.url,
  }))
}

export async function getPosts(): Promise<Post[]> {
  const all = await reader.collections.posts.all()
  return all
    .filter((p) => p.entry.status === 'published')
    .map((p) => ({
      id: p.slug,
      title_zh: p.entry.title,
      title_en: '',
      kicker: p.entry.category || 'Essay · 札记',
      excerpt: p.entry.excerpt || '',
      cover_color: FALLBACK_COLOR,
      cover_src: p.entry.coverImage || undefined,
      date: p.entry.publishedAt ?? '',
      reading: p.entry.readingTime ? `${p.entry.readingTime} min` : '',
      tag: p.entry.category || '文章',
      cover_emoji: '✒︎',
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPost(slug: string): Promise<Post | null> {
  const posts = await getPosts()
  return posts.find((p) => p.id === slug) ?? null
}

const PRODUCT_STATUS_MAP: Record<string, string> = {
  active: 'Live',
  'coming-soon': 'Beta',
  archived: 'Sunset',
}

export async function getProducts(): Promise<Product[]> {
  const all = await reader.collections.products.all()
  return all
    .filter((p) => p.entry.status !== undefined)
    .map((p) => ({
      id: p.slug,
      name_zh: p.entry.name,
      name_en: p.entry.name,
      tagline: p.entry.summary || '',
      status: PRODUCT_STATUS_MAP[p.entry.status] || 'Live',
      year: '',
      mrr: '',
      arr: '—',
      users: '',
      price: p.entry.priceText || '',
      url: p.entry.externalUrl || '#',
      desc: p.entry.summary || '',
      stack: (p.entry.tags as string[]) || [],
      color: FALLBACK_COLOR,
      features: ((p.entry.highlights as any[]) || []).map((h) => ({
        title: h.title,
        desc: h.description,
      })),
    }))
}

export async function getProduct(slug: string): Promise<Product | null> {
  const products = await getProducts()
  return products.find((p) => p.id === slug) ?? null
}

async function readPodcasts(): Promise<Podcast[]> {
  const all = await reader.collections.podcasts.all()
  return all
    .filter((p) => p.entry.status === 'published')
    .map((p) => ({
      id: p.slug,
      ep: (p.entry as any).ep || '',
      title: p.entry.title,
      guest: (p.entry as any).guest || '独白',
      date: p.entry.publishedAt ?? '',
      duration: p.entry.duration || '',
      desc: p.entry.excerpt || '',
      cover_color: (p.entry as any).coverColor || FALLBACK_COLOR,
      chapters: ((p.entry as any).chapters as any[]) || [],
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

async function readVideos(): Promise<Video[]> {
  const all = await reader.collections.videos.all()
  return all
    .filter((v) => v.entry.status === 'published')
    .map((v) => ({
      id: v.slug,
      title: v.entry.title,
      platform: platformLabel(v.entry.platform),
      date: v.entry.publishedAt ?? '',
      duration: (v.entry as any).duration || '',
      views: (v.entry as any).views || '',
      likes: (v.entry as any).likes || '',
      cover_color: (v.entry as any).coverColor || FALLBACK_COLOR,
      desc: v.entry.description || '',
      tags: ((v.entry as any).tags as string[]) || [],
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPodcasts() {
  return readPodcasts()
}

export async function getVideos() {
  return readVideos()
}

export async function getMediaFeed(): Promise<MediaItem[]> {
  const [pods, vids] = await Promise.all([readPodcasts(), readVideos()])
  const items: MediaItem[] = [
    ...pods.map((p) => ({ ...p, kind: 'podcast' as const })),
    ...vids.map((v) => ({ ...v, kind: 'video' as const })),
  ]
  return items.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPodcast(slug: string): Promise<Podcast | null> {
  const pods = await readPodcasts()
  return pods.find((p) => p.id === slug) ?? null
}

export async function getVideo(slug: string): Promise<Video | null> {
  const vids = await readVideos()
  return vids.find((v) => v.id === slug) ?? null
}

export async function getPages(): Promise<PageEntry[]> {
  const all = await reader.collections.pages.all()
  return all.map((p) => ({
    id: p.slug,
    kind: ((p.entry as any).kind as PageEntry['kind']) || 'static',
    category: (p.entry as any).category || '页 · PAGE',
    title_zh: p.entry.title,
    title_en: (p.entry as any).titleEn || '',
    glyph: (p.entry as any).glyph || p.slug[0]?.toUpperCase() || '·',
    cover_color: (p.entry as any).coverColor || FALLBACK_COLOR,
    desc: (p.entry as any).excerpt || p.entry.seoDescription || '',
    date: (p.entry as any).publishedAt || '',
  }))
}

export async function getPage(slug: string): Promise<PageEntry | null> {
  const pages = await getPages()
  return pages.find((p) => p.id === slug) ?? null
}
