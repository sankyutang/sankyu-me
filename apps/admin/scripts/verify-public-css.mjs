const STYLESHEET_PATTERN = /<link\b(?=[^>]*\brel=["'][^"']*\bstylesheet\b[^"']*["'])(?=[^>]*\bhref=["']([^"']+)["'])[^>]*>/gi

export function stylesheetsFromHtml(html, pageUrl) {
  const stylesheets = []
  for (const match of html.matchAll(STYLESHEET_PATTERN)) {
    const url = new URL(match[1], pageUrl)
    if (url.pathname.startsWith('/_astro/')) stylesheets.push(url)
  }
  return [...new Map(stylesheets.map((url) => [url.href, url])).values()]
}

export async function verifyPublicCss({ siteBaseUrl, paths, fetchImpl = fetch }) {
  const verified = []
  for (const path of paths) {
    const pageUrl = new URL(path, siteBaseUrl)
    const page = await fetchImpl(pageUrl)
    if (!page.ok) throw new Error(`Public page ${pageUrl} returned ${page.status}`)

    const stylesheets = stylesheetsFromHtml(await page.text(), pageUrl)
    if (path !== '/' && stylesheets.length === 0) {
      throw new Error(`Public page ${pageUrl} does not reference an /_astro stylesheet`)
    }

    for (const stylesheet of stylesheets) {
      const response = await fetchImpl(stylesheet)
      const contentType = response.headers.get('content-type') ?? ''
      if (!response.ok || !contentType.startsWith('text/css')) {
        throw new Error(`Stylesheet ${stylesheet} returned ${response.status} (${contentType || 'no content type'})`)
      }
      verified.push(stylesheet.href)
    }
  }
  return verified
}

async function main() {
  const siteBaseUrl = process.env.SITE_BASE_URL ?? 'https://sankyu.me'
  const paths = (process.env.PUBLIC_VERIFY_PATHS ?? '/,/blog/,/blog/travel-in-Hokkaido-japan')
    .split(',')
    .map((path) => path.trim())
    .filter(Boolean)
  const verified = await verifyPublicCss({ siteBaseUrl, paths })
  console.log(`Verified ${verified.length} public stylesheet(s).`)
}

if (process.argv[1] && new URL(import.meta.url).pathname.endsWith(process.argv[1])) {
  main().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
