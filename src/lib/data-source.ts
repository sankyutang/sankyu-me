// Data-source entry point.
// Switches between mock (design verification) and real (Keystatic) by env.
// PUBLIC_USE_MOCK=1 enables mock. Default OFF — production always uses real.
import type {
  Profile,
  SocialLink,
  Post,
  Product,
  MediaItem,
  Podcast,
  Video,
  PageEntry,
} from './data-source/types'

const USE_MOCK = import.meta.env.PUBLIC_USE_MOCK === '1'

const impl = USE_MOCK
  ? await import('./data-source/mock')
  : await import('./data-source/real')

export const getProfile: () => Promise<Profile> = impl.getProfile
export const getSocialLinks: () => Promise<SocialLink[]> = impl.getSocialLinks
export const getPosts: () => Promise<Post[]> = impl.getPosts
export const getPost: (slug: string) => Promise<Post | null> = impl.getPost
export const getProducts: () => Promise<Product[]> = impl.getProducts
export const getProduct: (slug: string) => Promise<Product | null> = impl.getProduct
export const getMediaFeed: () => Promise<MediaItem[]> = impl.getMediaFeed
export const getPodcasts: () => Promise<Podcast[]> = impl.getPodcasts
export const getVideos: () => Promise<Video[]> = impl.getVideos
export const getPodcast: (slug: string) => Promise<Podcast | null> = impl.getPodcast
export const getVideo: (slug: string) => Promise<Video | null> = impl.getVideo
export const getPages: () => Promise<PageEntry[]> = impl.getPages
export const getPage: (slug: string) => Promise<PageEntry | null> = impl.getPage

export type {
  Profile,
  SocialLink,
  Post,
  Product,
  MediaItem,
  Podcast,
  Video,
  PageEntry,
}
