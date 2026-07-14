import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  output: 'server',
  adapter: cloudflare({ platformProxy: { enabled: true } }),
  // Public render output is uploaded to R2 as standalone HTML, so inline all CSS
  // — the paper theme must travel with each page (no _astro/* asset hop).
  build: { inlineStylesheets: 'always' },
  integrations: [react()],
  // Disable built-in markdown features so shiki (which needs node:fs) is not bundled.
  markdown: {
    syntaxHighlight: false,
    gfm: false,
    smartypants: false,
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      // BUILD ONLY: React SSR runs inside workerd (output:'server'); the default
      // react-dom/server.browser build references MessageChannel at init, which
      // workerd doesn't define. Use the edge build for the deployed Worker.
      // In dev (Node/Vite ESM) the edge build's CJS `require` fails, so leave
      // the alias off — Astro sets NODE_ENV=production during `astro build`.
      alias:
        process.env.NODE_ENV === 'production'
          ? { 'react-dom/server': 'react-dom/server.edge' }
          : {},
    },
  },
})
