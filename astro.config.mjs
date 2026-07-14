import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import react from '@astrojs/react'
import keystatic from '@keystatic/astro'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://sankyu.me',
  adapter: cloudflare(),
  integrations: [react(), keystatic(), mdx(), sitemap()],
  redirects: {
    '/blog': '/posts',
    '/blog/[slug]': '/posts/[slug]',
    '/works': '/products',
    '/podcast': '/media',
    '/videos': '/media',
    '/now': '/pages/now',
    '/uses': '/pages/uses',
    '/links': '/pages',
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
