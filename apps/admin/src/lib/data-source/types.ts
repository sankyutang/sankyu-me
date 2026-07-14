// Shared shapes consumed by the ported design components.
// Both the mock and real data-source implementations return these.

export interface Profile {
  name_zh: string
  name_en: string
  handle: string
  title_zh: string
  title_en: string
  intro_zh: string
  intro_en: string
  now_zh: string
  now_en: string
  location: string
  email: string
  avatar_initial: string
}

export interface SocialLink {
  id: string
  label: string
  handle?: string
  url: string
}

export interface Post {
  id: string
  title_zh: string
  title_en: string
  kicker: string
  excerpt: string
  date: string
  reading: string
  tag: string
  cover_emoji?: string
  cover_src?: string
  cover_color?: string
}

export interface ProductFeatureItem {
  title: string
  desc: string
}

export interface ProductMetric {
  label: string
  value: string
  highlight?: boolean
}

export interface Product {
  id: string
  name_zh: string
  name_en: string
  tagline: string
  status: string
  year: string
  mrr: string
  arr: string
  users: string
  price: string
  url: string
  desc: string
  stack: string[]
  color: string
  story_title?: string
  story_lede?: string
  features?: ProductFeatureItem[]
  metrics?: ProductMetric[]
}

export interface Chapter {
  time: string
  title: string
}

export interface Podcast {
  id: string
  ep: string
  title: string
  guest: string
  date: string
  duration: string
  desc: string
  cover_color: string
  chapters?: Chapter[]
}

export interface Video {
  id: string
  title: string
  platform: string
  date: string
  duration: string
  views: string
  likes?: string
  comments?: number
  cover_color: string
  desc: string
  tags?: string[]
}

export type MediaItem =
  | (Podcast & { kind: 'podcast' })
  | (Video & { kind: 'video' })

export interface Subtopic {
  id: string
  title: string
  count: number
  glyph?: string
}

export interface PageLink {
  kind: 'external' | 'internal' | 'tool'
  title: string
  source: string
  url: string
  note?: string
  tag?: string
}

export interface PageEntry {
  id: string
  kind: 'topic' | 'collection' | 'static'
  category: string
  title_zh: string
  title_en: string
  glyph: string
  cover_color: string
  desc: string
  lede?: string
  date: string
  updates?: string
  maintain?: string
  item_count?: number
  pinned?: boolean
  tags?: string[]
  subtopics?: Subtopic[] | null
  items?: PageLink[]
}
