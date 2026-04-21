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
  vite: {
    plugins: [tailwindcss()],
  },
})
