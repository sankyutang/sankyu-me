import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  output: 'server',
  adapter: cloudflare({ platformProxy: { enabled: true } }),
  integrations: [],
  // Disable built-in markdown features so shiki (which needs node:fs) is not bundled.
  markdown: {
    syntaxHighlight: false,
    gfm: false,
    smartypants: false,
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
