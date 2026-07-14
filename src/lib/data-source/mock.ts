// Mock implementation — returns design-draft data with the same shape as real.ts.
import { mockData } from '../mock/data'
import type {
  Profile,
  SocialLink,
  Post,
  Product,
  MediaItem,
  PageEntry,
} from './types'

export async function getProfile(): Promise<Profile> {
  return mockData.profile
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  return mockData.social
}

export async function getPosts(): Promise<Post[]> {
  return [...mockData.posts].sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPost(slug: string): Promise<Post | null> {
  return mockData.posts.find((p) => p.id === slug) ?? null
}

export async function getProducts(): Promise<Product[]> {
  return mockData.products
}

export async function getProduct(slug: string): Promise<Product | null> {
  return mockData.products.find((p) => p.id === slug) ?? null
}

export async function getMediaFeed(): Promise<MediaItem[]> {
  const items: MediaItem[] = [
    ...mockData.podcasts.map((p) => ({ ...p, kind: 'podcast' as const })),
    ...mockData.videos.map((v) => ({ ...v, kind: 'video' as const })),
  ]
  return items.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPodcasts() {
  return [...mockData.podcasts].sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getVideos() {
  return [...mockData.videos].sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPodcast(slug: string) {
  return mockData.podcasts.find((p) => p.id === slug) ?? null
}

export async function getVideo(slug: string) {
  return mockData.videos.find((v) => v.id === slug) ?? null
}

export async function getPages(): Promise<PageEntry[]> {
  return mockData.pages
}

export async function getPage(slug: string): Promise<PageEntry | null> {
  return mockData.pages.find((p) => p.id === slug) ?? null
}
