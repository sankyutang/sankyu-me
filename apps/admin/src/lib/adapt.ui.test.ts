/**
 * Lightweight UI-contract checks for editorial redesign.
 * Run: npx tsx apps/admin/src/lib/adapt.ui.test.ts
 */
import { adaptProfile, adaptSocial, adaptPost } from './adapt'
import type { SiteSettings } from './db/types'

function assert(cond: unknown, msg: string) {
  if (!cond) throw new Error(msg)
}

const emptySettings = { siteName: 'sankyu.me' } as SiteSettings

const profile = adaptProfile(emptySettings)
assert(profile.name_zh === '三桥', 'name_zh')
assert(profile.location === 'Guangzhou, CN', 'location')
assert(profile.intro_zh.includes('广州'), 'intro mentions Guangzhou')
assert(!/阅读优先的个人博客/.test(profile.intro_zh), 'no design-spec intro')
assert(profile.now_zh === '', 'no duplicated now card')

const social = adaptSocial(emptySettings)
assert(social.some((s) => s.id === 'x' && s.url.includes('imsankyu')), 'default X')
assert(social.some((s) => s.id === 'github' && s.url.includes('sankyutang')), 'default GitHub')

const withX = adaptSocial({
  ...emptySettings,
  socialLinks: [{ platform: 'X', url: 'https://x.com/imsankyu' }],
})
assert(withX.some((s) => s.id === 'github'), 'merges GitHub when only X set')

const post = adaptPost(
  {
    id: 1,
    slug: 'ai-coding-week-48-prompts',
    title: '一个人加一个 AI 编程助手，一周做了什么：48 条指令的复盘',
    excerpt: 'excerpt',
    cover_image: null,
    status: 'published',
    published_at: '2026-11-09T14:40:00.000Z',
    featured: 0,
    category: 'AI',
    tags: [],
    reading_time: null,
    seo_title: null,
    seo_description: null,
    og_image: null,
    canonical_url: null,
    related_posts: [],
    content_markdoc: '',
    created_at: '',
    updated_at: '',
  },
  'https://sankyu.me'
)
assert(post.tag === 'AI', 'post tag from category')
assert(!/PomoHut|番茄钟/.test(JSON.stringify(post)), 'no unpublished product leakage')

console.log('adapt.ui.test.ts: ok')
