/**
 * Site robots.txt content.
 *
 * Mirrors the crawl policy currently visible on production (Cloudflare Managed
 * Content Signals + training-crawler Disallows, including Baiduspider) and adds
 * a Sitemap declaration. Does not loosen any existing disallow rules.
 *
 * NOTE: When Cloudflare zone "Managed robots.txt" is enabled, the edge may
 * serve Cloudflare's managed file instead of the R2 object. Repo publish still
 * writes this file so origin/R2 stay correct; enabling Sitemap on live may also
 * require a dashboard change (documented in the PR).
 */
export function buildRobotsTxt(siteUrl: string): string {
  const base = siteUrl.replace(/\/$/, '')
  return `# Content signals (search / AI use policy)
# search: building a search index and providing search results
# ai-input: inputting content into AI models for generative answers
# ai-train: training or fine-tuning AI models

User-agent: *
Content-Signal: search=yes,ai-train=no,use=reference
Allow: /

# Training crawlers
User-agent: Amazonbot
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Diffbot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: GPTBot
Disallow: /

User-agent: omgili
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: cohere-ai
Disallow: /

User-agent: MistralAI-Training
Disallow: /

User-agent: meta-externalagent
Disallow: /

User-agent: GoogleOther
Disallow: /

User-agent: Baiduspider
Disallow: /

User-agent: PetalBot
Disallow: /

User-agent: AwarioSmartBot
User-agent: AwarioRssBot
Disallow: /

User-agent: Google-CloudVertexBot
Disallow: /

User-agent: QualifiedBot
Disallow: /

User-agent: Cotoyogi
Disallow: /

User-agent: ICC-Crawler
Disallow: /

User-agent: atlassian-bot
Disallow: /

User-agent: FishBot
Disallow: /

User-agent: BorderxBot
Disallow: /

User-agent: NavuBot
Disallow: /

User-agent: SemrushBot-SWA
Disallow: /

User-agent: WARDBot
Disallow: /

User-agent: magpie-crawler
Disallow: /

User-agent: KimiBot
Disallow: /

User-agent: CitibotSiteCrawler
Disallow: /

Sitemap: ${base}/sitemap.xml
`
}

/** Detect Cloudflare Managed robots.txt that currently overrides origin. */
export function isCloudflareManagedRobots(body: string): boolean {
  return /BEGIN Cloudflare Managed content/i.test(body)
}
