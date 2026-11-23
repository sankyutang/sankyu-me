import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  buildRssXml,
  buildSitemapXml,
  collectSitemapUrls,
  escapeXml,
} from './xml'
import { buildRobotsTxt, isCloudflareManagedRobots } from './robots'

/** Minimal well-formedness: XML declaration, no HTML doctype, balanced root. */
function assertCleanXml(xml: string, rootOpen: RegExp, rootClose: string) {
  assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), 'missing XML declaration')
  assert.equal(xml.includes('<!DOCTYPE'), false, 'must not include HTML doctype')
  assert.equal(xml.includes('<!--?xml'), false, 'XML declaration must not be HTML-commented')
  assert.match(xml, rootOpen)
  assert.ok(xml.trimEnd().endsWith(rootClose))
}

describe('escapeXml', () => {
  it('escapes XML special characters', () => {
    assert.equal(escapeXml('a&b<c>"d"\'e'), 'a&amp;b&lt;c&gt;&quot;d&quot;&apos;e')
  })
})

describe('buildRssXml', () => {
  it('emits RSS 2.0 without HTML contamination and with closed link tags', () => {
    const xml = buildRssXml({
      siteName: 'sankyu.me',
      siteDescription: '广州 OPC 一人公司',
      siteUrl: 'https://sankyu.me/',
      posts: [
        {
          slug: 'hello',
          title: 'Title <A>',
          excerpt: 'A & B',
          published_at: '2026-11-09T14:40:00.000Z',
        },
      ],
    })
    assertCleanXml(xml, /<rss version="2\.0">/, '</rss>')
    assert.match(xml, /<link>https:\/\/sankyu\.me<\/link>/)
    assert.match(xml, /<link>https:\/\/sankyu\.me\/posts\/hello<\/link>/)
    assert.match(xml, /<guid isPermaLink="true">https:\/\/sankyu\.me\/posts\/hello<\/guid>/)
    assert.match(xml, /<title>Title &lt;A&gt;<\/title>/)
    assert.match(xml, /<description>A &amp; B<\/description>/)
    // Regression: HTML void <link> must not swallow following tags
    assert.equal(/<link>[^<]*<\/channel>/.test(xml), false)
    assert.equal(/<link>[^<]*<\/item>/.test(xml), false)
  })
})

describe('buildSitemapXml', () => {
  it('emits a clean urlset with expected locs', () => {
    const urls = collectSitemapUrls({
      siteUrl: 'https://sankyu.me',
      posts: [{ slug: 'a', updated_at: '2026-01-02T00:00:00.000Z' }],
      products: [],
      podcasts: [],
      videos: [],
      pages: [],
    })
    const xml = buildSitemapXml(urls)
    assertCleanXml(xml, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/, '</urlset>')
    assert.match(xml, /<loc>https:\/\/sankyu\.me\/<\/loc>/)
    assert.match(xml, /<loc>https:\/\/sankyu\.me\/posts\/a<\/loc>/)
    assert.match(xml, /<loc>https:\/\/sankyu\.me\/about<\/loc>/)
    assert.match(xml, /<lastmod>2026-01-02T00:00:00\.000Z<\/lastmod>/)
  })
})

describe('buildRobotsTxt', () => {
  it('keeps Baiduspider disallow and adds Sitemap', () => {
    const body = buildRobotsTxt('https://sankyu.me')
    assert.match(body, /User-agent:\s*Baiduspider[\s\S]*?Disallow:\s*\//)
    assert.match(body, /User-agent:\s*GPTBot[\s\S]*?Disallow:\s*\//)
    assert.match(body, /Sitemap:\s*https:\/\/sankyu\.me\/sitemap\.xml/)
  })

  it('detects Cloudflare managed robots', () => {
    assert.equal(isCloudflareManagedRobots('# BEGIN Cloudflare Managed content\n'), true)
    assert.equal(isCloudflareManagedRobots('User-agent: *\nAllow: /\n'), false)
  })
})
