import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../../../keystatic.config'

export async function GET(context: APIContext) {
  const reader = createReader(process.cwd(), keystaticConfig)
  const allPosts = await reader.collections.posts.all()

  const posts = allPosts
    .filter((p) => p.entry.status === 'published')
    .sort((a, b) => {
      const da = a.entry.publishedAt ? new Date(a.entry.publishedAt).getTime() : 0
      const db = b.entry.publishedAt ? new Date(b.entry.publishedAt).getTime() : 0
      return db - da
    })
    .slice(0, 50)

  return rss({
    title: 'sankyu.me',
    description: 'Personal brand site — systems, AI workflows, indie building, and products.',
    site: context.site!.toString(),
    items: posts.map((post) => ({
      title: post.entry.title,
      pubDate: post.entry.publishedAt ? new Date(post.entry.publishedAt) : new Date(),
      description: post.entry.excerpt || '',
      link: `/blog/${post.slug}/`,
    })),
  })
}
