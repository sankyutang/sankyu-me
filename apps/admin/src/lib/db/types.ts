export type Collection =
  | 'posts'
  | 'pages'
  | 'products'
  | 'podcasts'
  | 'videos'

export interface PostRow {
  id: number
  slug: string
  title: string
  excerpt: string | null
  cover_image: string | null
  status: 'draft' | 'published'
  published_at: string | null
  featured: 0 | 1
  category: string | null
  tags: string
  reading_time: number | null
  seo_title: string | null
  seo_description: string | null
  og_image: string | null
  canonical_url: string | null
  related_posts: string
  content_markdoc: string
  created_at: string
  updated_at: string
}

export interface PageRow {
  id: number
  slug: string
  title: string
  seo_title: string | null
  seo_description: string | null
  og_image: string | null
  content_markdoc: string
  created_at: string
  updated_at: string
}

export interface ProductRow {
  id: number
  slug: string
  name: string
  summary: string | null
  cover_image: string | null
  status: 'active' | 'coming-soon' | 'archived'
  product_type: string
  price_text: string | null
  external_url: string | null
  cta_text: string | null
  featured: 0 | 1
  tags: string
  highlights: string
  audience: string
  faq: string
  related_posts: string
  seo_title: string | null
  seo_description: string | null
  og_image: string | null
  content_markdoc: string
  created_at: string
  updated_at: string
}

export interface PodcastRow {
  id: number
  slug: string
  title: string
  excerpt: string | null
  cover_image: string | null
  audio_url: string | null
  duration: string | null
  published_at: string | null
  status: 'draft' | 'published'
  external_links: string
  related_posts: string
  seo_title: string | null
  seo_description: string | null
  og_image: string | null
  content_markdoc: string
  created_at: string
  updated_at: string
}

export interface VideoRow {
  id: number
  slug: string
  title: string
  platform: 'youtube' | 'bilibili'
  video_url: string | null
  thumbnail: string | null
  description: string | null
  published_at: string | null
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
}

export interface SiteSettings {
  siteName: string
  siteUrl: string
  siteDescription: string
  defaultSeoTitle: string
  defaultSeoDescription: string
  defaultOgImage: string | null
  mainNav: { label: string; href: string }[]
  socialLinks: { platform: string; url: string }[]
  introHeadline: string
  introBody: string
  footerEmoji: string
}

// Hydrated (JSON-parsed) versions used by templates
export type Post = Omit<PostRow, 'tags' | 'related_posts' | 'featured'> & {
  tags: string[]
  related_posts: string[]
  featured: boolean
}
export type Product = Omit<
  ProductRow,
  'tags' | 'highlights' | 'audience' | 'faq' | 'related_posts' | 'featured'
> & {
  tags: string[]
  highlights: { title: string; description: string }[]
  audience: string[]
  faq: { question: string; answer: string }[]
  related_posts: string[]
  featured: boolean
}
export type Podcast = Omit<PodcastRow, 'external_links' | 'related_posts'> & {
  external_links: { platform: string; url: string }[]
  related_posts: string[]
}
export type Page = PageRow
export type Video = VideoRow
